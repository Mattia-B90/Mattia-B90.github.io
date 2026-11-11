import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),output=path.join(root,'dist');
const pages=['','about','contacts','disclaimer','terms-and-conditions'];
let base;
if(process.env.SITE_URL){base=new URL(process.env.SITE_URL);if(!['http:','https:'].includes(base.protocol)||base.username||base.password)throw Error('SITE_URL must be a public HTTP(S) URL without credentials.');base.search='';base.hash='';if(!base.pathname.endsWith('/'))base.pathname+='/';}
if(fs.existsSync(output)){
 if(fs.lstatSync(output).isSymbolicLink()||path.dirname(fs.realpathSync(output))!==fs.realpathSync(root)||path.basename(output)!=='dist')throw Error('Build output must be the project dist directory.');
 fs.rmSync(output,{recursive:true});
}
fs.mkdirSync(output,{recursive:true});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
for(const slug of pages){
 let html=fs.readFileSync(path.join(root,slug,'index.html'),'utf8');
 if(base){const url=escape(new URL(slug?slug+'/':'',base).href);html=html.replace('</head>',`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"></head>`);}
 fs.mkdirSync(path.join(output,slug),{recursive:true});fs.writeFileSync(path.join(output,slug,'index.html'),html);
}
fs.cpSync(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
let errorPage=fs.readFileSync(path.join(root,'404.html'),'utf8');
if(base)errorPage=errorPage.replace('href="./"',`href="${escape(base.href)}"`);
fs.writeFileSync(path.join(output,'404.html'),errorPage);fs.writeFileSync(path.join(output,'.nojekyll'),'');
let robots='User-agent: *\nAllow: /\n';
if(base){const urls=pages.map(s=>`  <url><loc>${escape(new URL(s?s+'/':'',base).href)}</loc></url>`).join('\n');fs.writeFileSync(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);robots+=`Sitemap: ${new URL('sitemap.xml',base).href}\n`;}
fs.writeFileSync(path.join(output,'robots.txt'),robots);console.log(`Built ${pages.length} pages in dist/${base?' with deployment metadata.':' (portable, no domain configured).'}`);
