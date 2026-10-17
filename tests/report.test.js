import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createReportHandler } from '../api/report.js';
import { validateReport } from '../report-contract.js';
import { reportView, reflectionPage } from '../report-ui.js';

const reflections=['독립서점과 작은 책방에 자꾸 가고 싶어요','오래된 가구의 색감과 책 표지가 눈에 들어와요','지난 3년 동안 책을 읽고 독서모임을 운영했어요'];
const payload={answers:[0,6,4,2,3,4,1],reflections};
export const report={title:'책과 공간을 잇는 나의 시선',summary:'책방과 오래된 가구에 대한 관심을 독서모임 경험과 연결해볼 수 있어요.',keywords:['책','공간','색감'],assets:['3년 동안 책을 읽고 독서모임을 운영한 경험'],directions:[
 {title:'동네 책방을 소개하는 카드뉴스 계정',reason:'책방에 끌리는 마음과 독서 경험은 책방의 매력을 알아보는 데 도움이 될 수 있어요.',contribution:'책방마다 다른 공간과 책의 매력을 카드뉴스로 전할 때 강점이 빛날 수 있어요.',feasibility:'책방에 대한 관심과 읽어온 책이 계정에 담을 소재로 이어질 수 있어요.',source:0,quote:'독립서점과 작은 책방'},
 {title:'책 표지의 색감을 모으는 취향 계정',reason:'책 표지와 색감에 눈길이 가는 감각은 책을 소개하는 콘텐츠에 도움이 될 수 있어요.',contribution:'책 표지마다 다른 색감을 모아 보여주는 게시물에서 세심한 시선이 빛날 수 있어요.',feasibility:'이미 눈길이 가는 책 표지가 있어 나만의 색감 기록에 담을 소재와 가까워요.',source:1,quote:'가구의 색감과 책 표지'},
 {title:'한 달에 한 권을 함께 읽는 작은 모임',reason:'독서모임을 운영한 경험은 사람들의 이야기를 연결하는 데 도움이 될 수 있어요.',contribution:'처음 온 참여자도 편안하게 말을 꺼낼 수 있는 모임에서 운영 경험이 빛날 수 있어요.',feasibility:'직접 운영해온 경험이 있어 새 자격이 필요한 전문 상담보다 한 달에 한 권을 함께 읽는 작은 모임이 지금의 기반과 가까워요.',source:2,quote:'독서모임을 운영했어요'}
],outlook:{scene:'동네 책방에서 작은 독서모임을 진행하는 모습이 지금의 경험과 이어질 수 있어요.',value:'책에 대한 관심과 운영 경험이 처음 만난 사람들이 편하게 이야기를 나누는 데 도움이 될 수 있어요.'}};
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
