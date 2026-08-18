import { editRequestSchema } from "@/lib/schemas"; import { editContent } from "@/lib/ai/edit"; import { deepClean } from "@/lib/sanitize";
import { enforceRequestLimit,errorResponse,json,mapError,readBody } from "@/lib/api-helpers";
export const runtime="nodejs"; export const maxDuration=60;
export async function POST(req:Request){const limited=enforceRequestLimit(req);if(limited)return limited;const body=await readBody(req);if(!body.ok)return body.res;const parsed=editRequestSchema.safeParse(deepClean(body.body));if(!parsed.success)return errorResponse("This edit request is not valid.",422);try{return json(await editContent(parsed.data));}catch(e){return mapError(e);}}
