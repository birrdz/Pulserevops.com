// Behavioral test of the renderer's entryImgAttrs poster hardening.
// Mirrors the live logic in netlify/functions/pulse-machine-entry.js.
const SITE = 'https://pulserevops.com';
function escHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escAttr(s){return escHtml(s);}
function imgProxy(u){u=String(u||'').trim();if(!/^https?:\/\//i.test(u))return u;if(/(^|\/\/)(pulserevops\.com|wsrv\.nl|images\.weserv\.nl|image\.pollinations\.ai)/i.test(u))return u;if(/pinimg\.com|pinterest\.com|redd\.it|redditmedia\.com|i\.imgur\.com/i.test(u))return u;return 'https://wsrv.nl/?url='+encodeURIComponent(u.replace(/^https?:\/\//i,''))+'&w=760&output=webp&q=80&we&n=-1';}
function resolveEntryAssetUrl(url){url=String(url||'').trim().replace(/^http:\/\//i,'https://');if(!url)return '';if(/^https:\/\//i.test(url))return imgProxy(url);if(url.startsWith('//'))return 'https:'+url;if(url.startsWith('/'))return SITE+url;return imgProxy(url);}
const IMG_ONERROR="this.onerror=null;var s=this,f1=this.getAttribute('data-fallback'),f2=this.getAttribute('data-fallback2');if(f1&&this.src!==f1){this.onerror=function(){s.onerror=null;if(f2&&s.src!==f2)s.src=f2;};this.src=f1;}else if(f2&&this.src!==f2){this.src=f2;}";
const BRANDED_IMG_FALLBACK='/pulse-og.svg';
function isNaImageUrl(u){const s=String(u||'').trim();return !s||/^n\/?a$/i.test(s)||/\/N\/A(\.[a-z]+)?$/i.test(s);}
function entryImgAttrs(url,alt,opts){opts=opts||{};const na=isNaImageUrl(url);const raw=na?'':String(url||'').trim().replace(/^http:\/\//i,'https://');const brandFb=resolveEntryAssetUrl(BRANDED_IMG_FALLBACK);const src=na?brandFb:resolveEntryAssetUrl(raw);const direct=/^https?:\/\//i.test(raw)?raw:'';let fb1=opts.fallback?resolveEntryAssetUrl(opts.fallback):(direct&&src!==direct?direct:'');if(fb1===src)fb1='';const fb2=brandFb!==src?brandFb:'';const load=opts.eager?'eager':'lazy';const w=opts.width||760;const h=opts.height||428;let attrs=' src="'+escAttr(src)+'" alt="'+escAttr(alt||'')+'" width="'+w+'" height="'+h+'" loading="'+load+'"'+(opts.eager?' fetchpriority="high"':'')+' decoding="async" referrerpolicy="no-referrer"';if(fb1&&fb1!==src)attrs+=' data-fallback="'+escAttr(fb1)+'"';if(fb2&&fb2!==src&&fb2!==fb1)attrs+=' data-fallback2="'+escAttr(fb2)+'"';attrs+=' onerror="'+IMG_ONERROR+'"';return attrs;}

let fails = 0;
function check(label, cond) { console.log((cond ? '  PASS ' : '  FAIL ') + label); if (!cond) fails++; }

const cases = [
  { u: 'http://m.media-amazon.com/images/x.jpg', label: 'live Amazon poster (http)', poster: true },
  { u: 'N/A', label: 'literal N/A' },
  { u: '', label: 'empty' },
  { u: '/assets/qa/mv0001-1.jpg', label: 'self-hosted mv poster', poster: true },
  { u: 'https://m.media-amazon.com/images/y.jpg', label: 'live Amazon poster (https)', poster: true },
];
for (const c of cases) {
  const a = entryImgAttrs(c.u, 'test', { width: 800, height: 1200 });
  console.log('\n[' + c.label + '] input=' + JSON.stringify(c.u));
  console.log(a);
  check('no mixed-content http src', !/src="http:\/\//.test(a));
  check('referrerpolicy=no-referrer', /referrerpolicy="no-referrer"/.test(a));
  check('loading=lazy', /loading="lazy"/.test(a));
  check('explicit width/height', /width="800" height="1200"/.test(a));
  check('has onerror', /onerror=/.test(a));
  check('terminal branded fallback reachable', /pulse-og\.svg/.test(a));
  if (isNaImageUrl(c.u)) check('N/A → branded as src (no bad src)', /src="[^"]*pulse-og\.svg"/.test(a));
  if (c.poster && /amazon/i.test(c.u)) check('external poster gets wsrv src + direct fallback + branded fallback2', /wsrv\.nl/.test(a) && /data-fallback="https:\/\/m\.media-amazon/.test(a) && /data-fallback2="[^"]*pulse-og\.svg"/.test(a));
  if (c.u === '/assets/qa/mv0001-1.jpg') check('self-hosted src on our CDN + branded terminal fallback', /src="https:\/\/pulserevops\.com\/assets\/qa\/mv0001-1\.jpg"/.test(a) && /data-fallback2="[^"]*pulse-og\.svg"/.test(a) && !/data-fallback="/.test(a));
}
console.log('\n' + (fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
