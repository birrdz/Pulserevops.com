#!/bin/bash
# SAFE deploy: park secrets + 1.7GB _site_deploy, deploy as a DRAFT (not --prod),
# print the draft URL + deploy id for verification. Promotion happens SEPARATELY
# via the restore API only after the draft is verified. Restores parked files on exit.
set +e
cd /c/Users/koryj/website
TOKEN=$(grep -oE 'NETLIFY_AUTH_TOKEN=[^[:space:]]+' .env.local | head -1 | cut -d= -f2- | tr -d '"'"'"'')
SITE=$(grep -oE '"siteId"[: ]*"[^"]+"' .netlify/state.json | grep -oE '[a-f0-9-]{36}' | head -1)
echo "site=$SITE token_present=$([ -n "$TOKEN" ] && echo yes || echo no)"

PARK=/c/Users/koryj/_DEPLOY_PARK
mkdir -p "$PARK"
[ -d _site_deploy ] && mv _site_deploy "$PARK/_site_deploy"
[ -f .env ] && mv .env "$PARK/.env"
[ -f .env.local ] && mv .env.local "$PARK/.env.local"
echo "parked junk+secrets. root .env present now: $(ls .env .env.local 2>/dev/null | wc -l)"

restore(){
  [ -d "$PARK/_site_deploy" ] && mv "$PARK/_site_deploy" _site_deploy
  [ -f "$PARK/.env" ] && mv "$PARK/.env" .env
  [ -f "$PARK/.env.local" ] && mv "$PARK/.env.local" .env.local
  echo "restored. .env back: $(ls .env .env.local 2>/dev/null | wc -l)"
}
trap restore EXIT

echo "=== DRAFT deploy (no --prod) ==="
# output OUTSIDE the tree so it never churns the deploy hash (422 fix)
OUT=/c/Users/koryj/_deploy_out.json; ERR=/c/Users/koryj/_deploy_out.err
MSG="face-card covers mv/hf/gm/ga/sw/ev/sk (blur-refused + sharpened) + homepage 30min fresh-older rotation, no-repeat cover within 8, white/larger CRO and Browse Topics tiles owner 2026-07-07"
ok=0
for i in 1 2 3 4 5 6 7 8; do
  echo "--- attempt $i ---"
  NETLIFY_AUTH_TOKEN="$TOKEN" npx --yes netlify-cli@latest deploy --dir=. --site="$SITE" --json --no-build \
    --message="$MSG" > "$OUT" 2> "$ERR"
  code=$?
  if [ $code -eq 0 ] && grep -q '"deploy_id"\|"deploy_url"\|"id"' "$OUT" 2>/dev/null; then ok=1; break; fi
  echo "attempt $i failed (exit $code): $(tail -1 "$ERR")"
  sleep 4
done
echo "=== deploy ok=$ok ==="
echo "--- draft json ---"; cat "$OUT"
echo "--- last err lines ---"; tail -3 "$ERR"
