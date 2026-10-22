import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Studio from './studio';
import {resetDemo} from './demo-store';
import './studio.css';
import './demo.css';

function Demo(){
 const [about,setAbout]=useState(false);
 useEffect(()=>{if(!about)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')setAbout(false);};document.addEventListener('keydown',esc);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',esc);};},[about]);
 return <><div className="demo-banner"><span><b>候场 · 公开演示</b><span className="demo-banner-detail">全站为示例数据 · 无需登录 · 试用内容仅保存在当前浏览器</span></span><div><button onClick={()=>setAbout(true)}>项目说明 ↗</button><button onClick={()=>{if(confirm('重置本浏览器中的演示内容？')){resetDemo();location.href=location.pathname;}}}>重置演示</button></div></div><Studio displayName="演示访客"/>{about&&<div className="about-backdrop" onClick={()=>setAbout(false)}><section className="about-dialog" role="dialog" aria-modal="true" aria-labelledby="about-title" onClick={e=>e.stopPropagation()}><button className="about-close" aria-label="关闭项目说明" onClick={()=>setAbout(false)}>×</button><span className="eyebrow">FROM A PERSONAL NEED TO A WORKING PRODUCT</span><h1 id="about-title">候场：把准备过程，变成可以反复使用的工具。</h1><p>从实习求职需求出发，用 Codex 辅助完成需求拆解、页面搭建、数据存储与上线迭代。项目负责人负责材料组织、功能取舍与实际使用验收。</p><div className="about-flow"><span>01 收集面经</span><i>→</i><span>02 整理练习</span><i>→</i><span>03 作答复习</span><i>→</i><span>04 面试复盘</span></div><h2>可以怎样体验？</h2><ol><li>在“分类题库”筛选岗位，打开一道题，先留下回答再看参考思路。</li><li>保存自评和改进点，到“复习与面试”查看记录。</li><li>在“面经收件箱”打开示例面经，或添加一条自己的演示题目。</li><li>在“简历与经历”查看示例项目的背景、行动、结果及口述表达。</li></ol><h2>这个静态版本的范围</h2><p>公开版复用原项目界面，全部数据为专门编写的虚构示例。题库、编辑、作答与复习可在浏览器内体验；上传简历用示例文件卡演示，真实文件不会上传或读取。原项目的小红书采集和站外练习推送依赖外部服务，本静态版展示整理后的流程，不执行抓取或消息发送。</p><h2>一次实际迭代</h2><p>新增题目曾因默认归入“待完善”而难以找到。排查后调整了完成度判断、保存后的展示和弹窗内提示，减少“已经保存，却以为失败”的困惑。</p><p className="about-footnote">本项目目前主要服务于个人求职准备，未声称有大规模用户或量化提效结果。</p><a className="button primary" href="https://github.com/celeste-wan/zixun-tool-retrospective/tree/main/houchang/source" target="_blank" rel="noreferrer">查看 GitHub 源码 ↗</a></section></div>}</>;
}
createRoot(document.getElementById('root')!).render(<Demo/>);
