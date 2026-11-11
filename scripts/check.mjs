import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const pages=['index.html','about/index.html','contacts/index.html','disclaimer/index.html','terms-and-conditions/index.html'];
const errors=[];
function checkFile(file,url){
 if (/^(?:https?:|mailto:|tel:|data:|#)/.test(url)) return;
 const pathname=decodeURIComponent(url.split(/[?#]/)[0]);if(!pathname)return;
 const resolved=path.resolve(path.dirname(file),pathname);
 if(resolved!==root&&!resolved.startsWith(root+path.sep))errors.push(`Path outside site: ${url}`);
 else if(!fs.existsSync(resolved))errors.push(`${path.relative(root,file)}: missing ${url}`);
}
for(const page of pages){
 const file=path.join(root,page),html=fs.readFileSync(file,'utf8');
 for(const [,url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g))checkFile(file,url);
 const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))if(!ids.has(id))errors.push(`${page}: missing anchor ${id}`);
 if(!/<h1\b/.test(html))errors.push(`${page}: missing H1`);
 if(/<(?:script|img|iframe)\b[^>]*src=["'](?:https?:)?\/\//i.test(html))errors.push(`${page}: unexpected external resource`);
}
const cssFile=path.join(root,'assets/site.css'),css=fs.readFileSync(cssFile,'utf8');
for(const [,url] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))checkFile(cssFile,url);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Checked ${pages.length} pages: links, media, font, headings and local resources OK.`);
