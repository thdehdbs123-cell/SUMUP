import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import * as classification from '../classification.js';
import * as ui from '../report-ui.js';
import * as contract from '../report-contract.js';
import { answers, reflections, report } from './fixtures/report.js';

const source=readFileSync(new URL('../src.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const settle=()=>new Promise(resolve=>setTimeout(resolve,10));
function mount(t,fetch){
 const dom=new JSDOM('<div id="app"></div>',{url:'http://localhost:5174',runScripts:'outside-only'});
 t.after(()=>dom.window.close());const w=dom.window,d=w.document;
 Object.assign(w,classification,ui,contract);w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.fetch=fetch;
 w.eval(source);
 const click=selector=>{const element=d.querySelector(selector);assert.ok(element,selector);assert.equal(element.disabled||false,false,`disabled: ${selector}`);element.click()};
 const input=(selector,value)=>{const field=d.querySelector(selector);assert.ok(field,selector);field.value=value;field.dispatchEvent(new w.Event('input'))};
 const submit=()=>d.querySelector('#reflection-form').dispatchEvent(new w.Event('submit',{cancelable:true}));
 click('[data-next]');input('input[autocomplete="given-name"]','수아');click('[data-next]');
 answers.forEach(answer=>{click(`[data-option="${answer}"]`);click('[data-next]')});
 return {dom,w,d,click,input,submit};
}

test('one question at a time, chips, optional quantity, retained inputs, retry and report-first layout',async t=>{
 let calls=0,sent;
 const app=mount(t,async(_url,options)=>{
  sent=JSON.parse(options.body);calls++;
  return calls===1?new Response(JSON.stringify({error:'테스트 연결 실패'}),{status:503}):new Response(JSON.stringify({report}));
 });
 const {d,click,input,submit}=app;
 assert.equal(d.querySelectorAll('textarea').length,1);assert.equal(d.querySelector('textarea').maxLength,200);
 click('[data-reflection-chip="0"]');assert.equal(d.querySelector('textarea').value,'다이빙 분야');
 input('textarea',reflections[0]);submit();assert.equal(d.querySelector('textarea').dataset.reflection,'1');
 input('textarea',reflections[1]);submit();assert.equal(d.querySelector('textarea').dataset.reflection,'2');
 click('[data-investment-kind="experience"]');input('[data-investment-amount]','3년 동안');input('textarea',reflections[2]);
 click('[data-reflection-page="0"]');assert.equal(d.querySelector('textarea').value,reflections[0]);click('[data-reflection-page="2"]');
 assert.equal(d.querySelector('[data-investment-amount]').value,'3년 동안');
 submit();assert.equal(d.querySelector('textarea').disabled,true);await settle();
 assert.match(d.querySelector('[role="alert"]').textContent,/테스트 연결 실패/);assert.equal(d.querySelector('textarea').value,reflections[2]);
 submit();await settle();assert.equal(d.querySelector('#ai-report-title').textContent,report.title);
 assert.equal(sent.name,undefined);assert.deepEqual(sent.investment,{kind:'experience',amount:'3년 동안'});
 const phone=d.querySelector('main');assert.equal(phone.children[1].className,'ai-report');assert.equal(d.querySelector('.basic-result').open,false);
 assert.equal(d.querySelectorAll('.report-direction .evidence-list mark').length,6);
 assert.match(d.querySelector('.connection-label').textContent,/탐험가 성향 × 이야기 1 · 2/);
 click('.basic-result>summary');await settle();click('[data-detail]');assert.equal(d.querySelector('.basic-result').open,true);
 assert.equal(d.querySelectorAll('meter').length,8);
 click('[data-edit-reflections]');input('textarea',reflections[0]+' 다시');click('[data-skip-report]');
 assert.equal(d.querySelector('.ai-report'),null);assert.ok(d.querySelector('.report-invite'));
});

test('two answered questions can generate while the third is skipped, with original source numbers',async t=>{
 let sent;
 const two=structuredClone(report);two.assets=[];
 two.directions.forEach(d=>d.evidence=[{source:0,quote:'독립서점'},{source:1,quote:'책 표지'}]);
 const {d,input,submit}=mount(t,async(_url,options)=>{sent=JSON.parse(options.body);return new Response(JSON.stringify({report:two}))});
 input('textarea',reflections[0]);submit();input('textarea',reflections[1]);submit();
 assert.equal(d.querySelector('textarea').value,'');assert.equal(d.querySelector('#reflection-form button[type="submit"]').disabled,false);
 submit();await settle();assert.deepEqual(sent.reflections,[reflections[0],reflections[1],'']);assert.ok(d.querySelector('.ai-report'));
});

test('skipping a question and returning preserves other answers; one answer alone never calls AI',t=>{
 let calls=0;const {d,click,input,submit}=mount(t,async()=>{calls++;throw new Error('unexpected call')});
 input('textarea','a');assert.equal(d.querySelector('#reflection-form button[type="submit"]').disabled,true);
 click('[data-skip-question]');assert.equal(d.querySelector('textarea').dataset.reflection,'1');
 input('textarea',reflections[1]);submit();assert.equal(d.querySelector('#reflection-form button[type="submit"]').disabled,true);
 submit();assert.equal(calls,0);click('[data-reflection-page="1"]');assert.equal(d.querySelector('textarea').value,reflections[1]);
 click('[data-reflection-page="0"]');assert.equal(d.querySelector('textarea').value,'');
});

test('cancelled generation cannot replace the basic result with a late response',async t=>{
 let resolve;
 const {d,click,input,submit}=mount(t,()=>new Promise(done=>{resolve=done}));
 for(let i=0;i<3;i++){input('textarea',reflections[i]);if(i<2)submit()}
 submit();click('[data-skip-report]');resolve(new Response(JSON.stringify({report})));await settle();
 assert.equal(d.querySelector('.ai-report'),null);assert.ok(d.querySelector('.report-invite'));
});

test('browser accepts verified evidence quoted from the separate quantity field',async t=>{
 const amountReport=structuredClone(report);
 amountReport.assets=[{description:'여행 7번의 경험',source:2,quote:'여행 7번'}];
 amountReport.directions[1].evidence[1]={source:2,quote:'여행 7번'};
 amountReport.directions[2].evidence[1]={source:2,quote:'빈티지'};
 const {d,click,input,submit}=mount(t,async()=>new Response(JSON.stringify({report:amountReport})));
 input('textarea',reflections[0]);submit();input('textarea',reflections[1]);submit();
 input('textarea','빈티지, 여행');click('[data-investment-kind="experience"]');input('[data-investment-amount]','3년간 옷장 꽉, 여행 7번');
 submit();await settle();assert.ok(d.querySelector('.ai-report'));assert.ok(d.querySelector('.report-assets').textContent.includes('여행 7번'));
});
