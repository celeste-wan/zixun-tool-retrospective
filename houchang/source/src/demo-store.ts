import {chinaDate,dueDate,type Entry,type ResumeFile} from './model';
const KEY='houchang-public-demo-v1';
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
const row=(id:string,kind:string,payload:Record<string,unknown>):Entry=>({id,kind,payload,updatedAt:new Date().toISOString()});
export function initialData(){
 const records:Entry[]=[
  row('preferences','settings',{roles:['PE / VC','一级投研','互联网战略'],minutes:15}),
  row('demo-exp-project','experience',{title:'示例经历｜用户反馈整理工具',company:'虚构项目 · 示例团队',period:'示例周期：4 周',background:'以下为虚构演示材料，不代表项目作者的真实经历。\n团队需要把零散反馈整理为可检索的问题记录，我负责梳理输入格式和验收流程。',actions:'界定反馈字段，选择少量示例进行分类，整理问题清单，并检查处理前后内容是否遗漏。',summary:'交付了一份示例问题清单与分类规则。页面用于演示经历整理和追问关联，不包含真实公司数据。',reflection:'分类标准最初存在交叉，后续补充了边界说明。',short:'我在这个虚构示例中负责把零散用户反馈整理成结构化清单，重点是分类规则、内容完整性和可检索性。',long:'这是用于展示页面结构的虚构经历。项目需要整理零散用户反馈，我负责梳理输入字段、制定初步分类规则，并检查是否遗漏独立问题。交付物是问题清单与规则说明，结果不延伸为未经验证的经营影响。',followups:'怎样设计分类规则？\n如何检查遗漏？\n哪些步骤由你负责？',relatedQuestionIds:['demo-q-2','demo-q-9']}),
  row('demo-exp-research','experience',{title:'示例经历｜商业模式研究练习',company:'虚构案例 · 研究小组',period:'示例周期：2 周',background:'选择一家虚构订阅软件公司，练习从业务出发建立分析框架。',actions:'拆分客户、定价、续费和服务成本，区分观察到的事实与教学假设。',summary:'形成业务驱动因素表、待验证问题与风险清单。所有材料均为教学示例。',relatedQuestionIds:['demo-q-7']}),
  row('demo-inbox-1','inbox',{title:'示例面经｜研究岗位的一次面试',collection:'演示面经精选',platform:'演示面经',date:chinaDate(),raw:'以下为专门编写的虚构示例，不摘录真实作者帖子。\n问题一：请介绍一个研究项目。\n追问：你具体负责哪些部分？\n问题二：研究一家公司时，如何形成可验证的判断？',summary:'演示面经导入后的整理结果：保留原题、拆分追问，并关联到两道练习。原项目可以接入外部面经采集，本静态版不抓取真实帖子。',relatedQuestionIds:['demo-q-9','demo-q-7']}),
  row('demo-inbox-2','inbox',{title:'示例面经｜AI 产品与项目经历',collection:'演示面经精选',platform:'演示面经',date:chinaDate(),raw:'虚构演示题：最近体验了什么 AI 产品？怎样验证自己的小项目是否有用？',summary:'演示从面经到练习的关联流程。',relatedQuestionIds:['demo-q-10','demo-q-11']}),
  row('demo-case-1','case',{title:'示例案例｜订阅软件的续费分析',type:'行业研究',date:chinaDate(),summary:'教学案例：先解释客户是否持续获得价值，再看价格与续费表现。',facts:'虚构业务情景，无真实公司经营数据。',logic:'按客户规模与使用场景分组，观察使用频次、关键任务完成和续费决策。',risks:'分组样本不足；满意度不能直接等同续费。',next:'核对流失原因与统计口径。'}),
  row('demo-interview-1','interview',{title:'示例安排｜投资研究实习',date:dueDate(7),role:'PE / VC',summary:'□ 练习项目介绍\n□ 准备一家公司研究\n□ 回看专业知识薄弱项'}),
  row('demo-practice-1','attempt',{questionId:'demo-q-2',date:chinaDate(new Date(Date.now()-3*86400000)),answer:'示例作答：先说明项目背景，再介绍自己负责的分类与核对工作，最后交代交付物和局限。',note:'下次补充分类规则为何这样设计。',status:'需复习',nextReview:chinaDate(),durationSeconds:90}),
  row('favorite-demo-q-11','favorite',{questionId:'demo-q-11'})
 ];
 return {records,files:[] as ResumeFile[]};
}
type State=ReturnType<typeof initialData>;
let volatile:State|null=null;
function read():State{try{const raw=localStorage.getItem(KEY);if(raw){const data=JSON.parse(raw);if(Array.isArray(data.records)&&Array.isArray(data.files))return data;}}catch{}return volatile||initialData();}
function write(state:State){volatile=state;try{localStorage.setItem(KEY,JSON.stringify(state));}catch{throw new Error('浏览器未允许本地存储，暂时无法保存。');}}
export function resetDemo(){localStorage.removeItem(KEY);volatile=null;}
export async function demoFetch(path:string,options:RequestInit={}){
 const state=read();const method=options.method||'GET';const u=new URL(path,'https://demo.invalid');
 const result=(data:unknown,status=200)=>Response.json(data,{status});
 if(u.pathname==='/api/materials')return result({ok:true});
 if(u.pathname==='/api/records'){
  if(method==='GET')return result(state);
  if(method==='POST'){
   const value=JSON.parse(String(options.body));
   if(!value.id||!value.kind||!value.payload)return result({error:'记录格式有误。'},400);
   const entry=row(value.id,value.kind,value.payload);state.records=[entry,...state.records.filter(e=>e.id!==entry.id)];write(state);return result(entry);
  }
  if(method==='DELETE'){state.records=state.records.filter(e=>e.id!==u.searchParams.get('id'));write(state);return result({ok:true});}
 }
 if(u.pathname==='/api/files'){
  if(method==='POST'){
   // The selected file contents and original filename are never read or stored.
   const file:ResumeFile={id:crypto.randomUUID(),name:'示例简历.txt',size:180,type:'text/plain',label:'示例简历 · 文件卡演示',createdAt:new Date().toISOString()};state.files.unshift(file);write(state);return result(file);
  }
  if(method==='DELETE'){state.files=state.files.filter(f=>f.id!==u.searchParams.get('id'));write(state);return result({ok:true});}
 }
 return result({error:'此功能不在静态演示范围内。'},404);
}
export function downloadDemoResume(){const a=document.createElement('a');const u=URL.createObjectURL(new Blob(['候场公开演示：示例简历\n此文件不包含任何真实姓名、联系方式、学校或实习信息。'],{type:'text/plain;charset=utf-8'}));a.href=u;a.download='候场-示例简历.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
