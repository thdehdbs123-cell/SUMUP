import { defineConfig, loadEnv } from 'vite';
import { createReportHandler } from './api/report.js';

export default defineConfig(({mode}) => {
  const env=loadEnv(mode,process.cwd(),'');
  const handler=createReportHandler({environment:()=>({
    OPENAI_API_KEY:process.env.OPENAI_API_KEY || env.OPENAI_API_KEY,
    SUMUP_AI_API_KEY:process.env.SUMUP_AI_API_KEY || env.SUMUP_AI_API_KEY,
    OPENAI_MODEL:process.env.OPENAI_MODEL || env.OPENAI_MODEL
  })});
  const middleware=(req,res,next)=>{
    if(req.url?.split('?')[0]==='/api/report')return handler(req,res);
    next();
  };
  return {plugins:[{name:'sumup-report-api',configureServer(server){server.middlewares.use(middleware)},configurePreviewServer(server){server.middlewares.use(middleware)}}]};
});
