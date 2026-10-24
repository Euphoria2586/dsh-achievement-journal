import {createJournal,observeEvent,journalReport,journalMarkdown} from './src/engine.mjs';
export const name='dsh-achievement-journal';
export const inject=['commands'];
export function apply(ctx){
 const journals=new WeakMap();
 const state=session=>journals.get(session)??createJournal();
 ctx.on('session/event',(session,event)=>{if(session&&typeof session==='object')journals.set(session,observeEvent(state(session),event));});
 ctx.commands.register({definitionId:'dsh-achievement-journal:achievements',name:'achievements',description:'View playful session event badges; no transcript inspection.',input:{hint:'[show | json | reset] [zh | en]'},recordInput:false,handler:({agent,rawInput,signal})=>{
  if(signal?.aborted)return {kind:'error',text:'Command cancelled.'};
  const session=agent?.session;if(!session||typeof session!=='object')return {kind:'error',text:'An active DSH session is required.'};
  const parts=(rawInput??'').trim().split(/\s+/).filter(Boolean);let language='en';if(['zh','en'].includes(parts.at(-1)))language=parts.pop();const action=parts.shift()||'show';
  if(parts.length||!['show','json','reset'].includes(action))return {kind:'error',text:language==='zh'?'使用 /achievements [show | json | reset] [zh | en]。':'Use /achievements [show | json | reset] [zh | en].'};
  if(action==='reset'){journals.set(session,createJournal(state(session).lastSeq));return {kind:'success',text:language==='zh'?'当前会话的成就计数已重置；不会回放此前事件。':'Achievement counters reset for this session. Earlier events are not replayed.'};}
  const report=journalReport(state(session),'live');return {kind:'success',text:action==='json'?JSON.stringify(report,null,2):journalMarkdown(report,language)};
 }});
}
