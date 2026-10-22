import {Fragment} from 'react';

function inline(value:string){
 return value.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g).map((part,i)=>{
  const link=part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
  if(link)return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
  if(part.startsWith('**')&&part.endsWith('**'))return <strong key={i}>{part.slice(2,-2)}</strong>;
  if(part.startsWith('`')&&part.endsWith('`'))return <code key={i}>{part.slice(1,-1)}</code>;
  return <Fragment key={i}>{part}</Fragment>;
 });
}

// A small, text-only renderer for the authored notes. Raw HTML is never used.
export default function Reading({text}:{text:string}){
 const blocks=text.trim().split(/\r?\n\s*\r?\n/);
 return <div className="reading">{blocks.map((block,i)=>{
  const lines=block.split(/\r?\n/);
  if(lines[0].startsWith('|')&&lines.length>1){
   const rows=lines.filter(l=>!/^\|[\s:|\-]+\|$/.test(l)).map(l=>l.replace(/^\||\|$/g,'').split('|').map(s=>s.trim()));
   return <div className="reading-table" key={i}><table><thead><tr>{rows[0].map((cell,j)=><th key={j}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row,j)=><tr key={j}>{row.map((cell,k)=><td key={k}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
  }
  if(lines.every(l=>l.startsWith('- ')))return <ul key={i}>{lines.map((l,j)=><li key={j}>{inline(l.slice(2))}</li>)}</ul>;
  if(lines.every(l=>/^\d+[.、)]\s/.test(l)))return <ol key={i} start={Number(lines[0].match(/^\d+/)?.[0]||1)}>{lines.map((l,j)=><li key={j}>{inline(l.replace(/^\d+[.、)]\s/,''))}</li>)}</ol>;
  if(/^#{1,4} /.test(block)){const [heading,...body]=lines;return <section key={i}><h4>{inline(heading.replace(/^#{1,4} /,''))}</h4>{body.length>0&&<p>{inline(body.join('\n'))}</p>}</section>;}
  return <p key={i}>{inline(block)}</p>;
 })}</div>;
}
