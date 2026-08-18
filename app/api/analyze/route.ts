import { analyzeRequestSchema } from "@/lib/schemas"; import { analyzeCareer } from "@/lib/ai/analyze";
import { deepClean } from "@/lib/sanitize"; import { enforceRequestLimit, errorResponse, json, mapError, readBody } from "@/lib/api-helpers";
export const runtime = "nodejs"; export const maxDuration = 60;
export async function POST(req: Request) { const limited=enforceRequestLimit(req); if(limited)return limited; const body=await readBody(req); if(!body.ok)return body.res; const parsed=analyzeRequestSchema.safeParse(deepClean(body.body)); if(!parsed.success)return errorResponse("Please check the information supplied.",422); try{return json({analysis:await analyzeCareer(parsed.data.form)});}catch(e){return mapError(e);} }
