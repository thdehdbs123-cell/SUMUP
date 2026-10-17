export const REFLECTION_QUESTIONS = [
  {title:'요즘 자꾸 끌리는 세계가 있나요?', placeholder:'예: 독립서점, 여행, 인테리어, 작은 브랜드… 무엇이 좋은지도 들려주세요.'},
  {title:'이상하게 계속 눈에 들어오는 소재가 있나요?', placeholder:'예: 공간의 색감, 사람들의 관계, 오래된 물건… 반복해서 눈길이 가는 것을 적어주세요.'},
  {title:'최근 몇 년간 시간·돈·경험이 가장 많이 쌓인 주제는 무엇인가요?', placeholder:'일, 공부, 취미 모두 좋아요. 어떤 경험을 얼마나 해왔는지 편하게 적어주세요.'}
];
export const MIN_REFLECTION_LENGTH = 5;
export const MAX_REFLECTION_LENGTH = 1500;
export function validateReflections(values) {
  return Array.isArray(values) && values.length === 3 && REFLECTION_QUESTIONS.every((_, i) =>
    typeof values[i] === 'string' && values[i].trim().length >= MIN_REFLECTION_LENGTH && values[i].length <= MAX_REFLECTION_LENGTH);
}

const string = {type:'string'};
const object = properties => ({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
export const REPORT_SCHEMA = object({
  title:string, summary:string,
  keywords:{type:'array',items:string,minItems:3,maxItems:6},
  assets:{type:'array',items:string,minItems:1,maxItems:4},
  directions:{type:'array',minItems:3,maxItems:3,items:object({title:string,reason:string,firstStep:string,source:{type:'integer',enum:[0,1,2]},quote:string})},
  experiment:object({action:string,timebox:string,reflection:string})
});
const text = (v,max=1500) => typeof v==='string' && v.trim().length>0 && v.length<=max;
export function validateReport(report, reflections) {
  if (!report || typeof report!=='object' || !text(report.title,120) || !text(report.summary) ||
      !Array.isArray(report.keywords) || report.keywords.length<3 || report.keywords.length>6 || !report.keywords.every(v=>text(v,80)) ||
      !Array.isArray(report.assets) || report.assets.length<1 || report.assets.length>4 || !report.assets.every(v=>text(v)) ||
      !Array.isArray(report.directions) || report.directions.length!==3 || !report.experiment) return false;
  return report.directions.every(d=> d && text(d.title,120) && text(d.reason) && text(d.firstStep) &&
    Number.isInteger(d.source) && d.source>=0 && d.source<3 && text(d.quote,180) && reflections[d.source].includes(d.quote)) &&
    ['action','timebox','reflection'].every(key=>text(report.experiment[key]));
}
