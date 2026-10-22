import type {Entry,Question} from '../src/model';

export const searchKey=(value:string)=>value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]/gu,'');
export function relatedQuestions(entry:Entry,questions:Question[]){
 const ids=new Set<string>([...(entry.payload.relatedQuestionIds||[]),...(entry.payload.coverageItems||[]).map((i:{questionId?:string})=>i.questionId).filter(Boolean)]);
 return questions.filter(q=>ids.has(q.id)||(q as Question&{inboxId?:string}).inboxId===entry.id||!!entry.payload.url&&(q.url===entry.payload.url||q.sourceRefs?.some(r=>r.url===entry.payload.url)));
}
export function matchesQuestion(q:Question,query:string,inboxes:Entry[]=[]){
 const key=searchKey(query);if(!key)return true;
 const sources=inboxes.filter(e=>e.kind==='inbox'&&relatedQuestions(e,[q]).length).flatMap(e=>[e.payload.title,...(e.payload.coverageItems||[]).filter((i:{questionId?:string})=>i.questionId===q.id).map((i:{question:string})=>i.question)]);
 const text=searchKey([q.title,q.category,...q.roles,q.point,q.framework,q.source,...(q.sourceRefs||[]).map(r=>r.title),...sources].join(' '));
 return query.trim().split(/\s+/).every(part=>text.includes(searchKey(part)));
}
