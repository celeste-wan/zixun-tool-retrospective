import fs from 'node:fs';
import path from 'node:path';
const roots=['src','lib','public','docs'];
const forbidden=[/\.chatgpt\.site/i,/[A-Z]:\\Users\\/i,/\.xiaohongshu\.com/i,/-----BEGIN .*PRIVATE KEY/,/gh[pousr]_[A-Za-z0-9]{20,}/,/sk-[A-Za-z0-9]{20,}/,/[\w.+-]+@[\w.-]+\.(?:com|cn|net|edu)/i];
let count=0;
function scan(dir){if(!fs.existsSync(dir))return;for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())scan(p);else if(/\.(?:ts|tsx|js|css|html|svg|json|txt)$/.test(p)){count++;const s=fs.readFileSync(p,'utf8');for(const rule of forbidden)if(rule.test(s))throw new Error(`Public-content check failed: ${p} (${rule})`);}}}
roots.forEach(scan);
const studio=fs.readFileSync('src/studio.tsx','utf8');
if(/(?<!demo)fetch\(/.test(studio))throw new Error('Unexpected live API fetch');
if(studio.includes('signout-with-chatgpt'))throw new Error('Unexpected private auth link');
if(!studio.includes('downloadDemoResume'))throw new Error('Missing safe sample download');
console.log(`Public-content check passed: ${count} text assets; no private-site link, imported personal records or credentials detected.`);
