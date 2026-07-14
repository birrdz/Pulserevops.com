const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const ROOT=process.cwd();
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  let u=url.parse(req.url).pathname||'/';
  if(u==='/') u='/index.html';
  const f=path.normalize(path.join(ROOT,decodeURIComponent(u)));
  if(!f.startsWith(ROOT)){res.writeHead(403);return res.end('403');}
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(404);return res.end('404 '+u);}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(d);
  });
}).listen(8920,'0.0.0.0',()=>console.log('PULSE preview http://127.0.0.1:8920/'));
