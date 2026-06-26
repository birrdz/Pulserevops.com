// Compare HF hub page vs master Lanceo/LRN keyword lists.
const fs = require('fs');
const path = require('path');
const { HF_HUB_PAGE, HF_HUB_URL, hubDisplayKeywords, allKeywordsFlat } = require('./_hf_lrn_seo_keywords');

function metaKeywords(file) {
  const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const m = html.match(/<meta name="keywords" content="([^"]+)"/i);
  return m ? m[1].toLowerCase() : '';
}

const meta = metaKeywords(HF_HUB_PAGE);
const display = hubDisplayKeywords();
const slugSet = new Set(allKeywordsFlat());

const missingDisplay = display.filter((kw) => !meta.includes(kw.toLowerCase()));
const missingSlug = [...slugSet].filter((sl) => !meta.includes(sl));

console.log(
  JSON.stringify(
    {
      hubUrl: HF_HUB_URL,
      hubPage: HF_HUB_PAGE,
      displayTotal: display.length,
      slugTotal: slugSet.size,
      missingFromHubMeta: missingDisplay.length,
      missingDisplay: missingDisplay.slice(0, 20),
      missingSlugCount: missingSlug.length,
    },
    null,
    2
  )
);
