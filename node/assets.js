// 피그마 SUMUP-2주전 › 프로토타입 › 확장 노드 화면에서 가져온 에셋
const url = name => new URL(`./assets/${name}`, import.meta.url).href;

export const ASSETS = {
  orb: url('ai-orb.png'),
  orbInput: url('ai-orb-input.png'),
  icAi: url('ic-ai.png'),
  content: {
    데이터: url('c-data.png'),
    레포트: url('c-report.png'),
    이미지: url('c-image.png'),
    아이디어: url('c-idea.png'),
    계획표: url('c-plan.png'),
    예산안: url('c-budget.png')
  },
  nav: {
    discover: url('nav-discover.png'),
    node: url('nav-node.png'),
    home: url('nav-home.png'),
    talk: url('nav-talk.png'),
    my: url('nav-my.png')
  }
};
