#!/usr/bin/env python3
"""
Fix / rewrite low-value URL content until it clears ALL three gates:

  1) Similarity  < 30%   (cosine vs already-approved pages)
  2) Quality     = 10/10
  3) Rubric      ≥ 12/13

Primary LLM: DeepSeek (OpenAI-compatible)
Fallback LLM: OpenAI gpt-4o

CSV columns expected (extras ignored):
  url, title, question, answer

Usage:
  export DEEPSEEK_API_KEY=...          # or ds1
  export OPENAI_API_KEY=...            # optional fallback
  python3 _fix_urls_quality.py low_value_urls.csv -o high_value_urls.csv

  # load keys from drip env file:
  python3 _fix_urls_quality.py low_value_urls.csv --env /tmp/aq-drip.env
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

import pandas as pd
from openai import APIError, OpenAI, RateLimitError
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ── HARD GATES (owner) ──────────────────────────────────────────────
SIM_MAX = 0.30          # similarity must be STRICTLY under 30%
QUALITY_MIN = 10        # quality must be 10/10
RUBRIC_MIN = 12         # rubric must be at least 12/13

RUBRIC_PROMPT = """
Evaluate the following SEO content based on a 13-point Helpful Content Rubric.
Criteria include: 1. Originality, 2. Comprehensiveness, 3. Insightful analysis, 4. No fluff/filler, 5. Clear title, 6. Avoids clickbait, 7. Shows E-E-A-T, 8. Free of errors, 9. Substantial value over competitors, 10. Genuine intent, 11. Answers the user's implicit question, 12. Good formatting, and 13. ZERO TOPIC DRIFT (The content maintains the exact core truth/intent of the original question without adding hallucinated/unrelated topics).

Provide a JSON response with:
- "rubric_score": (int out of 13)
- "quality_score": (int out of 10)
- "feedback": (string detailing what to fix if it fails)
"""


def load_env_file(path: str) -> None:
    """Load KEY=VAL lines into os.environ (does not overwrite existing)."""
    p = Path(path)
    if not p.exists():
        return
    for raw in p.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.strip()
        v = v.strip()
        if (v.startswith("'") and v.endswith("'")) or (v.startswith('"') and v.endswith('"')):
            v = v[1:-1]
        if k and k not in os.environ:
            os.environ[k] = v


def make_clients() -> tuple[OpenAI | None, OpenAI | None]:
    deepseek_key = (
        os.environ.get("DEEPSEEK_API_KEY")
        or os.environ.get("ds1")
        or os.environ.get("DEEPSEEK_KEY")
        or ""
    ).strip()
    openai_key = (os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_KEY") or "").strip()

    primary = None
    fallback = None
    if deepseek_key:
        primary = OpenAI(api_key=deepseek_key, base_url="https://api.deepseek.com")
    if openai_key:
        fallback = OpenAI(api_key=openai_key)
    if not primary and not fallback:
        raise SystemExit(
            "No LLM key found. Set DEEPSEEK_API_KEY (or ds1) and/or OPENAI_API_KEY, "
            "or pass --env /tmp/aq-drip.env"
        )
    return primary, fallback


def call_llm_with_fallback(
    primary: OpenAI | None,
    fallback: OpenAI | None,
    messages: list[dict[str, str]],
    response_format: dict[str, str] | None = None,
    max_tokens: int = 4000,
) -> str:
    """DeepSeek first; fall back to OpenAI on rate limit / API errors."""
    errors: list[str] = []

    if primary is not None:
        try:
            kwargs: dict[str, Any] = {
                "model": os.environ.get("DEEPSEEK_MODEL", "deepseek-chat"),
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.4,
            }
            if response_format:
                kwargs["response_format"] = response_format
            response = primary.chat.completions.create(**kwargs)
            return (response.choices[0].message.content or "").strip()
        except (RateLimitError, APIError, Exception) as e:
            errors.append(f"DeepSeek: {e}")
            print(f"  DeepSeek failed ({e}). Trying OpenAI fallback...")

    if fallback is not None:
        try:
            kwargs = {
                "model": os.environ.get("OPENAI_MODEL", "gpt-4o"),
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.4,
            }
            if response_format:
                kwargs["response_format"] = response_format
            response = fallback.chat.completions.create(**kwargs)
            return (response.choices[0].message.content or "").strip()
        except Exception as e:
            errors.append(f"OpenAI: {e}")

    raise RuntimeError("All LLM providers failed: " + " | ".join(errors))


def extract_json(raw: str) -> dict[str, Any]:
    """Parse JSON even if the model wraps it in fences or prose."""
    text = (raw or "").strip()
    if not text:
        raise ValueError("empty LLM response")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = re.search(r"\{[\s\S]*\}", text)
    if not m:
        raise ValueError(f"no JSON object in response: {text[:200]}")
    return json.loads(m.group(0))


def get_max_similarity(new_text: str, existing_corpus: list[str]) -> float:
    """Cosine similarity vs already-approved pages. Pass only if < SIM_MAX (30%)."""
    if not existing_corpus:
        return 0.0
    corpus = [t for t in existing_corpus if str(t).strip()]
    if not corpus:
        return 0.0
    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform([new_text] + corpus)
    sims = cosine_similarity(matrix[0:1], matrix[1:])
    return float(sims.max()) if sims.size else 0.0


def pct(x: float) -> str:
    return f"{100.0 * float(x):.1f}%"


def evaluate_content(
    primary: OpenAI | None,
    fallback: OpenAI | None,
    text: str,
) -> dict[str, Any]:
    messages = [
        {"role": "system", "content": RUBRIC_PROMPT},
        {"role": "user", "content": text[:12000]},
    ]
    raw = call_llm_with_fallback(
        primary, fallback, messages, response_format={"type": "json_object"}, max_tokens=800
    )
    data = extract_json(raw)
    return {
        "rubric_score": int(data.get("rubric_score") or 0),
        "quality_score": int(data.get("quality_score") or 0),
        "feedback": str(data.get("feedback") or "Improve clarity, originality, and answer the question directly."),
    }


def rewrite_content(
    primary: OpenAI | None,
    fallback: OpenAI | None,
    original_text: str,
    current_text: str,
    feedback: str,
    similarity_warning: bool = False,
) -> str:
    prompt = f"Rewrite this content to fix these specific issues: {feedback}."
    if similarity_warning:
        prompt += (
            " Also, this content is too similar to other pages. Change the sentence "
            "structure, vocabulary, and phrasing significantly to make it 100% unique."
        )
    prompt += (
        "\n\nDRIFT PROTECTION: Maintain the exact core factual meaning and intent of the "
        "Original Text. Do not hallucinate new subjects."
        f"\n\nOriginal Text (For Grounding):\n{original_text[:8000]}"
        f"\n\nCurrent Text to Fix:\n{current_text[:8000]}"
    )
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert SEO content optimizer. Output ONLY the improved page text "
                "(title/question/answer prose). No preamble, no markdown fences, no JSON."
            ),
        },
        {"role": "user", "content": prompt},
    ]
    return call_llm_with_fallback(primary, fallback, messages, max_tokens=5000)


def row_text(row: pd.Series) -> str:
    parts = []
    for col in ("title", "question", "answer", "content", "body", "optimized_content"):
        if col in row and pd.notna(row[col]) and str(row[col]).strip():
            parts.append(str(row[col]).strip())
    return "\n\n".join(parts) if parts else str(row.get("url", ""))


def process_dataset(
    input_csv: str,
    output_csv: str,
    max_retries: int = 3,
    sleep_s: float = 0.5,
) -> None:
    """Pass only when: similarity < 30% AND quality 10/10 AND rubric ≥ 12/13."""
    primary, fallback = make_clients()
    df = pd.read_csv(input_csv)
    if "url" not in df.columns:
        raise SystemExit("CSV must include a 'url' column")

    print(
        f"GATES locked: similarity < {pct(SIM_MAX)} · "
        f"quality {QUALITY_MIN}/10 · rubric ≥ {RUBRIC_MIN}/13"
    )

    for col in (
        "optimized_content",
        "rubric_score",
        "quality_score",
        "max_similarity",
        "similarity_pct",
        "pass",
        "attempts",
        "feedback",
    ):
        if col not in df.columns:
            df[col] = None

    approved_corpus: list[str] = []

    for index, row in df.iterrows():
        url = row.get("url", f"row-{index}")
        print(f"\nProcessing URL: {url}")
        original_text = row_text(row)
        current_text = original_text
        if not current_text.strip():
            print("  -> Empty content, skipping")
            continue

        attempts = 0
        passed = False
        last_eval = {"rubric_score": 0, "quality_score": 0, "feedback": ""}
        max_sim = 0.0

        while attempts < max_retries and not passed:
            max_sim = get_max_similarity(current_text, approved_corpus)
            sim_passed = max_sim < SIM_MAX  # strictly under 30%

            try:
                last_eval = evaluate_content(primary, fallback, current_text)
            except Exception as e:
                print(f"  -> Evaluate failed: {e}")
                attempts += 1
                time.sleep(sleep_s)
                continue

            # quality must be exactly/at least 10/10; rubric at least 12/13
            rubric_passed = last_eval["rubric_score"] >= RUBRIC_MIN
            quality_passed = last_eval["quality_score"] >= QUALITY_MIN

            if sim_passed and rubric_passed and quality_passed:
                print(
                    f"  -> PASSED · sim {pct(max_sim)} < 30% · "
                    f"quality {last_eval['quality_score']}/10 · "
                    f"rubric {last_eval['rubric_score']}/13"
                )
                approved_corpus.append(current_text)
                df.at[index, "optimized_content"] = current_text
                df.at[index, "rubric_score"] = last_eval["rubric_score"]
                df.at[index, "quality_score"] = last_eval["quality_score"]
                df.at[index, "max_similarity"] = round(max_sim, 4)
                df.at[index, "similarity_pct"] = round(100.0 * max_sim, 2)
                df.at[index, "pass"] = True
                df.at[index, "attempts"] = attempts
                df.at[index, "feedback"] = last_eval.get("feedback", "")
                passed = True
                break

            attempts += 1
            fail_bits = []
            if not sim_passed:
                fail_bits.append(f"sim {pct(max_sim)} ≥ 30%")
            if not quality_passed:
                fail_bits.append(f"quality {last_eval['quality_score']}/10 (need 10)")
            if not rubric_passed:
                fail_bits.append(f"rubric {last_eval['rubric_score']}/13 (need ≥12)")
            print(f"  -> FAILED · {' · '.join(fail_bits)} · retry {attempts}/{max_retries}")
            try:
                current_text = rewrite_content(
                    primary,
                    fallback,
                    original_text,
                    current_text,
                    last_eval["feedback"],
                    similarity_warning=not sim_passed,
                )
            except Exception as e:
                print(f"  -> Rewrite failed: {e}")
            time.sleep(sleep_s)

        if not passed:
            print(f"  -> Max retries hit for {url}. Saving best attempt (NOT a pass).")
            approved_corpus.append(current_text)
            df.at[index, "optimized_content"] = current_text
            df.at[index, "rubric_score"] = last_eval.get("rubric_score", 0)
            df.at[index, "quality_score"] = last_eval.get("quality_score", 0)
            df.at[index, "max_similarity"] = round(max_sim, 4)
            df.at[index, "similarity_pct"] = round(100.0 * max_sim, 2)
            df.at[index, "pass"] = False
            df.at[index, "attempts"] = attempts
            df.at[index, "feedback"] = last_eval.get("feedback", "")

    out = Path(output_csv)
    out.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(out, index=False)
    passed_n = int(df["pass"].fillna(False).astype(bool).sum()) if "pass" in df.columns else 0
    print(
        f"\nDone → {out} · {passed_n}/{len(df)} passed "
        f"(sim < 30% · quality 10/10 · rubric ≥ 12/13)"
    )


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Rewrite URL content until sim < 30%, quality 10/10, rubric ≥ 12/13"
    )
    ap.add_argument("input_csv", help="CSV with url,title,question,answer")
    ap.add_argument("-o", "--output", default="high_value_urls.csv", help="Output CSV path")
    ap.add_argument("--env", default="/tmp/aq-drip.env", help="Optional KEY=VAL env file")
    ap.add_argument("--max-retries", type=int, default=3)
    args = ap.parse_args()

    if args.env:
        load_env_file(args.env)
        # Map Pulse drip alias → DEEPSEEK_API_KEY
        if not os.environ.get("DEEPSEEK_API_KEY") and os.environ.get("ds1"):
            os.environ["DEEPSEEK_API_KEY"] = os.environ["ds1"]

    if not Path(args.input_csv).exists():
        raise SystemExit(f"Input CSV not found: {args.input_csv}")

    process_dataset(args.input_csv, args.output, max_retries=args.max_retries)


if __name__ == "__main__":
    main()
