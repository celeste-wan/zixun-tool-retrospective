export const categories = ['行为与动机','简历深挖','金融与财务','宏观与热点','商业与战略','Case 与估算','投资与公司推荐','建模与数据'];
export const roles = ['券商研究','买方投研','投行','PE / VC','银行 / 管培','互联网战略','一级投研','企业战略','FA','投后 Talent'];
export type Question = { id: string; title: string; category: string; roles: string[]; difficulty: string; minutes: number; point: string; framework: string; answer: string; pitfalls: string; followups: string[]; source: string; url?: string; temporal?: boolean; contentStatus?: 'ready'|'draft'|'framework'; sourceType?: string; explanation?: string; raw?: string; checkedAt?: string; sourceLocator?: string; experienceId?: string; relatedIds?: string[]; sourceRefs?: {title:string;url:string}[];answerOrigin?:string;answerCheckedAt?:string;answerReferences?:{title:string;url:string;date?:string}[] };
export type Entry = { id: string; kind: string; payload: Record<string, any>; updatedAt: string };
export type ResumeFile = { id: string; name: string; size: number; type: string; label: string; createdAt: string };
export const chinaDate = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export function dueDate(days: number) { return chinaDate(new Date(Date.now() + days * 86400000)); }
export function latestAttempts(entries: Entry[]) { const sorted = entries.filter(e=>e.kind==='attempt').sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)); return Array.from(new Map(sorted.reverse().map(e=>[e.payload.questionId,e])).values()); }
export function nextInterval(status: string) { return status === '不会' ? 1 : status === '需复习' ? 3 : 7; }
export function chooseDaily(questions: Question[], date: string, selectedRoles: string[]) {
  const candidates = questions.filter(q=>!selectedRoles.length || q.roles.some(r=>selectedRoles.includes(r)));
  const eligible = candidates.length ? candidates : questions;
  const ready = eligible.filter(q=>q.contentStatus==='ready');
  const list = ready.length ? ready : eligible.filter(q=>q.contentStatus!=='draft');
  if(!list.length) return undefined;
  const day = Math.floor(Date.parse(date+'T00:00:00+08:00') / 86400000);
  return list[((day % list.length)+list.length)%list.length];
}
