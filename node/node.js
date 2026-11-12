import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
import './node.css';
import { ASSETS } from './assets.js';

// ───────── 아이콘 (stroke 기반) ─────────
const P = {
  branch: '<circle cx="6" cy="5" r="2.6"/><circle cx="18" cy="18.5" r="2.6"/><path d="M6 7.6V13c0 3 2.2 5.5 5.5 5.5h3.9"/>',
  pie: '<path d="M21.2104 15.8899a10 10 0 0 1-7.2676 5.9148A9.9996 9.9996 0 0 1 2.169 10.1646 10 10 0 0 1 8.0004 2.83m13.2388 5.343a10 10 0 0 1 .7292 3.0277c.0206.2568.0309.3852-.0201.5009a.525.525 0 0 1-.2199.2382c-.1112.06-.2501.06-.528.06h-8.4c-.28 0-.42 0-.527-.0544a.5.5 0 0 1-.2185-.2186c-.0545-.1069-.0545-.2469-.0545-.527v-8.4c0-.2778 0-.4167.0601-.528a.525.525 0 0 1 .2382-.2199c.1157-.051.2441-.0407.5009-.02a10 10 0 0 1 8.4396 6.1411"/>',
  bars: '<path d="M3 21h18M6 17v-5M10 17V8M15 17v-6M19 17V5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M17 7 7 17M7 7l10 10"/>',
  plus: '<path d="M12 5v14m-7-7h14"/>',
  up: '<path d="M12 19V5m0 0-7 7m7-7 7 7"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  edit: '<path d="M12 20h9M3 20h1.6746c.4892 0 .7338 0 .964-.0553.204-.049.399-.1298.578-.2394.2019-.1237.3748-.2967.7207-.6426L19.5001 6.5c.8284-.8284.8284-2.1716 0-3s-2.1716-.8284-3 0L3.9373 16.0627c-.346.3459-.5189.5189-.6425.7207a2 2 0 0 0-.2395.5781C3 17.5917 3 17.8363 3 18.3255z"/>',
  trash: '<path d="M9 3h6M3 6h18m-2 0-.7013 10.5193c-.1052 1.5782-.1578 2.3674-.4987 2.9657a3 3 0 0 1-1.2983 1.2147C15.882 21 15.0911 21 13.5093 21h-3.0186c-1.5818 0-2.3727 0-2.9924-.3003A3 3 0 0 1 6.2 19.485c-.3409-.5983-.3935-1.3875-.4987-2.9657L5 6m5 4.5v5m4-5v5"/>'
};
const icon = (name, size = 12, width = 2, color = 'currentColor') =>
  `<svg class="svg" width="${size}" height="${size}" style="width:${size}px;height:${size}px" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;
const mask = (src, cls = '') => `<i class="ico ${cls}" style="--m:url('${src}')" aria-hidden="true"></i>`;
const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

// ───────── 데이터 ─────────
const CHIPS = [['leisure', '레저'], ['used', '중고'], ['sea', '바다']];
const chips = (lg = '') => `<span class="chips">${CHIPS.map(([c, t]) => `<span class="chip ${c} ${lg}">${t}</span>`).join('')}</span>`;
const SALE = { icon: 'pie', label: '판매 채널', title: '중고 다이빙 장비 마켓', desc: '리뷰한 장비를 블로그와 중고거래 앱에서 되팔기', chips: true, by: '리뷰 AI가 찾음 · 근거 4' };
const CONTENT = {
  데이터: { label: '시세 Agent', title: '중고 장비 시세', desc: '리뷰할 장비 3개' },
  레포트: { label: '레포트 Agent', title: '장비 리뷰 레포트', desc: '리뷰 초안 2개' },
  이미지: { label: '이미지 Agent', title: '수중 장비 사진', desc: '보정할 컷 8장' },
  아이디어: { label: '아이디어 Agent', title: '리뷰 콘텐츠 아이디어', desc: '새 주제 5개' },
  계획표: { label: '계획 Agent', title: '리뷰 업로드 계획표', desc: '이번 달 4회' },
  예산안: { label: '예산 Agent', title: '장비 구매 예산안', desc: '되팔 장비 3개 기준' }
};
// 히트맵 (Figma 931:25216 ×1.25)
const HEAT = [
  [55.86, 23.48, '#52d9fa'], [121.76, 23.07, 'o'], [175.88, 44.07, '#fa8159'], [208.42, 64.67, '#fa8159'], [273.5, 23.48, '#fa8159'], [208.42, 23.48, '#fa8159'],
  [55.86, 44.07, '#e6fafe'], [120.94, 44.07, '#e6fafe'], [208.42, 44.07, '#fdcbba'], [175.88, 64.67, '#fdcbba'], [273.5, 44.07, '#fdcbba'], [273.5, 64.67, '#fdcbba'],
  [240.96, 64.67, '#fdcbba'], [240.96, 23.48, '#fdcbba'], [88.4, 44.07, '#e6fafe'], [88.4, 23.48, '#e6fafe'], [175.88, 23.48, '#f85a25'], [240.96, 44.07, '#f85a25']
];
const HEAT_S = [[210.48, '#fdcbba'], [243.02, '#fa8159'], [275.56, '#f85a25']];
const HEAT_X = [['<10만', 94.09], ['20만', 126.36], ['30만', 158.9], ['40만', 191.45], ['50만', 223.98], ['60만', 256.52], ['70만', 289.06]];
const HEAT_T = [['20만', 226.05], ['40만', 257.76], ['60만', 290.71]];
const heat = () => {
  const k = 1.25;
  return `<div class="heat" aria-label="중고 장비 시세 히트맵">
    <strong style="left:0;top:${33.25 * k}px">스노쿨링</strong><strong style="left:0;top:${55.49 * k}px">오리 핀</strong>
    ${HEAT.map(([x, y, c]) => `<i class="${c === 'o' ? 'o' : ''}" style="left:${x * k}px;top:${y * k}px;${c === 'o' ? '' : `background:${c}`}"></i>`).join('')}
    ${HEAT_S.map(([x, c]) => `<i class="s" style="left:${x * k}px;top:${9.89 * k}px;background:${c}"></i>`).join('')}
    <em style="left:${62.2 * k + 10}px;top:${93.29 * k}px;color:#000">조회수</em>${HEAT_X.map(([t, x]) => `<em style="left:${x * k}px;top:${93.29 * k}px">${t}</em>`).join('')}
    <em style="left:${185.77 * k + 13}px;top:${3.5 * k}px;color:#000">구독자수</em>${HEAT_T.map(([t, x]) => `<em style="left:${x * k}px;top:${3.5 * k}px">${t}</em>`).join('')}
  </div>`;
};

// 월드 좌표 = Figma 캔버스 프레임(931:21163) 기준 · 폭 402 기준으로 중앙 정렬
const baseNodes = () => ({
  root: { x: 29, y: 25, w: 184, h: 88, kind: 'dark' },
  sale: { x: 90, y: 173, w: 251, h: 171, ...SALE },
  saleL: { x: -111, y: 393, w: 251, h: 171, ...SALE },
  data: { x: 163, y: 393, w: 251, h: 171, icon: 'bars', label: '데이터 AI', title: '중고 장비 시세', desc: '마스크 · 핀 거래 많음 · 여름 전 거래 상승', heat: true }
});
// [출발, 도착, 스타일, 출발 x비율, 도착 x비율] — Figma 연결선(Vector 23349~23355) 위치 기준
const EDGES = [['root', 'sale', '', .42, .27], ['sale', 'saleL', '', .3, .58], ['sale', 'data', '', .76, .34], ['sale', 'next', 'lime', .5, .25], ['next', 'prop', 'dash', .25, .62], ['next', 'club', '', .25, .62]];

const state = {
  view: 'home', mode: 'idle', sel: null, nodes: baseNodes(), cam: { x: 0, y: 0 }, zoom: 75,
  nextType: null, draftText: '', step: 2, toast: null, activated: false, editing: null
};
let toastTimer = 0;
let undo = null;

// ───────── 렌더 ─────────
const app = document.getElementById('node-app');
const root = document.createElement('div');
root.className = 'nd';
root.style.setProperty('--orb', `url('${ASSETS.orb}')`);
root.style.setProperty('--orbi', `url('${ASSETS.orbInput}')`);
root.style.setProperty('--grid', `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="67.8" height="61.85"><g stroke="#e4e4e6" stroke-width=".6"><path d="M11 .5h45.8M.5 8v45.8"/></g><g stroke="#c9c9cc" stroke-width=".8"><path d="M.5-2.2v5.4M-2.2.5h5.4"/></g></svg>')}")`);
app.append(root);

const offsetX = () => Math.round(((root.clientWidth || 402) - 402) / 2);

function banner() {
  const s = state.mode === 'suggest' ? 'on' : state.step >= 3 ? 'done' : '';
  const btn = state.mode === 'suggest' ? '모두 추가' : '바로가기';
  const text = state.step >= 3 ? 'AI가 리뷰 · 판매 재료를 모두 찾았어요' : 'AI가 리뷰 · 판매 재료를 찾는 중';
  return `<div class="banner ${s}"><span class="orb"></span><span class="t">${text}</span><b>${Math.min(state.step, 3)}/3</b>
    ${state.step >= 3 && state.mode !== 'suggest' ? '' : `<button class="go" data-banner>${btn}</button>`}</div>`;
}

function nav(active = 'node') {
  const items = [['discover', '발견'], ['node', '노드'], ['home', '홈'], ['talk', '프리토킹'], ['my', 'My']];
  return `<nav class="nav" aria-label="하단 메뉴">${items.map(([k, t]) => `<button class="${k === active ? 'on' : ''}" data-tab="${k}" ${k === active ? 'aria-current="page"' : ''}>${mask(ASSETS.nav[k])}${t}</button>`).join('')}</nav>`;
}

function homeView() {
  const tab = `<svg viewBox="0 0 369 177" preserveAspectRatio="none" aria-hidden="true"><path d="M0 16C0 7 7 0 16 0h121c8 0 13 4 15.5 11l4 13c2 7 6 11 14 11H351c10 0 18 8 18 18v124H0z" fill="rgba(40,41,44,.9)"/></svg>`;
  const miniNode = (x, y, w, h) => `<span class="n" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></span>`;
  return `<section class="home" aria-label="확장">
    <div class="scroll">
      <h2>확장</h2>
      ${banner()}
      <div class="list">
        <button class="pcard" data-open="1" aria-label="가능성 카드 01 · 다이빙 리뷰로 중고 장비까지 파는 크리에이터 셀러 캔버스 열기">
          <span class="mini">${miniNode(64.6, 134.7, 200.8, 136.8)}${miniNode(221.6, 25.5, 200.8, 136.8)}</span>
          <span class="veil"></span>
          <span class="tags">${CHIPS.map(([c, t]) => `<span class="chip lg ${c}">${t}</span>`).join('')}</span>
          <span class="tab">${tab}</span>
          <span class="lbl">${icon('branch', 16.7, 1.6)}가능성 카드 01</span>
          <span class="ttl">다이빙 리뷰로 중고 장비까지 파는 크리에이터 셀러</span>
          <span class="meta"><span>노드<b>${Object.keys(state.nodes).length + 8}</b></span><span>채택<b>${state.step + 1}</b></span><span class="ai">AI 제안 ${state.step >= 3 ? 0 : 3}개 대기</span><span class="ago">2시간 전</span></span>
        </button>
        <div class="pcard2 ${state.activated ? 'on' : ''}">
          <span class="lbl">${icon('branch', 16.7, 1.6)}가능성 카드 02</span>
          <span class="tags"><span class="chip lg photo">사진</span><span class="chip lg sea">바다</span></span>
          <p class="ttl">필름 톤 수중 사진 보정</p>
          <p class="meta"><span>준비<b>12</b></span><span>채택<b>0</b></span></p>
          <span class="ago">3일 전</span>
          <button class="act" data-activate>${state.activated ? `${icon('check', 15, 2.2)}활성화됨 · AI가 재료를 찾는 중` : `${icon('plus', 15, 2.2)}활성화하기`}</button>
        </div>
        <button class="newcanvas" data-newcanvas>${icon('plus', 27, 1.6)}다른 가능성 카드로 캔버스 만들기</button>
      </div>
    </div>
    ${nav('node')}
  </section>`;
}

function nodeHtml(id, n) {
  if (n.kind === 'dark') {
    return `<div class="node dark" data-node="${id}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px">
      <p class="lb">${icon('branch', 11.9, 1.8)}가능성 카드 01</p>
      <p class="ttl">다이빙 리뷰로 중고 장비까지 파는<br>크리에이터 셀러</p></div>`;
  }
  const cls = ['node', n.compact && 'compact', n.isNew && 'new', n.prop && 'prop', state.sel === id && 'sel', n.gone && 'gone'].filter(Boolean).join(' ');
  const body = `
    <p class="lb">${icon(n.icon, 11.9, 2, n.prop ? 'var(--violet50)' : 'currentColor')}${esc(n.label)}</p>
    ${n.chips && !n.compact ? chips() : ''}
    <p class="ttl" ${state.editing === id ? 'contenteditable="true" data-edit' : ''}>${esc(n.title)}</p>
    <p class="ds">${esc(n.desc)}</p>
    ${n.by && !n.compact ? `<p class="by"><span class="avs"><i></i><i></i></span>${n.by}</p>` : ''}
    ${n.heat && !n.compact ? heat() : ''}
    ${n.prop ? `<span class="row"><button class="no" data-prop="no" aria-label="제안 거절">${icon('x', 16, 2)}</button><button class="yes" data-prop="yes">${icon('check', 16, 2)}추가</button></span>` : ''}`;
  return `<div class="${cls}" data-node="${id}" role="button" tabindex="0" aria-label="${esc(`${n.label} · ${n.title}`)}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px">${body}</div>`;
}

function edgePath(a, b, fa = .5, fb = .5) {
  const x1 = a.x + a.w * fa, y1 = a.y + a.h, x2 = b.x + b.w * fb, y2 = b.y;
  const dy = Math.max(40, (y2 - y1) * 0.6);
  return `M${x1 + 600} ${y1 + 600} C${x1 + 600} ${y1 + 600 + dy} ${x2 + 600} ${y2 + 600 - dy} ${x2 + 600} ${y2 + 600}`;
}

function minimap() {
  const list = Object.values(state.nodes).filter(n => !n.gone);
  const minX = Math.min(...list.map(n => n.x)) - 30, minY = Math.min(...list.map(n => n.y)) - 30;
  const maxX = Math.max(...list.map(n => n.x + n.w)) + 30, maxY = Math.max(...list.map(n => n.y + n.h)) + 30;
  const k = Math.min(84 / (maxX - minX), 59 / (maxY - minY));
  const r = n => `left:${(n.x - minX) * k}px;top:${(n.y - minY) * k}px;width:${n.w * k}px;height:${Math.max(3, n.h * k * 0.45)}px`;
  const s = state.zoom / 75, vw = (root.clientWidth || 402) / s, vh = ((root.clientHeight || 874) - 165) / s;
  const vx = (-state.cam.x - offsetX()) / s, vy = -state.cam.y / s;
  return `<div class="mmap" aria-hidden="true">${list.map(n => `<i class="${n.kind === 'dark' ? 'd' : ''}" style="${r(n)}"></i>`).join('')}
    <b style="left:${(vx - minX) * k}px;top:${(vy - minY) * k}px;width:${vw * k * 0.5}px;height:${vh * k * 0.45}px"></b></div>`;
}

function canvasView() {
  const n = state.nodes;
  const edges = EDGES.filter(([a, b]) => n[a] && n[b] && !n[a].gone && !n[b].gone)
    .map(([a, b, kind, fa, fb]) => { const d = edgePath(n[a], n[b], fa, fb); return `<path class="halo" d="${d}"/><path class="line ${kind || ''}" d="${d}"/>`; }).join('');
  const s = state.zoom / 75;
  const sel = state.sel && n[state.sel];
  const sx = sel ? sel.x + sel.w / 2 : 0;
  const tag = n.next && !n.next.gone && n.next.isNew ? `<span class="newtag" style="left:${n.next.x + n.next.w - 61}px;top:${n.next.y - 8}px">새 노드</span>` : '';
  const actions = state.mode === 'actions' && sel ? `
    <div class="pop" role="menu" style="left:${sx}px;top:${sel.y - 14}px">
      <button role="menuitem" data-act="ai">${mask(ASSETS.icAi)}AI</button>
      <button role="menuitem" data-act="edit">${icon('edit', 22, 1.6)}편집</button>
      <button role="menuitem" data-act="del">${icon('trash', 22, 1.6)}삭제</button>
    </div>
    <button class="pill" data-act="result" style="left:${sel.x + sel.w}px;top:${sel.y + sel.h * 0.5}px">결과 생성</button>
    <button class="pill" data-act="next" style="left:${sx}px;top:${sel.y + sel.h}px">다음 단계</button>` : '';
  const world = `<div class="world" style="transform:translate(${state.cam.x + offsetX()}px,${state.cam.y}px) scale(${s})">
      <svg class="edges" viewBox="0 0 1800 2000" aria-hidden="true">${edges}</svg>
      <div class="dim ${state.mode === 'actions' || state.mode === 'sheet' ? 'on' : ''}" data-dim></div>
      ${Object.entries(n).map(([id, node]) => nodeHtml(id, node)).join('')}${tag}${actions}
    </div>`;
  const sheetNode = sel || n.sale;
  return `<section class="canvas" aria-label="다이빙 리뷰 크리에이터 캔버스">
    <header class="hd"><button class="back" data-back aria-label="뒤로">${icon('left', 22, 2)}</button><h1>다이빙 리뷰 크리에이터</h1>${banner()}</header>
    <div class="stage" data-stage>
      <div class="grid" style="transform:translate(${(state.cam.x + offsetX()) % 67.8}px,${state.cam.y % 61.85}px)"></div>
      ${world}
      <button class="zoom" data-zoom aria-label="확대 비율 변경">${state.zoom}%</button>
      ${minimap()}
    </div>
    <div class="sheet ${state.mode === 'sheet' ? 'on' : ''}" role="dialog" aria-label="노드 상세" aria-hidden="${state.mode !== 'sheet'}">
      <span class="grab"></span>
      <p class="src"><span>${esc(sheetNode.label)} · 리뷰 AI 생성</span><span>진행 중</span></p>
      <h3>${esc(sheetNode.title)}</h3>
      <p class="sub">블로그 리뷰 글 아래 판매 링크 및 중고거래 앱 동시 등록</p>
      <div class="why"><b>왜 이 노드가 나왔나요?</b><ul>
        <li><em>중고 판매 이력 7건</em>과 <em>다이빙 장비 리뷰 글</em>이 겹쳐요.</li>
        <li><em>블로그 협찬 경험</em>이 있어 리뷰 후 장비를 되팔 수 있어요.</li></ul></div>
      <p class="rec">추천 노드</p>
      <div class="recs"><button class="hot" data-rec="데이터">장비 시세</button><button data-rec="아이디어">협찬 받을 브랜드</button><button data-rec="레포트">다른 판매 채널</button></div>
    </div>
    ${state.toast?.undo ? '' : askBar()}
  </section>`;
}

const askBar = () => `<form class="ask" data-ask><span class="orb" aria-hidden="true"></span>
  <input name="q" placeholder="검색 및 새로운 명령" autocomplete="off" aria-label="검색 및 새로운 명령" value="${esc(state.draftText)}">
  <button class="send" aria-label="보내기">${icon('up', 20, 2.2)}</button></form>`;

function nextView() {
  const pick = state.nextType && CONTENT[state.nextType];
  const label = pick ? pick.title : '새 노드';
  const desc = pick ? `${pick.label} · ${pick.desc}` : state.draftText ? state.draftText : '작업 지시 중';
  return `<section aria-label="다음 단계">
    <header class="hd short"><button class="back" data-back aria-label="뒤로">${icon('left', 22, 2)}</button><h1>다이빙 리뷰 크리에이터</h1></header>
    <div class="next">
      <span class="pill">다음 단계</span>
      <div class="draft ${pick ? 'ok' : ''}"><b>${esc(label)}</b><span>${esc(desc)}</span></div>
      <h3>다음 단계에 무엇을 이을까요?</h3>
      <p class="sub">자유롭게 생각을 전개해 보아요.</p>
      <p class="lbl">컨텐츠 선택하기</p>
      <div class="cgrid">${Object.keys(CONTENT).map(k => `<button class="${state.nextType === k ? 'on' : ''}" data-content="${k}"><img src="${ASSETS.content[k]}" alt="">${k}</button>`).join('')}</div>
      <button class="auto" data-auto><span class="orb"></span><span><b>Agent 자동화</b><span>다양한 결과를 계속 받아볼 수 있어요.</span></span>${icon('right', 18, 2)}</button>
    </div>
  </section>`;
}

function toastHtml() {
  const t = state.toast;
  return `<div class="toast ${t ? 'on' : ''}" role="status">${t ? `<span>${esc(t.text)}</span>${t.undo ? '<button data-undo>되돌리기</button>' : ''}` : ''}</div>`;
}

// 같은 화면 안에서는 DOM을 고쳐 쓰기만 해서 노드 이동·카메라 이동이 CSS 트랜지션으로 이어지게 함
function morph(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) { a.replaceWith(b.cloneNode(true)); return; }
  if (a.nodeType === 3) { if (a.data !== b.data) a.data = b.data; return; }
  if (a.nodeType !== 1) return;
  for (const { name } of [...a.attributes]) if (!b.hasAttribute(name)) a.removeAttribute(name);
  for (const { name, value } of [...b.attributes]) if (a.getAttribute(name) !== value) a.setAttribute(name, value);
  if (a.tagName === 'INPUT' && document.activeElement !== a) a.value = b.getAttribute('value') || '';
  const ac = [...a.childNodes], bc = [...b.childNodes];
  bc.forEach((child, i) => { if (ac[i]) morph(ac[i], child); else a.appendChild(child.cloneNode(true)); });
  for (let i = bc.length; i < ac.length; i++) ac[i].remove();
}

function render() {
  const focus = document.activeElement?.name === 'q';
  const next = document.createElement('div');
  next.innerHTML = (state.view === 'home' ? homeView() : state.view === 'next' ? nextView() : canvasView()) + toastHtml();
  const same = root.firstElementChild && root.firstElementChild.getAttribute('aria-label') === next.firstElementChild.getAttribute('aria-label');
  if (same) {
    const ac = [...root.childNodes], bc = [...next.childNodes];
    bc.forEach((child, i) => { if (ac[i]) morph(ac[i], child); else root.appendChild(child); });
    for (let i = bc.length; i < ac.length; i++) ac[i].remove();
  }
  else root.replaceChildren(...next.childNodes);
  if (focus) root.querySelector('[name="q"]')?.focus();
  const edit = root.querySelector('[data-edit]');
  if (edit) { edit.focus(); document.getSelection()?.selectAllChildren(edit); }
}

// ───────── 동작 ─────────
function toast(text, undoFn = null, ms = 3200) {
  undo = undoFn;
  state.toast = { text, undo: !!undoFn };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { state.toast = null; undo = null; if (state.mode === 'added') state.mode = 'idle'; render(); }, ms);
  render();
}

function focusNode(id, top = 57, center = true) {
  const n = state.nodes[id];
  if (!n) return;
  const s = state.zoom / 75;
  state.cam = { x: center ? Math.round(201 - (n.x + n.w / 2) * s) : state.cam.x, y: Math.round(top - n.y * s) };
}

function snapshot() { return JSON.parse(JSON.stringify({ nodes: state.nodes, cam: state.cam, step: state.step })); }
function restore(s) { Object.assign(state, s, { mode: 'idle', sel: null }); }

function addNext(type = '데이터') {
  const before = snapshot();
  const c = CONTENT[type];
  const n = state.nodes;
  delete n.prop; delete n.club;
  n.saleL = { ...n.saleL, x: -141, y: 391, w: 228, h: 138, compact: true };
  n.data = { ...n.data, x: 341, y: 395, w: 205, h: 106, label: '데이터 Agent', compact: true };
  n.next = { x: 126, y: 451, w: 205, h: 106, icon: 'bars', label: c.label, title: c.title, desc: c.desc, isNew: true };
  n.prop = { x: 49, y: 607, w: 205, h: 144, icon: 'bars', label: 'Agent 제안', title: '다이빙 동호회 3곳', desc: '중고 장비 구매자가 모이는 곳', prop: true };
  state.view = 'canvas'; state.sel = null; state.nextType = null; state.draftText = '';
  state.mode = 'suggest';
  state.cam = { x: -24, y: -155 };
  render();
  setTimeout(() => toast(`‘리뷰할 ${c.title}’를 추가했어요`, () => { restore(before); render(); }), 380);
}

function acceptProposal() {
  const n = state.nodes;
  if (!n.prop) return;
  const before = snapshot();
  n.club = { ...n.prop, prop: false, label: '모임 Agent', icon: 'pie', isNew: true, h: 106 };
  delete n.prop;
  if (n.next) n.next.isNew = false;
  state.step = 3; state.mode = 'idle';
  state.cam = { x: -24, y: -330 };
  toast('‘다이빙 동호회 3곳’을 추가했어요', () => { restore(before); state.mode = 'suggest'; render(); });
}

function rejectProposal() {
  const before = snapshot();
  delete state.nodes.prop;
  state.mode = 'idle';
  toast('제안을 숨겼어요', () => { restore(before); state.mode = 'suggest'; render(); });
}

function deleteNode(id) {
  const before = snapshot();
  state.nodes[id] = { ...state.nodes[id], gone: true };
  state.sel = null; state.mode = 'idle';
  toast(`‘${state.nodes[id].title}’ 노드를 삭제했어요`, () => { restore(before); render(); });
}

function openNode(id) {
  if (state.nodes[id]?.kind === 'dark') return;
  if (state.nodes[id]?.prop) return;
  state.sel = id; state.mode = 'actions';
  focusNode(id, 131, false);
  render();
}

root.addEventListener('click', event => {
  const t = event.target.closest('button,[data-node],[data-dim]');
  if (!t || dragMoved) return;
  const d = t.dataset;
  if (d.open) { state.view = 'canvas'; state.mode = 'idle'; state.cam = { x: 0, y: 0 }; return render(); }
  if (d.activate !== undefined) { state.activated = !state.activated; render(); return toast(state.activated ? '가능성 카드 02를 활성화했어요' : '활성화를 취소했어요'); }
  if (d.newcanvas !== undefined) return toast('새 가능성 카드는 발견 탭에서 고를 수 있어요');
  if (d.tab) return d.tab === 'node' ? null : toast('프로토타입에서는 노드 탭이 연결돼 있어요');
  if (d.back !== undefined) {
    if (state.view === 'next') { state.view = 'canvas'; state.mode = 'idle'; state.nextType = null; return render(); }
    if (state.mode !== 'idle' && state.mode !== 'suggest') { state.mode = 'idle'; state.sel = null; return render(); }
    state.view = 'home'; state.mode = state.mode === 'suggest' ? 'suggest' : 'idle'; return render();
  }
  if (d.banner !== undefined) {
    if (state.mode === 'suggest') return acceptProposal();
    if (state.view === 'home') { state.view = 'canvas'; }
    return addNext('데이터');
  }
  if (d.dim !== undefined) { state.mode = 'idle'; state.sel = null; return render(); }
  if (d.zoom !== undefined) { state.zoom = state.zoom === 75 ? 100 : state.zoom === 100 ? 50 : 75; return render(); }
  if (d.prop) return d.prop === 'yes' ? acceptProposal() : rejectProposal();
  if (d.act) {
    const id = state.sel;
    if (d.act === 'ai' || d.act === 'result') { state.mode = 'sheet'; focusNode(id, 57); return render(); }
    if (d.act === 'edit') { state.editing = id; state.mode = 'idle'; state.sel = null; return render(); }
    if (d.act === 'del') return deleteNode(id);
    if (d.act === 'next') { state.view = 'next'; state.mode = 'idle'; state.sel = null; return render(); }
  }
  if (d.rec) { state.mode = 'idle'; state.sel = null; return addNext(d.rec); }
  if (d.content) { state.nextType = d.content; render(); return setTimeout(() => addNext(d.content), 650); }
  if (d.auto !== undefined) return toast('Agent 자동화를 켰어요 · 새 결과가 생기면 알려드릴게요');
  if (d.undo !== undefined) { const fn = undo; undo = null; state.toast = null; clearTimeout(toastTimer); fn?.(); return render(); }
  if (d.node && state.editing !== d.node) return openNode(d.node);
});

root.addEventListener('keydown', event => {
  const node = event.target.closest?.('[data-node]');
  if (event.target.dataset?.edit !== undefined && event.key === 'Enter') { event.preventDefault(); event.target.blur(); return; }
  if (node && (event.key === 'Enter' || event.key === ' ') && !event.target.isContentEditable) { event.preventDefault(); openNode(node.dataset.node); }
  if (event.key === 'Escape' && state.mode !== 'idle') { state.mode = 'idle'; state.sel = null; render(); }
});

root.addEventListener('focusout', event => {
  if (event.target.dataset?.edit === undefined) return;
  const id = state.editing;
  const text = event.target.textContent.trim();
  state.editing = null;
  if (id && text) state.nodes[id].title = text;
  setTimeout(render);
});

root.addEventListener('input', event => { if (event.target.name === 'q') state.draftText = event.target.value; });
root.addEventListener('submit', event => {
  if (!event.target.matches('[data-ask]')) return;
  event.preventDefault();
  if (!state.draftText.trim()) return toast('무엇을 이어갈지 적어 주세요');
  state.view = 'next'; state.mode = 'idle'; state.sel = null; state.nextType = null;
  render();
});

// 캔버스 드래그 이동
let drag = null, dragMoved = false;
root.addEventListener('pointerdown', event => {
  const stage = event.target.closest('[data-stage]');
  if (!stage || event.target.closest('button,.mmap,[data-edit]') || state.mode === 'sheet') return;
  drag = { x: event.clientX, y: event.clientY, cx: state.cam.x, cy: state.cam.y, stage };
  dragMoved = false;
});
window.addEventListener('pointermove', event => {
  if (!drag) return;
  const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
  if (!dragMoved && Math.hypot(dx, dy) < 6) return;
  dragMoved = true;
  drag.stage.classList.add('drag');
  state.cam = { x: drag.cx + dx, y: drag.cy + dy };
  const world = drag.stage.querySelector('.world');
  world.style.transform = `translate(${state.cam.x + offsetX()}px,${state.cam.y}px) scale(${state.zoom / 75})`;
  drag.stage.querySelector('.grid').style.transform = `translate(${(state.cam.x + offsetX()) % 67.8}px,${state.cam.y % 61.85}px)`;
});
window.addEventListener('pointerup', () => {
  if (!drag) return;
  drag.stage.classList.remove('drag');
  const moved = dragMoved;
  drag = null;
  if (moved) { render(); setTimeout(() => { dragMoved = false; }, 0); }
});
window.addEventListener('resize', () => render());

render();
