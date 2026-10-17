import './style.css';
import { classify, TYPES } from './classification.js';
import { reflectionPage, reportView, validateReflections } from './report-ui.js';
import { validateReport } from './report-contract.js';
const questions = [
 ['평소 어떤 순간에 가장 마음이 끌리나요?', ['👀 처음 보는 것·새로운 것을 발견했을 때','💘 내 취향에 맞는 물건이나 공간을 발견했을 때','💡 흥미로운 이야기나 지식을 알았을 때','🎀 무언가를 직접 만들거나 꾸밀 때','💬 사람들과 취향이나 관심사를 공유할 때','💫 복잡한 것을 나만의 방식으로 정리했을 때']],
 ['다음 중 나에게 가장 잘 맞는 것은?', ['🔨 손으로 무언가를 만드는 것','✏️ 말하거나 글로 표현하는 것','🙋 이야기를 나누고 공감하는 것','📚 정보를 찾아보고 정리하는 것','💭 아이디어를 떠올리고 상상하는 것','📐 숫자나 논리를 이용해 문제를 해결하는 것','🤩 분위기나 감각적인 것을 발견하는 것','🏃 몸을 움직이며 직접 하는 것']],
 ['내가 더 중요하게 생각하는 것은?', ['😊 하고싶은 것을 마음껏 하는 것','💗 좋아하는 것을 가까이 두고 사는 것','💰 경제적으로 넉넉한 것','🕒 내가 원하는 시간·원하는 방식으로 행동하는 것','✨ 새로운 경험을 하는 것','🧑‍🤝‍🧑 주변 사람들과 좋은 관계를 유지하는 것','🏅 나의 장기·재능을 발전시키는 것','💎 나만의 개성을 가지고 살아가는 것']],
 ['내가 생각하는 가장 이상적인 하루는\n어떤 모습인가요?', ['⌛ 계획한 일을 차근차근 해낸 하루','🌿 정해진 계획 없이 마음 가는 대로 보낸 하루','🎈 새로운 장소·사람을 만나며 다채롭게 보낸 하루','🔍 혼자 좋아하는 일에 깊이 몰입한 하루','🙋 사람들을 만나고 교류한 하루','📖 배우고 성장하며 어제보다 발전한 하루','🫧 충분히 쉬고 좋아하는 것을 즐긴 하루']],
 ['앞으로 어떤 삶에 가까워지고 싶나요?', ['💗 좋아하는 것에 에너지를 쓰는 삶','🌿 시간·장소에 상관없이 자유로운 삶','✊ 새로운 경험과 도전이 끊이지 않는 삶','💎 나만의 취향과 개성이 뚜렷한 삶','💰 경제적으로 안정되고 여유로운 삶','🏀 잘하는 것을 꾸준히 발전시키는 삶','🧑‍🤝‍🧑 친밀한 사람들과 무언가를 만들어가는 삶','🤝 다른 사람에게 도움이 될 수 있는 보람있는 삶']],
 ['내가 가지고 있는 것 같은 재능은?', ['🎨 손재주가 좋다','🔍 관찰력이 좋다','💬 차분하고 논리적이다','✨ 꼼꼼하고 책임감 있다','🤩 감각이나 취향이 확고하다','🧑‍🤝‍🧑 사람들과 잘 어울린다','🙋 말을 잘한다','🧠 아이디어가 많다']],
 ['어느 환경에서, 무엇을 할 때\n능률이 높아지나요?', ['🎯 정해진 목표와 명확한 순서가 있을 때','🌿 목표는 있지만 방법은 자유로울 때','❓ 매번 새로운 과제나 문제가 주어질 때','🔁 계속 반복하며 익숙해지고 완성도를 높일 때','🤫 혼자 조용히 집중할 수 있을 때','💬 다른 사람과 다양한 의견을 주고 받을 때','🔨 손으로 직접 만들고 그것을 확인할 때','🔀 여러 일을 오가며 유연하게 해나갈 때']]
];
let step = -2, name = '', answers = Array(7).fill(null), detail = false;
const openInsights=new Set();
let reflections=['','',''], report=null, reportStatus='idle', reportError='', reportController=null;
function cancelReport(){reportController?.abort();reportController=null;if(reportStatus==='loading')reportStatus='idle'}
function invalidateReport(){openInsights.clear();cancelReport();report=null;reportError='';reportStatus='idle'}
const app = document.querySelector('#app');
const character = `<svg class="character" viewBox="0 0 300 260" role="img" aria-label="지도를 들고 있는 보라색 탐험가"><defs><radialGradient id="body" cx="30%" cy="20%" r="85%"><stop stop-color="#ede1ff"/><stop offset="1" stop-color="#b794e3"/></radialGradient><linearGradient id="map" x2="1" y2="1"><stop stop-color="#fffef0"/><stop offset="1" stop-color="#e4e6cc"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#a78ac2" flood-opacity=".15"/></filter></defs><g filter="url(#shadow)"><ellipse cx="92" cy="194" rx="28" ry="31" fill="url(#body)"/><ellipse cx="197" cy="194" rx="28" ry="31" fill="url(#body)"/><circle cx="83" cy="62" r="25" fill="url(#body)"/><circle cx="227" cy="83" r="24" fill="url(#body)"/><ellipse cx="153" cy="126" rx="91" ry="82" fill="url(#body)"/><ellipse cx="110" cy="122" rx="7" ry="9" fill="#594442"/><ellipse cx="188" cy="130" rx="7" ry="9" fill="#594442"/><path d="m109 116 1 8m-4-4h8m73 4v9m-4-4h8" stroke="#fff8de" stroke-width="2"/><path d="M137 135 Q149 131 159 139 Q156 158 145 153 Q137 150 137 135" fill="#a35999"/><path d="m87 139-3 7m11-5-3 7m109 0-3 7m11-4-3 7" stroke="#e39bd5" stroke-width="3" stroke-linecap="round"/><path d="m105 167 35 10 35-6 28 13-10 45-28-12-34 7-31-13z" fill="url(#map)" stroke="#fffff1" stroke-width="4"/><path d="m137 181-4 36m42-40-8 35" stroke="#cfcebc" stroke-width="2"/><path d="m118 194 24 8 15-13 20 12" fill="none" stroke="#c6b3e5" stroke-width="4" stroke-dasharray="5 4"/><circle cx="180" cy="190" r="4" fill="#bda4df"/><ellipse cx="96" cy="183" rx="19" ry="23" fill="url(#body)"/><ellipse cx="205" cy="202" rx="18" ry="22" fill="url(#body)"/><ellipse cx="155" cy="234" rx="27" ry="23" fill="url(#body)"/></g><path d="m44 66 16 7-5-20zm21-28 12 17 1-25z" fill="#c7a8ef"/></svg>`;
function render(){
 app.innerHTML = `<main class="phone ${step===8?'result':''}"><header><button class="back" aria-label="이전 화면">‹</button><a class="brand" href="#" aria-label="처음으로">sumup<span>✳</span></a></header>${content()}</main>`;
 app.querySelector('.back').onclick=back;
 app.querySelectorAll('[data-insight]').forEach(card=>card.addEventListener('toggle',()=>{
   if(!card.isConnected)return;
   if(card.open)openInsights.add(card.dataset.insight);else openInsights.delete(card.dataset.insight);
 }));
 app.querySelector('.brand').onclick=e=>{e.preventDefault();cancelReport();step=-2;render()};
 app.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{if(answers[step]!==Number(b.dataset.option))invalidateReport();answers[step]=Number(b.dataset.option);render()});
 app.querySelectorAll('[data-next]').forEach(b=>b.onclick=next);
 app.querySelector('[data-prev]')?.addEventListener('click',back);
 app.querySelector('input')?.addEventListener('input',e=>{name=e.target.value;app.querySelector('[data-next]').disabled=!name.trim()});
 app.querySelector('.clear')?.addEventListener('click',()=>{name='';render();app.querySelector('input').focus()});
 app.querySelector('[data-detail]')?.addEventListener('click',()=>{detail=!detail;render();if(detail)app.querySelector('.details').scrollIntoView({behavior:'smooth',block:'center'})});
 app.querySelector('[data-restart]')?.addEventListener('click',()=>{invalidateReport();step=-2;answers.fill(null);reflections=['','',''];detail=false;render();window.scrollTo(0,0)});
 app.querySelectorAll('[data-reflection]').forEach(field=>field.addEventListener('input',()=>{
   reflections[Number(field.dataset.reflection)]=field.value;
   invalidateReport();
   app.querySelector(`#reflection-count-${field.dataset.reflection}`).textContent=`${field.value.length} / 1500`;
   app.querySelector('#reflection-form button[type="submit"]').disabled=!validateReflections(reflections);
   const status=app.querySelector('.report-status');status.textContent='각 질문에 5자 이상 적어주세요.';status.setAttribute('role','status');
 }));
 app.querySelector('#reflection-form')?.addEventListener('submit',e=>{e.preventDefault();generateReport()});
 app.querySelector('[data-skip-report]')?.addEventListener('click',()=>{cancelReport();step=8;render();window.scrollTo(0,0)});
 app.querySelectorAll('[data-start-report], [data-edit-reflections]').forEach(button=>button.addEventListener('click',()=>{step=7;render();window.scrollTo(0,0)}));
 const hold=app.querySelector('[data-hold]');if(hold){let timer;hold.onpointerdown=()=>{hold.classList.add('holding');timer=setTimeout(()=>{hold.textContent='✓ 나의 발견을 저장했어요';hold.classList.remove('holding');localStorage.setItem('sumup-result',JSON.stringify({name,answers,profile:profile().title,primary:profile().primary,secondary:profile().secondary,signature:profile().signature,version:2}))},900)};['pointerup','pointerleave','pointercancel'].forEach(e=>hold.addEventListener(e,()=>{clearTimeout(timer);hold.classList.remove('holding')}))}
}
function escape(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function profile(){return classify(answers)}
function content(){
 if(step===-2)return `<section class="intro"><div class="eyebrow">DISCOVER YOUR NEXT</div><h1>요즘 당신은 무엇에 끌리고 있나요?</h1><p>테스트를 실제 관심사와 함께 살펴보면<br>새로운 가능성을 찾을 수 있어요</p><div class="cards" aria-hidden="true"><div class="side left">?</div><div class="main-card"><span>?</span><small>A LITTLE MORE YOU</small></div><div class="side right">?</div><i class="spark">✳</i></div><div class="intro-note">7개의 질문으로 발견하는 나다운 가능성<span>약 2분 소요 · 정답은 없어요</span></div></section><footer><button class="primary" data-next>테스트 시작하기 <span>↗</span></button></footer>`;
 if(step===-1)return `<section class="name-page"><span class="eyebrow">LET’S GET TO KNOW YOU</span><h1>먼저 이름을 알려주세요</h1><div class="input-wrap"><input maxlength="20" placeholder="이름" aria-label="이름" value="${escape(name)}" autocomplete="given-name"><button class="clear" aria-label="이름 지우기">×</button></div><p class="privacy">개인정보는 테스트 외 용도로 사용되지 않아요</p><button class="primary" data-next ${!name.trim()?'disabled':''}>다음</button><div class="name-decoration">나를 알아가는<br>작은 시작<span>✳</span></div></section>`;
 if(step===7)return reflectionPage(reflections,reportStatus,reportError);
 if(step>=0&&step<7)return `<section class="quiz"><div class="progress" role="progressbar" aria-valuenow="${step+1}" aria-valuemin="0" aria-valuemax="7"><div style="width:${(step+1)/7*100}%"></div></div><div class="question-number">Q${step+1}</div><h1>${questions[step][0].replace('\n','<br>')}</h1><div class="options">${questions[step][1].map((s,i)=>`<button data-option="${i}" class="option ${answers[step]===i?'selected':''}" aria-pressed="${answers[step]===i}">${s}</button>`).join('')}</div></section><footer class="quiz-footer"><button class="previous" data-prev aria-label="이전 질문">←</button><button class="primary" data-next ${answers[step]===null?'disabled':''}>${step===6?'내 이야기 이어가기':'다음'}</button></footer>`;
 const p=profile();return `<section class="result-top"><p>${escape(name)}님은 이런 사람이에요</p><h1>${p.title}</h1><div class="type-combination">${p.combination}</div>${character}<div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></section>${report?reportView(report):`<section class="report-invite"><span class="eyebrow">YOUR STORY, CONNECTED</span><h2>내 관심사와 경험은 어떻게 연결될까요?</h2><p>세 가지 이야기를 더하면 나만의 AI 리포트를 받을 수 있어요.</p><button class="primary" data-start-report>나의 AI 리포트 만들기 ↗</button></section>`}<section class="insights" aria-label="나의 성향 자세히 보기">${[
   ['strength','강점',p.strength,p.strengthText],
   ['motive','동기',p.motive,p.motiveText],
   ['direction','지향',p.direction,p.directionText]
 ].map(([id,label,title,paragraphs])=>`<details class="insight-card" data-insight="${id}" ${openInsights.has(id)?'open':''}><summary><b>${label}</b><h2>${title}</h2><span class="insight-chevron" aria-hidden="true"></span></summary><div class="insight-body">${paragraphs.map(text=>`<p>${text}</p>`).join('')}</div></details>`).join('')}</section><section class="blend-card"><span>함께 나타난 성향 · ${p.secondaryLabel}</span><p>${p.secondaryDescription}</p><small>${p.balanced?'두 성향의 점수가 비슷해요. 상황에 따라 다른 모습이 나타날 수 있어요.':'대표 성향과 함께 읽으면 나를 더 입체적으로 이해할 수 있어요.'}</small></section>${detail?`<section class="details"><span class="eyebrow">YOUR NEXT STEP</span><h2>강점이 빛날 수 있는 분야</h2><p>${p.activity}</p><p>${p.evidence[6]} 이런 환경이라면 강점을 더 편안하게 펼칠 수 있어요.</p><h3>나의 성향 지도</h3><p class="score-note">답변에서 각 성향의 단서가 나타난 정도예요. 능력이나 확률을 뜻하지 않아요.</p><div class="trait-scores">${Object.entries(TYPES).map(([id,type])=>`<div class="trait-score"><span>${type.label}</span><meter min="0" max="100" value="${p.scores[id]}" aria-label="${type.label} 답변 성향 ${p.scores[id]}"></meter><span>${p.scores[id]}</span></div>`).join('')}</div><h3>나의 선택 돌아보기</h3>${questions.map((q,i)=>`<p><small>Q${i+1}</small> ${q[1][answers[i]]}</p>`).join('')}<button class="restart" data-restart>테스트 다시 하기 ↗</button></section>`:''}<footer class="result-footer"><button class="secondary" data-hold>꾹 눌러 발견하기</button><button class="primary" data-detail>${detail?'접어두기':'자세히 보기'}</button></footer><p class="result-note">이 결과는 답변에 따른 자기 탐색 자료이며, 심리 진단이 아니에요.</p>`;
}
function next(){if(step===-1&&!name.trim())return;if(step>=0&&step<7&&answers[step]===null)return;step=step+1;render();window.scrollTo(0,0)}
function back(){cancelReport();if(step===8)step=7;else if(step>-2)step--;render();window.scrollTo(0,0)}
async function generateReport(){
 if(reportStatus==='loading'||!validateReflections(reflections))return;
 const controller=new AbortController();reportController=controller;reportStatus='loading';reportError='';render();
 try{
   const response=await fetch('/api/report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers:[...answers],reflections:reflections.map(value=>value.trim())}),signal:controller.signal});
   let data;try{data=await response.json()}catch{throw new Error('AI 서버 응답을 읽지 못했어요. 다시 시도해주세요.')}
   if(!response.ok)throw new Error(data.error||'리포트를 만들지 못했어요. 다시 시도해주세요.');
   if(!validateReport(data.report,reflections.map(value=>value.trim())))throw new Error('리포트 형식을 확인하지 못했어요. 다시 시도해주세요.');
   if(reportController!==controller)return;
   report=data.report;reportStatus='success';step=8;render();window.scrollTo(0,0);
 }catch(error){
   if(reportController!==controller||error.name==='AbortError')return;
   reportStatus='error';reportError=error instanceof TypeError?'연결을 확인하고 다시 시도해주세요. 답변은 그대로 남아 있어요.':error.message;render();
 }finally{if(reportController===controller)reportController=null}
}
render();
