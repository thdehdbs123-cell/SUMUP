import"./modulepreload-polyfill-B5Qt9EMX.js";import{H as d}from"./assets-CfBGLIoG.js";import{A as p}from"./assets-B1T6jko1.js";const v=new URLSearchParams(location.search),i=(v.get("name")||"").trim().slice(0,20),g=`../home/${i?`?name=${encodeURIComponent(i)}`:""}`,u=a=>String(a).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),e=[{tag:"01 발견",title:"흩어진 흔적을 모아<br>관심사를 찾아줘요",desc:"사진·영상·저장한 글처럼 흩어진 기록에서 요즘 자꾸 끌리는 세계를 발견해요.",art:`<div class="art a1"><span class="orb" style="--o:url('${p.orb}')"></span>
      ${["빈티지","스쿠버 다이빙","필름 사진","여행","공간 큐레이션","중고 장비"].map((a,t)=>`<span class="fl f${t}">${a}</span>`).join("")}</div>`},{tag:"02 프리토킹",title:"떠오르는 대로 말하면<br>AI가 키워드를 잡아요",desc:"대화 속 키워드를 감지해 필요한 정보와 전문가 에이전트를 바로 연결해요.",art:`<div class="art a2"><p class="bub">요즘 <mark>다이빙샵 운영 자금</mark>이<br>제일 고민이야</p>
      <span class="agent"><span class="orb sm" style="--o:url('${p.orb}')"></span>자산 관리 Agent 연결</span>
      <span class="kw">다이빙샵 운영 자금</span></div>`},{tag:"03 노드",title:"가능성을 노드로<br>하나씩 넓혀가요",desc:"에이전트가 시세·판매 채널·아이디어를 찾아 다음 단계를 제안해요.",art:`<div class="art a3"><svg viewBox="0 0 300 200" aria-hidden="true"><path d="M150 52C150 80 80 80 80 108M150 52C150 80 220 80 220 108M80 150c0 18 0 18 0 28" fill="none" stroke="#9c9c9c" stroke-width="1.5"/><path d="M220 150c0 18 0 18 0 28" fill="none" stroke="#8253f4" stroke-width="1.4" stroke-dasharray="4 4"/></svg>
      <span class="nd dark">가능성 카드 01<b>다이빙 리뷰 크리에이터</b></span>
      <span class="nd l">판매 채널<b>중고 장비 마켓</b></span>
      <span class="nd r new">시세 Agent<b>중고 장비 시세</b></span>
      <span class="nd p">Agent 제안<b>다이빙 동호회 3곳</b></span></div>`},{tag:"04 나의 업",title:"쌓인 발견이<br>나만의 업이 돼요",desc:"노드가 레포트와 계획표로 정리되어, 작게 시작할 수 있는 다음 행동을 알려줘요.",art:`<div class="art a4">${[["레포트","리뷰 레포트"],["계획표","업로드 계획"],["예산안","장비 예산"]].map(([a,t],n)=>`<span class="card c${n}"><img src="${p.content[a]}" alt=""><b>${t}</b></span>`).join("")}</div>`}],r=document.getElementById("intro-app");r.innerHTML=`<main class="intro" aria-label="SUMUP 소개">
  <div class="bg" aria-hidden="true">
    <div class="blob blue"><img src="${d.blobBlue}" alt=""></div>
    <div class="blob green"><img src="${d.blobGreen}" alt=""></div>
    <div class="blob light"><img src="${d.blobLight}" alt=""></div>
    <div class="fade"></div>
  </div>
  <header class="bar"><span class="word">SUMUP</span><a class="skip" href="${g}">건너뛰기</a></header>
  <p class="hey">${i?`${u(i)}님, 반가워요!`:"반가워요!"}<br><b>SUMUP은 이런 게 가능해요</b></p>
  <div class="slides" tabindex="0" aria-roledescription="carousel" aria-label="기능 소개">
    ${e.map((a,t)=>`<section class="slide" aria-roledescription="slide" aria-label="${t+1} / ${e.length}">
      ${a.art}<span class="tag">${a.tag}</span><h2>${a.title}</h2><p>${a.desc}</p></section>`).join("")}
  </div>
  <div class="dots" role="tablist" aria-label="소개 페이지">${e.map((a,t)=>`<button role="tab" data-go="${t}" aria-label="${t+1}번째 소개"></button>`).join("")}</div>
  <footer class="cta"><a class="next" href="${g}" data-next>다음</a></footer>
</main>`;const l=r.querySelector(".slides"),b=r.querySelector("[data-next]"),h=[...r.querySelectorAll("[data-go]")];let s=0;function m(){const a=l.clientWidth||1;s=Math.max(0,Math.min(e.length-1,Math.round(l.scrollLeft/a))),h.forEach((n,c)=>n.setAttribute("aria-selected",String(c===s)));const t=s===e.length-1;b.textContent=t?"메인홈 시작하기":"다음",b.classList.toggle("go",t),r.querySelectorAll(".slide").forEach((n,c)=>n.classList.toggle("on",c===s))}const o=a=>l.scrollTo({left:a*l.clientWidth,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});l.addEventListener("scroll",()=>requestAnimationFrame(m),{passive:!0});b.addEventListener("click",a=>{s<e.length-1&&(a.preventDefault(),o(s+1))});h.forEach(a=>a.addEventListener("click",()=>o(Number(a.dataset.go))));l.addEventListener("keydown",a=>{a.key==="ArrowRight"&&(a.preventDefault(),o(Math.min(s+1,e.length-1))),a.key==="ArrowLeft"&&(a.preventDefault(),o(Math.max(s-1,0)))});m();
