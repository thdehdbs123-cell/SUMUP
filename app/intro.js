import './intro.css';
import { HOME_ASSETS as H } from '../home/assets.js';
import { ASSETS as N } from '../node/assets.js';

const params = new URLSearchParams(location.search);
const NAME = (params.get('name') || '').trim().slice(0, 20);
// 한글 이름은 성을 빼고 부름 (3자 → 뒤 2자, 4자 → 뒤 2자). 2자 이하·영문 등은 그대로
const givenName = n => /^[가-힣]{3,4}$/.test(n) ? n.slice(-2) : n;
const CALL = givenName(NAME);
const homeHref = `../home/${NAME ? `?name=${encodeURIComponent(NAME)}` : ''}`;
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const SLIDES = [
  {
    tag: '01 발견', title: '흩어진 흔적을 모아<br>관심사를 찾아줘요',
    desc: '사진·영상·저장한 글처럼 흩어진 기록에서 요즘 자꾸 끌리는 세계를 발견해요.',
    art: `<div class="art a1"><span class="orb" style="--o:url('${N.orb}')"></span>
      ${['빈티지', '스쿠버 다이빙', '필름 사진', '여행', '공간 큐레이션', '중고 장비'].map((t, i) => `<span class="fl f${i}">${t}</span>`).join('')}</div>`
  },
  {
    tag: '02 프리토킹', title: '떠오르는 대로 말하면<br>AI가 키워드를 잡아요',
    desc: '대화 속 키워드를 감지해 필요한 정보와 전문가 에이전트를 바로 연결해요.',
    art: `<div class="art a2"><p class="bub">요즘 <mark>다이빙샵 운영 자금</mark>이<br>제일 고민이야</p>
      <span class="agent"><span class="orb sm" style="--o:url('${N.orb}')"></span>자산 관리 Agent 연결</span>
      <span class="kw">다이빙샵 운영 자금</span></div>`
  },
  {
    tag: '03 노드', title: '가능성을 노드로<br>하나씩 넓혀가요',
    desc: '에이전트가 시세·판매 채널·아이디어를 찾아 다음 단계를 제안해요.',
    art: `<div class="art a3"><svg viewBox="0 0 300 200" aria-hidden="true"><path d="M150 52C150 80 80 80 80 108M150 52C150 80 220 80 220 108M80 150c0 18 0 18 0 28" fill="none" stroke="#9c9c9c" stroke-width="1.5"/><path d="M220 150c0 18 0 18 0 28" fill="none" stroke="#8253f4" stroke-width="1.4" stroke-dasharray="4 4"/></svg>
      <span class="nd dark">가능성 카드 01<b>다이빙 리뷰 크리에이터</b></span>
      <span class="nd l">판매 채널<b>중고 장비 마켓</b></span>
      <span class="nd r new">시세 Agent<b>중고 장비 시세</b></span>
      <span class="nd p">Agent 제안<b>다이빙 동호회 3곳</b></span></div>`
  },
  {
    tag: '04 나의 업', title: '쌓인 발견이<br>나만의 업이 돼요',
    desc: '노드가 레포트와 계획표로 정리되어, 작게 시작할 수 있는 다음 행동을 알려줘요.',
    art: `<div class="art a4">${[['레포트', '리뷰 레포트'], ['계획표', '업로드 계획'], ['예산안', '장비 예산']].map(([k, t], i) => `<span class="card c${i}"><img src="${N.content[k]}" alt=""><b>${t}</b></span>`).join('')}</div>`
  }
];

const app = document.getElementById('intro-app');
app.innerHTML = `<main class="intro" aria-label="SUMUP 소개">
  <div class="bg" aria-hidden="true">
    <div class="blob blue"><img src="${H.blobBlue}" alt=""></div>
    <div class="blob green"><img src="${H.blobGreen}" alt=""></div>
    <div class="blob light"><img src="${H.blobLight}" alt=""></div>
    <div class="fade"></div>
  </div>
  <header class="bar"><span class="word">SUMUP</span><a class="skip" href="${homeHref}">건너뛰기</a></header>
  <p class="hey">${CALL ? `${esc(CALL)}님, 반가워요!` : '반가워요!'}<br><b>SUMUP은 이런 게 가능해요</b></p>
  <div class="slides" tabindex="0" aria-roledescription="carousel" aria-label="기능 소개">
    ${SLIDES.map((s, i) => `<section class="slide" aria-roledescription="slide" aria-label="${i + 1} / ${SLIDES.length}">
      ${s.art}<span class="tag">${s.tag}</span><h2>${s.title}</h2><p>${s.desc}</p></section>`).join('')}
  </div>
  <div class="dots" role="tablist" aria-label="소개 페이지">${SLIDES.map((_, i) => `<button role="tab" data-go="${i}" aria-label="${i + 1}번째 소개"></button>`).join('')}</div>
  <footer class="cta"><a class="next" href="${homeHref}" data-next>다음</a></footer>
</main>`;

const slides = app.querySelector('.slides');
const next = app.querySelector('[data-next]');
const dots = [...app.querySelectorAll('[data-go]')];
let index = 0;

function sync() {
  const w = slides.clientWidth || 1;
  index = Math.max(0, Math.min(SLIDES.length - 1, Math.round(slides.scrollLeft / w)));
  dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === index)));
  const last = index === SLIDES.length - 1;
  next.textContent = last ? '메인홈 시작하기' : '다음';
  next.classList.toggle('go', last);
  app.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('on', i === index));
}
const goTo = i => slides.scrollTo({ left: i * slides.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

slides.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
next.addEventListener('click', e => { if (index < SLIDES.length - 1) { e.preventDefault(); goTo(index + 1); } });
dots.forEach(d => d.addEventListener('click', () => goTo(Number(d.dataset.go))));
slides.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(index + 1, SLIDES.length - 1)); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(index - 1, 0)); }
});
sync();
