'use strict';
const fs = require('fs');

const shortFn = `function shortTitle(s,max){
      max=max||36;
      var raw=String(s||'').replace(/\\s+/g,' ').trim().replace(/[?]+$/g,'');
      var t=raw, year='', ym=t.match(/\\b(20\\d{2})\\s*$/);
      if(ym){year=' '+ym[1];t=t.slice(0,-ym[1].length).trim()}
      var rules=[
        [/^top\\s+(\\d+)\\s+best\\s+(.+?)(?:\\s+options)?$/i,function(_,n,r){return 'Top '+n+' '+r}],
        [/^top\\s+(\\d+)\\s+(.+)$/i,function(_,n,r){return 'Top '+n+' '+r}],
        [/^what are the most common mistakes (?:in|with|for)\\s+(.+)$/i,function(_,r){return 'Common Mistakes in '+r}],
        [/^what(?:'s| is| are) the best way to approach\\s+(.+)$/i,function(_,r){return 'How to Approach '+r}],
        [/^what is the best way to\\s+(.+)$/i,function(_,r){return 'How to '+r}],
        [/^how do you get started with\\s+(.+)$/i,function(_,r){return 'Getting Started with '+r}],
        [/^how (?:do|can|should) (?:you|i) get started (?:with|in)\\s+(.+)$/i,function(_,r){return 'Getting Started with '+r}],
        [/^what should you know before investing in\\s+(.+)$/i,function(_,r){return 'Before Investing in '+r}],
        [/^how much does\\s+(.+?)\\s+cost(?:\\s+in)?$/i,function(_,r){return r+' Cost'}],
        [/^is\\s+(.+?)\\s+worth it(?:\\s+in)?$/i,function(_,r){return 'Is '+r+' Worth It'}],
        [/^how to\\s+(.+)$/i,function(_,r){return 'How to '+r}],
        [/^a guide to\\s+(.+)$/i,function(_,r){return r}]
      ];
      var hit=false;
      for(var i=0;i<rules.length;i++){var m=t.match(rules[i][0]);if(m){t=rules[i][1].apply(null,m);hit=true;break}}
      if(!hit){
        t=t.replace(/^(what(?:'s| is| are| do| does| did| should| can| will)|how(?: to| do| does| can| should| much| many)|why(?: do| does| is| are)?|which|when|where|who|is there|are there)\\s+/i,'');
        t=t.replace(/^(the|a|an)\\s+/i,'');
        t=t.replace(/^(you|i)\\s+(get started with|know before)\\s+/i,function(_,p,v){return v.charAt(0).toUpperCase()+v.slice(1)+' '});
        t=t.replace(/^(does|do|is|are|can|should)\\s+/i,'');
        t=t.replace(/^(most common mistakes in)\\s+/i,'Common Mistakes in ');
        t=t.replace(/^(get started with)\\s+/i,'Getting Started with ');
      }
      t=t.replace(/\\s+/g,' ').trim();
      if(!t)t=raw.replace(/\\b(20\\d{2})\\s*$/,'').trim();
      t=t.charAt(0).toUpperCase()+t.slice(1);
      t=t.replace(/^(you|does|do|is|are|most|how|what)\\b/i,function(w){return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()});
      var limit=Math.max(12,max-year.length);
      if(t.length<=limit)return(t+year).trim();
      var cut=t.slice(0,limit),sp=cut.lastIndexOf(' ');
      if(sp>=8)cut=cut.slice(0,sp);
      return(cut.replace(/[,:;.\\-\\u2013\\u2014\\s]+$/g,'')+year).trim();
    }`;

const p = 'C:/Users/koryj/website/index.html';
let html = fs.readFileSync(p, 'utf8');
html = html.replace(/function shortTitle\(s,max\)\{[\s\S]*?\n    var sc=/, shortFn + '\n    var sc=');
// Also handle if shortTitle is one line before function colorOf neighbor
if (!html.includes('Getting Started with ')) {
  html = html.replace(/function shortTitle\(s,max\)\{[^]*?\n    (?:function |var sc=)/, shortFn + '\n    $1');
}
html = html.replace(/pulse-squares\.js\?v=[^"]+/, 'pulse-squares.js?v=20260711aa');
fs.writeFileSync(p, html);

// Quick self-test
const vm = require('vm');
const js = fs.readFileSync('C:/Users/koryj/website/js/pulse-squares.js', 'utf8');
const sand = { window: {}, console };
vm.runInNewContext(js + '; this.st = PulseSquares.shortTitle;', sand);
const samples = [
  'How do you get started with Boats in 2027?',
  'What are the most common mistakes in Clubs in 2027?',
  'How much does Software cost in 2027?',
  'What should you know before investing in Electronics in 2027?',
  'Top 10 best Collectibles options in 2027'
];
samples.forEach((s) => console.log('→', sand.st(s)));
console.log('html ok', html.includes('Getting Started with '));
