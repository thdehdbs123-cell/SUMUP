import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createReportHandler } from '../api/report.js';
import { validateReport, validateReflections, normalizeInvestment } from '../report-contract.js';
import { reportView, reflectionPage } from '../report-ui.js';

import { reflections, answers, report } from './fixtures/report.js';
const payload={answers,reflections};
const env=()=>({OPENAI_API_KEY:'test-only-key'});
const success=data=>new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(data)}]}]}),{status:200});
async function invoke(handler,body=payload,{method='POST',headers={},raw=false,parsed=false}={}) {
 const value=raw?body:JSON.stringify(body);
 const req=Readable.from([value]);req.method=method;req.headers={'content-type':'application/json',host:'localhost',...headers};req.socket={remoteAddress:'127.0.0.1'};
 if(parsed)req.body=body;
 const res={headers:{},setHeader(k,v){this.headers[k]=v},end(value){this.body=JSON.parse(value)}};
 await handler(req,res);return res;
}

test('server generates grounded structured report and never returns credentials',async()=>{
 let calls=0;
 const handler=createReportHandler({environment:env,request:async(url,options)=>{
  calls++;assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(options.headers.Authorization,'Bearer test-only-key');
  const input=JSON.parse(options.body);assert.equal(input.store,false);assert.equal(input.text.format.strict,true);assert.equal(input.model,'gpt-4.1-mini');
  const user=JSON.parse(input.input[1].content);assert.equal(user.tendencies.answerInterpretations.length,7);assert.equal(user.reflections.length,3);assert.equal(user.name,undefined);
  return success(report);
 }});
 const result=await invoke(handler);assert.equal(result.statusCode,200);assert.deepEqual(result.body,{report});assert.equal(calls,1);assert.equal(JSON.stringify(result.body).includes('test-only-key'),false);assert.equal(result.headers['Cache-Control'],'no-store');
});

test('invalid input and oversized or malformed bodies never call the provider',async()=>{
 let calls=0;const handler=createReportHandler({environment:env,request:async()=>{calls++;return success(report)}});
 for(const body of [{...payload,answers:[0]}, {...payload,reflections:['a',...reflections.slice(1)]},{...payload,reflections:['x'.repeat(201),...reflections.slice(1)]}])assert.equal((await invoke(handler,body)).statusCode,400);
 assert.equal((await invoke(handler,'{broken',{raw:true})).statusCode,400);
 assert.equal((await invoke(handler,' '.repeat(20001),{raw:true})).statusCode,413);
 assert.equal((await invoke(handler,payload,{method:'GET'})).statusCode,405);
 assert.equal((await invoke(handler,payload,{headers:{origin:'https://other.example'}})).statusCode,403);
 assert.equal(calls,0);
});

test('Vercel parsed bodies and local stream bodies both work',async()=>{
 const handler=createReportHandler({environment:env,request:async()=>success(report)});
 assert.equal((await invoke(handler,payload,{parsed:true})).statusCode,200);
});

test('missing credentials, provider errors and timeouts have safe actionable errors',async()=>{
 const missing=await invoke(createReportHandler({environment:()=>({})}));assert.equal(missing.statusCode,503);assert.equal(missing.body.code,'AI_NOT_CONFIGURED');
 for(const status of [401,403,429,500]){
  const result=await invoke(createReportHandler({environment:env,request:async()=>new Response('sensitive provider diagnostic',{status})}));
  assert.ok([502,503].includes(result.statusCode));assert.equal(JSON.stringify(result.body).includes('sensitive'),false);
 }
 const timeout=await invoke(createReportHandler({environment:env,request:async()=>{throw new DOMException('timeout','TimeoutError')}}));assert.equal(timeout.statusCode,504);
});

test('fabricated evidence, invalid JSON and incomplete output are rejected',async()=>{
 const bad=structuredClone(report);bad.directions[0].evidence[0].quote='사용자가 말하지 않은 경력';assert.equal(validateReport(bad,reflections),false);
 for(const response of [success(bad),new Response(JSON.stringify({status:'incomplete',output:[]})),new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:'not json'}]}]}))]){
  const result=await invoke(createReportHandler({environment:env,request:async()=>response}));assert.equal(result.statusCode,502);
 }
});

test('per-instance quota stops repeated calls and expires',async()=>{
 let time=0,calls=0;const handler=createReportHandler({environment:env,now:()=>time,request:async()=>{calls++;return success(report)}});
 for(let i=0;i<5;i++)assert.equal((await invoke(handler)).statusCode,200);
 assert.equal((await invoke(handler)).statusCode,429);assert.equal(calls,5);time=15*60*1000;assert.equal((await invoke(handler)).statusCode,200);
});

test('user and model text are escaped before HTML rendering',()=>{
 const malicious=structuredClone(report);malicious.title='<img src=x onerror=alert(1)>';malicious.directions[0].evidence[0].quote='<script>alert(1)</script>';
 const html=reportView(malicious);assert.equal(html.includes('<img'),false);assert.equal(html.includes('<script>'),false);assert.ok(html.includes('&lt;img'));
 const form=reflectionPage(['</textarea><script>alert(1)</script>','',''],'idle','');assert.equal(form.includes('<script>'),false);
});

test('reports require strength applications and realistic scope, not a task plan',()=>{
 const invalid=structuredClone(report);delete invalid.directions[0].feasibility;
 assert.equal(validateReport(invalid,reflections),false);
 const old=structuredClone(report);delete old.outlook;old.experiment={action:'공부하세요',timebox:'30분',reflection:'다음 과제'};
 assert.equal(validateReport(old,reflections),false);
 const html=reportView(report);
 assert.ok(html.includes('내 강점이 빛날 수 있는 작은 프로젝트'));
 for(const direction of report.directions){assert.ok(html.includes(direction.contribution));assert.ok(html.includes(direction.feasibility));}
 assert.equal(html.includes('이번 주, 작은 실험'),false);
 assert.equal(html.includes('작은 시작</b>'),false);
});

test('two of three short answers are enough, while partial and oversized answers are rejected',()=>{
 assert.equal(validateReflections([reflections[0],reflections[1],'']),true);
 assert.equal(validateReflections(['',reflections[1],reflections[2]]),true);
 assert.equal(validateReflections([reflections[0],'','']),false);
 assert.equal(validateReflections([reflections[0],reflections[1],'a']),false);
 assert.equal(validateReflections([reflections[0],reflections[1],'a'.repeat(201)]),false);
 assert.equal(validateReflections([reflections[0],reflections[1],'   ']),true);
 assert.equal(validateReflections([reflections[0],reflections[1],' '.repeat(201)]),false);
});

test('every idea must link distinct answered sources and an actual reported tendency',()=>{
 const duplicate=structuredClone(report);duplicate.directions[0].evidence=[{source:0,quote:'없는 구절'},{source:0,quote:'없는 구절'}];
 assert.equal(validateReport(duplicate,reflections),false);
 const repeated=structuredClone(report);repeated.directions[0].evidence=[{source:0,quote:'독립서점'},{source:0,quote:'작은 책방'}];
 assert.equal(validateReport(repeated,reflections),false);
 const single=structuredClone(report);single.directions[0].evidence.pop();assert.equal(validateReport(single,reflections),false);
 const long=structuredClone(report);long.directions[0].evidence[0].quote='x'.repeat(61);assert.equal(validateReport(long,['x'.repeat(200),...reflections.slice(1)]),false);
 assert.equal(validateReport(report,reflections,['planner']),false);
});

test('a skipped answer stays absent, two answered sources are linked, and no experience may be invented',async()=>{
 const two={...payload,reflections:[reflections[0],reflections[1],''],investment:{kind:'experience',amount:'40회'}};
 const noExperience=structuredClone(report);noExperience.assets=[];
 noExperience.directions.forEach(d=>d.evidence=[{source:0,quote:'독립서점'},{source:1,quote:'책 표지'}]);
 let user;
 const handler=createReportHandler({environment:env,request:async(_url,options)=>{user=JSON.parse(JSON.parse(options.body).input[1].content);return success(noExperience)}});
 const result=await invoke(handler,two);assert.equal(result.statusCode,200);assert.deepEqual(user.reflections.map(r=>r.source),[0,1]);assert.deepEqual(user.investment,{kind:null,kindLabel:null,amount:''});
 const bad=structuredClone(noExperience);bad.directions[0].evidence[1]={source:2,quote:'없는 구절'};assert.equal(validateReport(bad,two.reflections),false);
 assert.ok(reportView(noExperience).includes('직접 해본 경험은 아직 적지 않았어요'));
});

test('investment kind and quantity are validated and transmitted without becoming invented facts',async()=>{
 assert.deepEqual(normalizeInvestment(undefined),{kind:null,amount:''});
 assert.throws(()=>normalizeInvestment({kind:'anything',amount:'40회'}));
 assert.throws(()=>normalizeInvestment({kind:'time',amount:'x'.repeat(81)}));
 let investment;
 const handler=createReportHandler({environment:env,request:async(_url,options)=>{investment=JSON.parse(JSON.parse(options.body).input[1].content).investment;return success(report)}});
 const result=await invoke(handler,{...payload,investment:{kind:'experience',amount:' 40회 '}});
 assert.equal(result.statusCode,200);assert.deepEqual(investment,{kind:'experience',kindLabel:'경험',amount:'40회'});
 const invalid=await invoke(handler,{...payload,investment:{kind:'bad',amount:'40회'}});assert.equal(invalid.statusCode,400);
});
