import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const source=readFileSync(new URL('../node/node.js',import.meta.url),'utf8').replace(/^import .*;$/gm,'');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const ASSETS={orb:'o.png',orbInput:'oi.png',icAi:'ai.png',content:{데이터:'',레포트:'',이미지:'',아이디어:'',계획표:'',예산안:''},nav:{discover:'',node:'',home:'',talk:'',my:''}};

function mount(t){
 const dom=new JSDOM('<div id="node-app"></div>',{url:'http://localhost:5174/node/',runScripts:'outside-only',pretendToBeVisual:true});
 t.after(()=>dom.window.close());const w=dom.window,d=w.document;
 w.ASSETS=ASSETS;w.eval(source);
 const click=selector=>{const element=d.querySelector(selector);assert.ok(element,selector);element.dispatchEvent(new w.MouseEvent('click',{bubbles:true}))};
 return {w,d,click};
}

test('확장 홈 → 캔버스 → 노드 액션 → AI 시트',t=>{
 const {d,click}=mount(t);
 assert.match(d.querySelector('.home h2').textContent,/확장/);
 assert.equal(d.querySelectorAll('.pcard,.pcard2').length,2);
 click('[data-open]');
 assert.equal(d.querySelectorAll('[data-node]').length,4);
 assert.ok(d.querySelector('.edges path.line'));
 click('[data-node="sale"]');
 assert.ok(d.querySelector('[data-node="sale"]').classList.contains('sel'));
 assert.deepEqual([...d.querySelectorAll('.pop button')].map(b=>b.textContent.trim()),['AI','편집','삭제']);
 click('[data-act="ai"]');
 assert.ok(d.querySelector('.sheet').classList.contains('on'));
 assert.match(d.querySelector('.sheet h3').textContent,/중고 다이빙 장비 마켓/);
});

test('다음 단계에서 컨텐츠를 고르면 새 노드와 Agent 제안이 생기고 되돌릴 수 있음',async t=>{
 const {d,click}=mount(t);
 click('[data-open]');click('[data-node="sale"]');click('[data-act="next"]');
 assert.equal(d.querySelectorAll('[data-content]').length,6);
 click('[data-content="데이터"]');await wait(1100);
 assert.ok(d.querySelector('[data-node="next"]'));
 assert.ok(d.querySelector('[data-node="prop"]'));
 assert.match(d.querySelector('.banner').className,/on/);
 assert.match(d.querySelector('.toast').textContent,/중고 장비 시세/);
 click('[data-undo]');
 assert.equal(d.querySelector('[data-node="next"]'),null);
});

test('Agent 제안 수락과 노드 삭제',async t=>{
 const {d,click}=mount(t);
 click('[data-open]');click('[data-banner]');await wait(500);
 click('[data-prop="yes"]');
 assert.ok(d.querySelector('[data-node="club"]'));
 assert.match(d.querySelector('.banner').textContent,/3\/3/);
 click('[data-node="data"]');click('[data-act="del"]');
 assert.ok(d.querySelector('[data-node="data"]').classList.contains('gone'));
});
