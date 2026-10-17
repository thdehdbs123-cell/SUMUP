import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createReportHandler } from '../api/report.js';
import { validateReport } from '../report-contract.js';
import { reportView, reflectionPage } from '../report-ui.js';

const reflections=['독립서점과 작은 책방에 자꾸 가고 싶어요','오래된 가구의 색감과 책 표지가 눈에 들어와요','지난 3년 동안 책을 읽고 독서모임을 운영했어요'];
const payload={answers:[0,6,4,2,3,4,1],reflections};
export const report={title:'책과 공간을 잇는 나의 시선',summary:'책방과 오래된 가구에 대한 관심을 독서모임 경험과 연결해볼 수 있어요.',keywords:['책','공간','색감'],assets:['3년 동안 책을 읽고 독서모임을 운영한 경험'],directions:[
 {title:'동네 책방 탐방 기록',reason:'책방에 끌리는 이유를 관찰하는 활동이에요.',firstStep:'좋아하는 책방의 특징 세 가지를 적어보세요.',source:0,quote:'독립서점과 작은 책방'},
 {title:'책 표지 색감 수집',reason:'눈에 들어오는 색감을 모아 취향의 공통점을 찾아보세요.',firstStep:'마음에 드는 표지 세 개를 골라보세요.',source:1,quote:'가구의 색감과 책 표지'},
 {title:'공간을 주제로 한 독서모임',reason:'기존 운영 경험을 활용해 작은 모임을 시도할 수 있어요.',firstStep:'모임 구성원에게 관심 있는 공간을 물어보세요.',source:2,quote:'독서모임을 운영했어요'}
],experiment:{action:'책방 한 곳에서 좋아하는 요소 세 가지 기록하기',timebox:'이번 주 30분',reflection:'어떤 요소가 다시 가보고 싶게 했나요?'}};
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
 for(const body of [{...payload,answers:[0]}, {...payload,reflections:['a',...reflections.slice(1)]},{...payload,reflections:['x'.repeat(1501),...reflections.slice(1)]}])assert.equal((await invoke(handler,body)).statusCode,400);
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
 const bad=structuredClone(report);bad.directions[0].quote='사용자가 말하지 않은 경력';assert.equal(validateReport(bad,reflections),false);
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
 const malicious=structuredClone(report);malicious.title='<img src=x onerror=alert(1)>';malicious.directions[0].quote='<script>alert(1)</script>';
 const html=reportView(malicious);assert.equal(html.includes('<img'),false);assert.equal(html.includes('<script>'),false);assert.ok(html.includes('&lt;img'));
 const form=reflectionPage(['</textarea><script>alert(1)</script>','',''],'idle','');assert.equal(form.includes('<script>'),false);
});
