// 피그마 SUMUP-2주전 › 프로토타입 › 홈(929:18538) 에셋
const url = name => new URL(`./assets/${name}`, import.meta.url).href;

export const HOME_ASSETS = {
  blobBlue: url('blob-blue.webp'),
  blobGreen: url('blob-green.webp'),
  blobLight: url('blob-light.webp'),
  swoosh: url('swoosh.webp'),
  bell: url('bell.png'),
  badge: url('badge.png'),
  profile: url('profile.png'),
  plus: url('plus.png'),
  voice: url('voice.png'),
  nav: {
    discover: url('nav-discover.png'),
    node: url('nav-node.png'),
    home: url('nav-home.png'),
    talk: url('nav-talk.png'),
    my: url('nav-my.png')
  }
};
