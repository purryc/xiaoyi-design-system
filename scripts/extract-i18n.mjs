import fs from 'node:fs';
import { parse } from '@babel/parser';
const found=new Set();
const han=/[\u3400-\u9fff]/;
function collect(v) { if(typeof v==='string' && han.test(v)) found.add(v.replace(/\s+/g,' ').trim()); }
function walk(node) {
 if(!node||typeof node!=='object')return;
 if(node.type==='StringLiteral'||node.type==='JSXText')collect(node.value);
 if(node.type==='TemplateElement')collect(node.value.cooked);
 for(const [key,value] of Object.entries(node))if(!['loc','start','end','extra','comments','leadingComments','trailingComments'].includes(key)) {
 if(Array.isArray(value))value.forEach(walk);else if(typeof value==='object')walk(value);
 }
}
function scan(dir) {for(const f of fs.readdirSync(dir,{withFileTypes:true})) {const p=dir+'/'+f.name;if(f.isDirectory()){if(f.name!=='i18n')scan(p);}else if(/\.(jsx?|json)$/.test(p)){if(p.endsWith('.json'))json(JSON.parse(fs.readFileSync(p,'utf8')));else walk(parse(fs.readFileSync(p,'utf8'),{sourceType:'module',plugins:['jsx']}));}}}
function json(v){if(typeof v==='string')collect(v);else if(v&&typeof v==='object')Object.values(v).forEach(json);}
scan('src');for(const p of ['reference/manifest.json','reference/web-sources.json','reference/motion-analysis.json','tokens/xiaoyi.tokens.json'])json(JSON.parse(fs.readFileSync(p,'utf8')));
fs.writeFileSync('qa/i18n-strings.json',JSON.stringify([...found],null,2));
console.log(found.size);
