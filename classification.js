// Product hypotheses for self-exploration, not a validated psychological scale.
export const TYPES = {
  explorer: {label:'탐험가', title:'새로운 가능성을 찾아 나서는 탐험가', strength:'낯선 경험에서 가능성을 발견하는 능력', motive:'호기심과 자유', direction:'경험하며 나만의 방향을 넓혀가는 것', description:'익숙한 답에 머무르기보다 직접 경험하며 새로운 가능성을 찾는 편이에요.', activity:'동네 공간을 소개하는 콘텐츠나 소규모 체험 행사의 운영 보조에서, 새로운 매력을 발견하는 시선이 사람들의 관심을 끄는 데 도움이 될 수 있어요.'},
  curator: {label:'취향 수집가', title:'좋아하는 것들로 일상을 채우는 취향 수집가', strength:'미묘한 차이를 발견하고 취향으로 연결하는 능력', motive:'감각과 나다운 선택', direction:'좋아하는 것을 알아가며 나만의 일상을 만드는 것', description:'공간과 물건, 분위기의 작은 차이에서 나에게 맞는 것을 발견하는 편이에요.', activity:'작은 가게의 상품 소개 콘텐츠를 만들거나 진열을 돕는 일에서, 색과 분위기의 차이를 알아보는 감각이 가게의 매력을 전하는 데 도움이 될 수 있어요.'},
  maker: {label:'창작가', title:'생각을 손끝으로 완성하는 창작가', strength:'아이디어를 직접 만들고 구체화하는 능력', motive:'창작과 완성의 즐거움', direction:'나만의 방식으로 눈에 보이는 결과를 만드는 것', description:'머릿속 생각을 실제로 만들어보고, 손으로 다듬어가는 과정에서 즐거움을 찾는 편이에요.', activity:'간단한 소품 제작이나 행사 꾸미기 보조에서, 생각을 손으로 구체화하는 강점이 공간에 필요한 작은 결과물을 만드는 데 도움이 될 수 있어요.'},
  analyst: {label:'탐구가', title:'궁금한 것의 원리를 밝혀가는 탐구가', strength:'관찰한 정보를 연결해 문제를 이해하는 능력', motive:'이해와 발견', direction:'충분히 이해하고 나만의 답을 찾아가는 것', description:'흥미로운 현상을 그냥 지나치기보다 정보를 모으고 원리를 이해하는 데 마음이 끌리는 편이에요.', activity:'자료 조사 보조나 상품 비교 글 작성에서, 정보를 꼼꼼히 살피는 강점이 다른 사람의 선택을 쉽게 만드는 데 도움이 될 수 있어요.'},
  connector: {label:'연결가', title:'사람과 사람 사이의 가능성을 잇는 연결가', strength:'서로 다른 마음을 이해하고 관계를 연결하는 능력', motive:'공감과 함께하는 경험', direction:'함께 나누며 서로에게 힘이 되는 것', description:'이야기를 주고받으며 서로를 이해하고, 함께하는 경험에서 에너지를 얻는 편이에요.', activity:'관심사 모임 진행이나 소규모 행사 운영 보조에서, 사람의 이야기에 귀 기울이는 강점이 처음 온 참여자도 편안하게 어울리는 데 도움이 될 수 있어요.'},
  storyteller: {label:'표현가', title:'나만의 시선과 이야기를 전하는 표현가', strength:'생각과 감정을 나만의 언어로 전달하는 능력', motive:'표현과 반응', direction:'내 이야기를 세상과 나누는 것', description:'느낀 점과 생각을 말이나 글로 풀어내고, 나만의 관점을 전달하는 데 끌리는 편이에요.', activity:'작은 가게의 소개 글 작성이나 소식 콘텐츠 제작에서, 생각을 말과 글로 풀어내는 강점이 낯선 사람에게 가게의 이야기를 친근하게 전하는 데 도움이 될 수 있어요.'},
  planner: {label:'설계가', title:'차근차근 원하는 일상을 만드는 설계가', strength:'복잡한 일을 정리하고 꾸준히 실행하는 능력', motive:'안정과 성취', direction:'지속할 수 있는 계획으로 원하는 삶에 가까워지는 것', description:'해야 할 일을 정리하고 하나씩 완수하며, 예측할 수 있는 기반을 쌓을 때 힘을 얻는 편이에요.', activity:'작은 행사의 일정 관리나 온라인 가게의 주문 정리 보조에서, 일을 차근차근 정리하는 강점이 빠뜨리는 일 없이 운영을 이어가는 데 도움이 될 수 있어요.'},
  grower: {label:'성장가', title:'작은 도전을 실력으로 쌓아가는 성장가', strength:'반복과 도전으로 나의 역량을 키우는 능력', motive:'발전과 숙련', direction:'어제보다 나아지는 경험을 꾸준히 쌓는 것', description:'새로운 것을 배우고 직접 연습하며, 자신의 변화와 실력을 확인할 때 보람을 느끼는 편이에요.', activity:'익숙한 분야의 제작·운영 보조에서, 반복하며 더 나은 방법을 찾는 강점이 결과물의 완성도를 꾸준히 높이는 데 도움이 될 수 있어요.'}
};

// Each answer contributes 3 points to a primary tendency and 1 to a secondary.
// Rows follow Q1–Q7; entries follow the displayed answer order (zero based).
export const ANSWER_MAP = [
  [['explorer','analyst'],['curator','explorer'],['analyst','grower'],['maker','curator'],['connector','storyteller'],['planner','analyst']],
  [['maker','grower'],['storyteller','curator'],['connector','storyteller'],['analyst','planner'],['maker','explorer'],['analyst','planner'],['curator','explorer'],['grower','explorer']],
  [['explorer','maker'],['curator','maker'],['planner','grower'],['explorer','maker'],['explorer','grower'],['connector','storyteller'],['grower','maker'],['curator','storyteller']],
  [['planner','grower'],['explorer','curator'],['explorer','connector'],['analyst','maker'],['connector','storyteller'],['grower','analyst'],['curator','planner']],
  [['curator','maker'],['explorer','maker'],['explorer','grower'],['curator','storyteller'],['planner','grower'],['grower','maker'],['connector','maker'],['connector','grower']],
  [['maker','grower'],['analyst','curator'],['analyst','planner'],['planner','grower'],['curator','maker'],['connector','storyteller'],['storyteller','connector'],['maker','explorer']],
  [['planner','grower'],['explorer','maker'],['explorer','analyst'],['grower','maker'],['analyst','maker'],['connector','storyteller'],['maker','grower'],['explorer','planner']]
];

// Every choice has its own interpretation, even when the leading type is shared.
export const INTERPRETATIONS = [
  ['처음 보는 것을 발견할 때 호기심이 움직여요','내 취향에 맞는 공간과 물건에 마음이 끌려요','흥미로운 지식과 이야기가 탐구의 출발점이에요','직접 만들고 꾸미는 과정에서 즐거움을 찾아요','관심사를 나누며 사람들과 가까워지는 게 좋아요','복잡한 것을 나만의 방식으로 정리할 때 만족해요'],
  ['손으로 직접 만들어 생각을 구체화하는 데 편안함을 느껴요','말과 글로 내 생각을 표현하는 데 편안함을 느껴요','이야기에 귀 기울이고 공감하는 데 편안함을 느껴요','정보를 찾아 의미 있게 정리하는 데 편안함을 느껴요','상상하고 새로운 아이디어를 떠올리는 데 편안함을 느껴요','숫자와 논리로 문제를 풀 때 편안함을 느껴요','분위기와 감각의 차이를 발견하는 데 편안함을 느껴요','몸을 움직이며 직접 경험하는 데 편안함을 느껴요'],
  ['하고 싶은 것을 마음껏 선택할 수 있는 자유를 중요하게 여겨요','좋아하는 것을 일상 가까이에 두는 일을 중요하게 여겨요','경제적으로 넉넉한 기반을 중요하게 여겨요','내 시간과 방식을 스스로 결정하는 일을 중요하게 여겨요','새로운 경험으로 시야를 넓히는 일을 중요하게 여겨요','주변 사람들과 좋은 관계를 이어가는 일을 중요하게 여겨요','나의 재능을 꾸준히 발전시키는 일을 중요하게 여겨요','나만의 개성을 잃지 않는 일을 중요하게 여겨요'],
  ['계획한 일을 하나씩 해내는 하루가 잘 맞아요','계획에 얽매이지 않고 마음 가는 대로 보내는 하루가 잘 맞아요','새로운 장소와 사람을 만나는 다채로운 하루가 잘 맞아요','혼자 좋아하는 일에 깊이 몰입하는 하루가 잘 맞아요','사람들을 만나고 생각을 나누는 하루가 잘 맞아요','배우고 성장하며 발전을 느끼는 하루가 잘 맞아요','충분히 쉬면서 좋아하는 것을 즐기는 하루가 잘 맞아요'],
  ['앞으로도 좋아하는 것에 에너지를 쓰며 살고 싶어요','시간과 장소에 얽매이지 않는 자유로운 삶을 바라요','새로운 경험과 도전이 이어지는 삶을 바라요','내 취향과 개성이 선명하게 드러나는 삶을 바라요','경제적으로 안정되고 여유로운 삶을 바라요','잘하는 것을 꾸준히 발전시키는 삶을 바라요','친밀한 사람들과 함께 무언가를 만드는 삶을 바라요','다른 사람에게 도움이 되는 보람 있는 삶을 바라요'],
  ['손으로 다루고 만드는 감각을 나의 강점으로 보고 있어요','세밀하게 보고 차이를 알아채는 관찰력을 강점으로 보고 있어요','차분하게 생각하고 논리를 세우는 힘을 강점으로 보고 있어요','꼼꼼하게 챙기고 끝까지 책임지는 힘을 강점으로 보고 있어요','나만의 감각과 확실한 취향을 강점으로 보고 있어요','다양한 사람들과 자연스럽게 어울리는 힘을 강점으로 보고 있어요','생각을 말로 전달하는 능력을 강점으로 보고 있어요','다양한 아이디어를 떠올리는 힘을 강점으로 보고 있어요'],
  ['목표와 순서가 명확한 환경에서 힘을 내요','목표는 있되 방법은 자유롭게 정할 때 힘을 내요','새로운 과제나 문제를 만날 때 힘을 내요','반복하며 익숙해지고 완성도를 높일 때 힘을 내요','혼자 조용히 집중할 수 있는 환경에서 힘을 내요','다른 사람과 의견을 주고받을 때 힘을 내요','손으로 만들고 결과를 바로 확인할 때 힘을 내요','여러 일을 유연하게 오가며 진행할 때 힘을 내요']
];

const ids = Object.keys(TYPES);
const weights = ANSWER_MAP.map(row => row.map(([primary, secondary]) =>
  Object.fromEntries(ids.map(id => [id, id === primary ? 3 : id === secondary ? 1 : 0]))
));
// Normalize by each tendency's reachable maximum across the actual questions.
const ceilings = Object.fromEntries(ids.map(id => [id,
  weights.reduce((sum, row) => sum + Math.max(...row.map(option => option[id])), 0)
]));

export function classify(answers) {
  if (!Array.isArray(answers) || answers.length !== ANSWER_MAP.length ||
      !ANSWER_MAP.every((row, q) => Number.isInteger(answers[q]) && answers[q] >= 0 && answers[q] < row.length)) {
    throw new TypeError('7개 질문에 모두 유효한 답변을 선택해주세요.');
  }
  const raw = Object.fromEntries(ids.map(id => [id,
    answers.reduce((sum, option, q) => sum + weights[q][option][id], 0)
  ]));
  const ranked = [...ids].sort((a, b) => {
    const difference = raw[b] * ceilings[a] - raw[a] * ceilings[b];
    if (difference) return difference;
    // Ties: desired life (Q5), values (Q3), then other questions; stable ID order last.
    for (const q of [4, 2, 0, 1, 3, 5, 6]) {
      const delta = weights[q][answers[q]][b] - weights[q][answers[q]][a];
      if (delta) return delta;
    }
    return ids.indexOf(a) - ids.indexOf(b);
  });
  const [primary, secondary] = ranked;
  const evidence = answers.map((option, q) => INTERPRETATIONS[q][option]);
  const scores = Object.fromEntries(ids.map(id => [id, Math.round(raw[id] / ceilings[id] * 100)]));
  return {
    ...TYPES[primary], primary, secondary, secondaryLabel: TYPES[secondary].label,
    combination: `${TYPES[primary].label} × ${TYPES[secondary].label}`,
    secondaryDescription: TYPES[secondary].description,
    balanced: (raw[primary] / ceilings[primary] - raw[secondary] / ceilings[secondary]) <= .08,
    scores, raw, evidence,
    tags: [evidence[0], evidence[1], evidence[3], evidence[6]],
    strengthText: [evidence[1], evidence[5]],
    motiveText: [evidence[2], evidence[4]],
    directionText: [evidence[3], evidence[6]],
    signature: answers.map(option => option + 1).join('-')
  };
}
