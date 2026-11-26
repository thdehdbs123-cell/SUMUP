import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source=readFileSync(new URL('../home/home.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const nav={discover:'',node:'',home:'',talk:'',my:''};

function mount(t){
 const dom=new JSDOM('<div id="home-app"></div>',{url:'http://localhost:5174/home/',runScripts:'outside-only',pretendToBeVisual:true});
 t.after(()=>dom.window.close());const w=dom.window,d=w.document;
 w.A={blobBlue:'',blobGreen:'',blobLight:'',swoosh:'',bell:'',badge:'',profile:'',plus:'',voice:'',nav};
 w.eval(source);
 const click=selector=>{const el=d.querySelector(selector);assert.ok(el,selector);el.dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}))};
 return {w,d,click};
}

test('홈: 인사, 흐르는 추천 칩 두 줄, 칩을 누르면 입력창에 채워지고 보내기 버튼으로 바뀜',t=>{
 const {d,click}=mount(t);
 assert.match(d.querySelector('.hello h1').textContent,/수아님 안녕하세요!/);
 assert.equal(d.querySelectorAll('.chips .row').length,2);
 assert.ok(d.querySelector('.bg .blob.blue')&&d.querySelector('.bg .blob.green')&&d.querySelector('.bg .blob.light'));
 click('[data-chip="최근 저장한 사진 분석"]');
 assert.equal(d.querySelector('[name="q"]').value,'최근 저장한 사진 분석');
 assert.ok(d.querySelector('[data-send]'));
});

test('홈: 음성 입력 → 받아쓰기 → 보내면 대화와 노드 연결 버튼',async t=>{
 const {w,d,click}=mount(t);
 click('[data-mic]');
 assert.ok(d.querySelector('.hm').classList.contains('listen'));
 await wait(1200);
 click('[data-mic]');
 assert.match(d.querySelector('[name="q"]').value,/빈티지 다이빙/);
 d.querySelector('[data-ask]').dispatchEvent(new w.Event('submit',{cancelable:true}));
 assert.ok(d.querySelector('.hm').classList.contains('chat'));
 assert.match(d.querySelector('.msg.mine').textContent,/빈티지 다이빙/);
 await wait(1400);
 assert.equal(d.querySelector('.msg.bot .go').getAttribute('href'),'../node/');
});

test('홈: 알림 3개 열기',t=>{
 const {d,click}=mount(t);
 click('[data-bell]');
 assert.ok(d.querySelector('.noti').classList.contains('on'));
 assert.equal(d.querySelectorAll('.noti a').length,3);
});

test('사전링크 결과 → 어플 시작 → 소개 4장 → 메인홈 (이름 전달)',t=>{
 const intro=readFileSync(new URL('../app/intro.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
 const dom=new JSDOM('<div id="intro-app"></div>',{url:'http://localhost:5174/app/?name=%EB%8F%84%EC%9C%A4',runScripts:'outside-only',pretendToBeVisual:true});
 t.after(()=>dom.window.close());const w=dom.window,d=w.document;
 w.H={blobBlue:'',blobGreen:'',blobLight:''};w.N={orb:'',content:{레포트:'',계획표:'',예산안:''}};w.matchMedia=()=>({matches:true});
 w.eval(intro);
 assert.match(d.querySelector('.hey').textContent,/도윤님/);
 assert.equal(d.querySelectorAll('.slide').length,4);
 assert.equal(d.querySelector('[data-next]').getAttribute('href'),'../home/?name=%EB%8F%84%EC%9C%A4');
 assert.equal(d.querySelector('.skip').getAttribute('href'),'../home/?name=%EB%8F%84%EC%9C%A4');
 const src=readFileSync(new URL('../src.js',import.meta.url),'utf8');
 assert.match(src,/href="app\/\?name=/);
});

test('greets with the given name only, without the surname',()=>{
 const src=readFileSync(new URL('../home/home.js',import.meta.url),'utf8');
 const fn=new Function(src.match(/const givenName = [^\n]+/)[0]+';return givenName')();
 assert.equal(fn('송도윤'),'도윤');
 assert.equal(fn('남궁민수'),'민수');
 assert.equal(fn('도윤'),'도윤');
 assert.equal(fn('Alex'),'Alex');
 assert.match(readFileSync(new URL('../app/intro.js',import.meta.url),'utf8'),/esc\(CALL\)\}님, 반가워요!/);
});
