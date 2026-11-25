import './home.css';
import { HOME_ASSETS as A } from './assets.js';

const NAME = (new URLSearchParams(location.search).get('name') || '').trim().slice(0, 20) || '수아';
const CHIPS_1 = ['빈티지샵 공간 무드보드 제작', '새로 시청한 유튜브 분석', '다이빙 장비 리뷰 정리', '이번 주 기록 돌아보기'];
const CHIPS_2 = ['최근 저장한 사진 분석', '내게 맞는 컨텐츠 추천', '새로 시청한 영상 요약', '여행 사진으로 가능성 찾기'];
const NOTI = [
  ['✨', '#f6ffd6', '새로운 관심사를 발견했어요!', '최근 기록에서 ‘공간 큐레이션’에 대한 관심을 찾았어요', '../node/'],
  ['🎯', '#eae2fd', '오늘의 작은 미션', '리뷰할 다이빙 포인트 조사하기', '../node/'],
  ['📈', '#e6fafe', '오늘 할 일 20%', '4개 중 1개를 마쳤어요', '../node/']
];
const HEARD = '요즘 빈티지 다이빙 장비가 자꾸 눈에 들어와';
const NAV = [['discover', '발견', null], ['node', '노드', '../node/'], ['home', '홈', null], ['talk', '프리토킹', null], ['my', 'My', null]];

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const chipRow = (list, cls) => {
  const items = list.map(t => `<button class="chip" data-chip="${esc(t)}">${esc(t)}</button>`).join('');
  // 같은 줄을 두 번 이어 붙여 끊김 없이 흐르게 함 (두 번째 묶음은 보조기기에서 숨김)
  return `<div class="row ${cls}"><div class="track">${items}<span style="display:contents" aria-hidden="true">${items.replaceAll('<button', '<button tabindex="-1"')}</span></div></div>`;
};

const app = document.getElementById('home-app');
app.innerHTML = `<main class="hm" aria-label="홈">
  <div class="bg" aria-hidden="true">
    <div class="blob blue"><img src="${A.blobBlue}" alt=""></div>
    <div class="blob green"><img src="${A.blobGreen}" alt=""></div>
    <div class="blob light"><img src="${A.blobLight}" alt=""></div>
    <div class="sheen"></div>
    <img class="swoosh" src="${A.swoosh}" alt="">
    <div class="fade"></div>
  </div>
  <div class="top">
    <button class="bellbtn" data-bell aria-label="알림 3개" aria-expanded="false"><img src="${A.bell}" alt=""><img class="badge" src="${A.badge}" alt=""></button>
    <button class="me" data-me aria-label="내 정보"><img src="${A.profile}" alt=""></button>
  </div>
  <div class="noti" role="menu" aria-label="알림">${NOTI.map(([e, bg, t, s, href]) => `<a role="menuitem" href="${href}"><i style="background:${bg}">${e}</i><span><b>${t}</b><span>${s}</span></span></a>`).join('')}</div>
  <section class="hello" aria-live="polite"><h1>${NAME}님 안녕하세요!</h1><p>오늘은 어떤 가능성을 만들어 볼까요?</p></section>
  <div class="talk" aria-live="polite"></div>
  <div class="chips" aria-label="추천">${chipRow(CHIPS_1, 'r1')}${chipRow(CHIPS_2, 'r2')}</div>
  <form class="ask" data-ask>
    <button type="button" class="plus" data-plus aria-label="파일 추가"><img src="${A.plus}" alt=""></button>
    <input name="q" placeholder="오늘 떠오른 생각을 적어보세요" autocomplete="off" aria-label="오늘 떠오른 생각">
    <button type="button" class="mic" data-mic aria-label="음성으로 말하기" aria-pressed="false"><img src="${A.voice}" alt=""></button>
  </form>
  <nav class="nav" aria-label="하단 메뉴">${NAV.map(([k, t, href]) => `<a href="${href || '#'}" ${k === 'home' ? 'aria-current="page"' : ''} data-nav="${k}" aria-label="${t}"><img src="${A.nav[k]}" alt=""></a>`).join('')}</nav>
  <div class="toast" role="status"></div>
</main>`;

const $ = s => app.querySelector(s);
const hm = $('.hm'), input = $('[name="q"]'), talk = $('.talk'), hello = $('.hello'), ask = $('[data-ask]'), noti = $('.noti');
let listening = false, toastTimer = 0;

function toast(text) {
  const t = $('.toast');
  t.textContent = text; t.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2200);
}

// 입력 내용이 있으면 마이크 → 보내기 버튼
function syncButton() {
  const has = input.value.trim().length > 0;
  const btn = ask.querySelector('[data-mic],[data-send]');
  if (has && btn.dataset.mic !== undefined && !listening) btn.outerHTML = `<button class="send" data-send aria-label="보내기"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m0 0-7 7m7-7 7 7"/></svg></button>`;
  if (!has && btn.dataset.send !== undefined) btn.outerHTML = `<button type="button" class="mic" data-mic aria-label="음성으로 말하기" aria-pressed="false"><img src="${A.voice}" alt=""></button>`;
}

function setListening(on) {
  listening = on;
  hm.classList.toggle('listen', on);
  const mic = $('[data-mic]');
  mic?.setAttribute('aria-pressed', String(on));
  mic?.setAttribute('aria-label', on ? '말하기 끝내기' : '음성으로 말하기');
  if (on) {
    hello.innerHTML = '<h1>듣고 있어요…</h1><p>편하게 말해 보세요</p>';
    input.value = ''; input.placeholder = '말하는 내용을 받아 적고 있어요';
    let i = 0;
    clearInterval(setListening.timer);
    setListening.timer = setInterval(() => { i += 2; input.value = HEARD.slice(0, i); if (i >= HEARD.length) clearInterval(setListening.timer); }, 90);
  } else {
    clearInterval(setListening.timer);
    hello.innerHTML = `<h1>${NAME}님 안녕하세요!</h1><p>오늘은 어떤 가능성을 만들어 볼까요?</p>`;
    input.placeholder = '오늘 떠오른 생각을 적어보세요';
    syncButton();
    input.focus();
  }
}

function addMsg(cls, html) {
  const el = document.createElement('div');
  el.className = `msg ${cls}`; el.innerHTML = html;
  talk.append(el); talk.scrollTop = talk.scrollHeight;
  return el;
}

function send(text) {
  hm.classList.add('chat');
  addMsg('mine', esc(text));
  input.value = ''; syncButton();
  const wait = addMsg('bot', '<span class="dots" aria-label="답변 작성 중"><i></i><i></i><i></i></span>');
  setTimeout(() => {
    wait.innerHTML = `좋아요! ‘${esc(text.length > 18 ? text.slice(0, 18) + '…' : text)}’에서 이어질 가능성을 찾아볼게요.<br>관련된 기록 3개를 노드로 정리해 두었어요.<br><a class="go" href="../node/">노드로 이어가기 →</a>`;
  }, 1300);
}

app.addEventListener('click', event => {
  const t = event.target.closest('button,a');
  if (!t) { if (!event.target.closest('.noti')) closeNoti(); return; }
  const d = t.dataset;
  if (d.bell !== undefined) { const on = !noti.classList.contains('on'); noti.classList.toggle('on', on); t.setAttribute('aria-expanded', String(on)); return; }
  closeNoti();
  if (d.chip) { input.value = d.chip; syncButton(); input.focus(); return; }
  if (d.mic !== undefined) { event.preventDefault(); return setListening(!listening); }
  if (d.plus !== undefined) return toast('사진·링크를 불러와 기록할 수 있어요');
  if (d.me !== undefined) return toast('My 페이지는 준비 중이에요');
  if (d.nav && t.getAttribute('href') === '#') {
    event.preventDefault();
    if (d.nav === 'home') { hm.classList.remove('chat'); talk.innerHTML = ''; return; }
    return toast('프로토타입에서는 홈 · 노드 탭이 연결돼 있어요');
  }
});
function closeNoti() { noti.classList.remove('on'); $('[data-bell]').setAttribute('aria-expanded', 'false'); }

input.addEventListener('input', syncButton);
ask.addEventListener('submit', event => {
  event.preventDefault();
  if (listening) setListening(false);
  const text = input.value.trim();
  if (!text) return toast('오늘 떠오른 생각을 적어 주세요');
  send(text);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeNoti(); if (listening) setListening(false); }
});
