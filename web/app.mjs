import {createJournal,observeEvent,journalReport,journalMarkdown,journalSVG,parseEvents,sampleEvents,localizedBadge,sourceLabel} from './src/engine.mjs';
const ZH={
"A little celebration for a small step":"给一次小进展，盖个纪念章。","Tap Tool replied to advance the tool badge. These are practice events; your DSH session is not connected.":"点“工具返回”，看看徽章进度变化。这里用模拟事件试玩；接入自己的 DSH，需要按下方说明安装插件。","Try an event ↓":"去点一次事件 ↓",

'DSH / ACHIEVEMENT JOURNAL':'DSH / 成就簿','NATIVE CORDIS PLUGIN · RC.2':'CORDIS 原生插件 · RC.2','A LITTLE CONFETTI FOR THE AGENT LOOP':'给 AGENT 的运行过程添一点小乐趣',
'Small moments.':'运行中的小瞬间。','Collectible milestones.':'值得收藏的里程碑。','A badge journal for DeepSeek Harness. Count lifecycle events.':'为 DeepSeek Harness 记录生命周期事件的徽章簿。','Keep the conversation out of it.':'只数事件，不读取对话内容。',
'✳ OFFLINE DEMO — simulated events only. This page is not connected to DSH.':'✳ 离线演示：仅模拟或导入事件，本页面没有连接 DSH。',
'Tap an event':'模拟一次事件','Each tap simulates one native':'每点一次都会模拟一条原生','record. Achievements describe event counts, never quality or success.':'记录。徽章只表示事件次数，不代表质量或成功。',
'↻ Turn settled':'↻ 回合结束','⇢ Step ended':'⇢ 步骤结束','⌘ Tool replied':'⌘ 工具返回','≈ Attempt settled':'≈ 尝试结算',
'Load demo':'加载示例','Reset journal':'重置计数','Import an event sample':'导入事件样本','JSON array · type + seq only needed':'JSON 数组 · 仅需 type 与 seq','Fold event sample':'计算样本',
'Maximum 1 MiB / 10,000 events. Imported sequence numbers must be unique and strictly increasing. Event data is never read.':'最多 1 MiB／10000 条事件。导入的序号必须唯一且严格递增，事件 data 字段不会被读取。',
'Put it in your DSH':'安装到你的 DSH','Inside this project\'s directory:':'在本项目目录中运行：','Then type':'随后输入','. State is local to each live session and resets on restart or plugin reload.':'。状态按实时会话隔离，重启或重载插件后重置。',
'Your milestone shelf':'你的里程碑展架','turns':'回合','steps':'步骤','tool results':'工具结果','attempts':'尝试',
'JSON ↓':'JSON ↓','Markdown ↓':'中文 Markdown ↓','Shelf SVG ↓':'徽章 SVG ↓',
'No transcript inspection. No token spending rewards. No productivity score.':'不检查对话，不奖励 token 消耗，不提供生产力评分。',
'The native plugin observes events only after it is loaded; it does not replay history.':'原生插件仅观测加载之后的事件，不回放此前历史。',
'INDEPENDENT COMMUNITY PLUGIN · NOT AFFILIATED WITH DEEPSEEK':'独立社区插件 · 与 DEEPSEEK 无隶属关系','Verified lifecycle contract ↗':'已核实的生命周期接口 ↗',
'Demo loaded: simulated lifecycle events. No DSH connection.':'已加载模拟生命周期事件，没有连接 DSH。',
'Demo counters reset.':'离线演示计数已重置。','Simulated event observed: ':'已记录模拟事件：',
'Offline event sample folded; payload data ignored.':'已计算离线事件样本，忽略 payload 数据。','COLLECTED':'已收集','IN PROGRESS':'收集中','Downloaded: ':'已下载：',
'File not applied. Your previous journal is unchanged. ':'样本没有导入。之前的徽章和计数都还在。','Supply JSON under 1 MiB.':'请提供不超过 1 MiB 的 JSON。','Invalid events JSON.':'事件 JSON 格式无效。','Supply up to 10,000 event objects.':'请提供最多 10000 个事件对象。',
'Each event requires a string type and nonnegative integer seq.':'每条事件需要字符串 type 和非负整数 seq。','Imported events require strictly increasing, unique sequence numbers.':'导入事件的 seq 必须唯一且严格递增。','Source: ':'数据来源：','No live connection. Switching language preserves your counters and input.':'没有实时连接；切换语言会保留当前计数与输入。'
};

const $=id=>document.getElementById(id);const initialLanguage=new URLSearchParams(location.search).get('lang');let language=initialLanguage==='zh'?'zh':'en';
const t=text=>language==='zh'?(ZH[text]??text):text;
const staticText=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
for(let n=walker.nextNode();n;n=walker.nextNode()){if(n.parentElement.closest('script,style,textarea,pre,code,select'))continue;const text=n.nodeValue.trim();if(Object.hasOwn(ZH,text))staticText.push({node:n,en:n.nodeValue,key:text});}
function translatePage(){document.documentElement.lang=language==='zh'?'zh-CN':'en';for(const x of staticText)x.node.nodeValue=language==='zh'?x.en.replace(x.key,ZH[x.key]):x.en;}
let notice={text:'',error:false,suffix:''};
function status(text,error=false,suffix=''){notice={text,error,suffix};renderStatus();}
function renderStatus(){$('status').textContent=t(notice.text)+notice.suffix;$('status').className=notice.error?'error':'';}
function node(tag,cls,text){const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function download(text,name,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);status('Downloaded: ',false,name);}

let state=createJournal(),report,valid=true,source='offline-demo';
function render(){
 report=journalReport(state,source);document.querySelectorAll('.exports button').forEach(b=>b.disabled=!valid);
 $('earned').textContent=report.badges.filter(b=>b.earned).length+' / '+report.badges.length;
 for(const [id,type]of [['turns','turn/end'],['steps','step/end'],['tools','tool/result'],['attempts','assistant/attempt']])$(id).textContent=report.counts[type];
 $('source-status').textContent=t('Source: ')+sourceLabel(source,language)+'. '+t('No live connection. Switching language preserves your counters and input.');
 $('badges').replaceChildren();for(const original of report.badges){const b=localizedBadge(original,language),el=node('article','badge'+(b.earned?' earned':''));const track=node('div','track'),fill=node('span','');fill.style.width=b.progress/b.target*100+'%';track.append(fill);el.append(node('div','symbol',b.symbol),node('span','stamp',t(b.earned?'COLLECTED':'IN PROGRESS')),node('h3','',b.title),node('p','',b.description),track,node('div','progress',b.progress+' / '+b.target));$('badges').append(el);}
}
function sample(){const events=sampleEvents();$('events').value=JSON.stringify(events,null,2);state=events.reduce(observeEvent,createJournal());valid=true;source='offline-demo';render();status('Demo loaded: simulated lifecycle events. No DSH connection.');}
for(const [id,type]of [['add-turn','turn/end'],['add-step','step/end'],['add-tool','tool/result'],['add-attempt','assistant/attempt']])$(id).addEventListener('click',()=>{state=observeEvent(state,{seq:state.lastSeq+1,type});valid=true;source='offline-demo';render();status('Simulated event observed: ',false,type);});
$('reset').addEventListener('click',()=>{state=createJournal();valid=true;source='offline-demo';render();status('Demo counters reset.');});
$('sample').addEventListener('click',sample);
let importError='';
$('inspect').addEventListener('click',()=>{try{const events=parseEvents($('events').value);state=events.reduce(observeEvent,createJournal());valid=true;source='imported';importError='';render();status('Offline event sample folded; payload data ignored.');}catch(e){importError=e.message;status('File not applied. Your previous journal is unchanged. ',true,t(importError));}});
$('language').addEventListener('change',()=>{language=$('language').value;translatePage();render();if(notice.error&&importError)notice.suffix=t(importError);renderStatus();});
$('export-json').addEventListener('click',()=>valid&&download(JSON.stringify(report,null,2),'dsh-achievements-demo.json','application/json'));
$('export-md').addEventListener('click',()=>valid&&download(journalMarkdown(report,language),'dsh-achievements-demo.md','text/markdown'));
$('export-svg').addEventListener('click',()=>valid&&download(journalSVG(report,language),'dsh-achievements-demo.svg','image/svg+xml'));
$('language').value=language;translatePage();sample();
