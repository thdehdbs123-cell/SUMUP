import { TYPES } from './classification.js';
export const REFLECTION_QUESTIONS = [
  {title:'요즘 어떤 분야나 커뮤니티에 끌리나요?', hint:'큰 관심 분야를 들려주세요. 예: 다이빙, 버튜버, 독립출판', placeholder:'예: 요즘 다이빙을 즐기는 사람들의 이야기에 끌려요.', chips:['다이빙 분야','버튜버 커뮤니티','독립출판 분야','인테리어 분야']},
  {title:'그 안에서 유독 눈에 들어오는 것은 뭔가요?', hint:'구체적인 물건·장면·소재를 떠올려보세요. 예: 오래된 장비, 수중 사진의 색감', placeholder:'예: 오래된 다이빙 장비와 수중 사진의 푸른 색감이 좋아요.', chips:['오래된 장비','수중 사진의 색감','캐릭터의 목소리','책 표지의 질감']},
  {title:'어떤 주제에 시간·돈·경험이 많이 쌓였나요?', hint:'직접 해본 일을 짧게 적어주세요. 횟수나 기간도 기억나는 만큼이면 좋아요.', placeholder:'예: 다이빙 40회, 중고 장비 거래, 리뷰·협찬 경험이 있어요.', chips:[]}
];
export const INVESTMENT_KINDS = {time:'시간',money:'돈',experience:'경험'};
export const MIN_REFLECTION_LENGTH = 5;
export const MAX_REFLECTION_LENGTH = 200;
export function validReflection(value){return typeof value==='string' && value.trim().length>=MIN_REFLECTION_LENGTH && value.length<=MAX_REFLECTION_LENGTH;}
export function validateReflections(values) {
  return Array.isArray(values) && values.length===3 && REFLECTION_QUESTIONS.every((_,i)=>typeof values[i]==='string' && values[i].length<=MAX_REFLECTION_LENGTH &&
    (values[i].trim()==='' || validReflection(values[i]))) && values.filter(validReflection).length>=2;
}
export function normalizeInvestment(value){
  if(value===undefined || value===null)return {kind:null,amount:''};
  if(typeof value!=='object'||Array.isArray(value)||
    !(value.kind===null || Object.hasOwn(INVESTMENT_KINDS,value.kind)) ||
    typeof value.amount!=='string'||value.amount.length>80)throw new TypeError('쌓아온 경험의 종류와 양을 확인해주세요.');
  return {kind:value.kind,amount:value.amount.trim()};
}
const string={type:'string'};
const object=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const evidence=object({source:{type:'integer',enum:[0,1,2]},quote:string});
export const REPORT_SCHEMA=object({
  title:string,summary:string,
  keywords:{type:'array',items:string,minItems:3,maxItems:6},
  assets:{type:'array',minItems:0,maxItems:4,items:object({description:string,source:{type:'integer',enum:[0,1,2]},quote:string})},
  directions:{type:'array',minItems:3,maxItems:3,items:object({title:string,reason:string,contribution:string,feasibility:string,
    trait:{type:'string',enum:Object.keys(TYPES)},evidence:{type:'array',minItems:2,maxItems:3,items:evidence}})},
  outlook:object({scene:string,value:string})
});
const text=(value,max=1500)=>typeof value==='string'&&value.trim().length>0&&value.length<=max;
export function evidenceTexts(reflections,investment){
  return reflections.map((answer,source)=>[
    ...(typeof answer==='string'&&answer.trim()?[answer]:[]),
    ...(source===2&&typeof answer==='string'&&answer.trim()&&typeof investment?.amount==='string'&&investment.amount.trim()?[investment.amount.trim()]:[])
  ]);
}
export function evidenceCatalog(reflections,investment){
  return evidenceTexts(reflections,investment).flatMap((values,source)=>{
    const quotes=new Set();
    for(const value of values){
      if(value.trim().length<=60)quotes.add(value.trim());
      for(const part of value.split(/[.!?。！？\n,]+/u)){
        const phrase=part.trim();
        if(phrase&&phrase.length<=60)quotes.add(phrase);
        else for(const chunk of (phrase.match(/.{1,30}/gu)||[]))if(chunk.trim())quotes.add(chunk.trim());
      }
    }
    return [...quotes].map(quote=>({source,quote}));
  });
}
// The provider chooses exact quotes from actual inputs instead of rewriting them.
export function groundedReportSchema(reflections,investment,allowedTraits){
  const schema=structuredClone(REPORT_SCHEMA);
  const catalog=evidenceCatalog(reflections,investment);
  const branches=withDescription=>[0,1,2].flatMap(source=>{
    const quotes=catalog.filter(item=>item.source===source).map(item=>item.quote);
    return quotes.length?[object({...(withDescription?{description:string}:{}),source:{type:'integer',enum:[source]},quote:{type:'string',enum:quotes}})]:[];
  });
  schema.properties.assets.items={anyOf:branches(true)};
  const direction=schema.properties.directions.items.properties;
  direction.evidence.items={anyOf:branches(false)};
  direction.trait.enum=allowedTraits;
  return schema;
}
const validEvidence=(entry,reflections,investment)=>entry&&Number.isInteger(entry.source)&&entry.source>=0&&entry.source<3&&
  text(entry.quote,60)&&evidenceTexts(reflections,investment)[entry.source].some(value=>value.includes(entry.quote));
export function validateReport(report,reflections,allowedTraits=Object.keys(TYPES),investment) {
  if(!report||typeof report!=='object'||!text(report.title,120)||!text(report.summary)||
    !Array.isArray(report.keywords)||report.keywords.length<3||report.keywords.length>6||!report.keywords.every(v=>text(v,80))||
    !Array.isArray(report.assets)||report.assets.length>4||!report.assets.every(asset=>asset&&text(asset.description,500)&&validEvidence(asset,reflections,investment))||
    !Array.isArray(report.directions)||report.directions.length!==3||!report.outlook)return false;
  return report.directions.every(d=>d&&text(d.title,120)&&text(d.reason)&&text(d.contribution)&&text(d.feasibility)&&allowedTraits.includes(d.trait)&&
    Array.isArray(d.evidence)&&d.evidence.length>=2&&d.evidence.length<=3&&d.evidence.every(e=>validEvidence(e,reflections,investment))&&
    new Set(d.evidence.map(e=>e.source)).size===d.evidence.length)&&
    ['scene','value'].every(key=>text(report.outlook[key]));
}
