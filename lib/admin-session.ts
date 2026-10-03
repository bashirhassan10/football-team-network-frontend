import {createHmac,timingSafeEqual} from "crypto";
import {cookies} from "next/headers";

export const ADMIN_SESSION_COOKIE="ftn_admin_session";
const MAX_AGE=60*60*8;

function key(){return process.env.ADMIN_API_KEY||""}
function signature(expires:string){return createHmac("sha256",key()).update(`ftn-admin:${expires}`).digest("hex")}

export function createAdminSessionValue(){
 const expires=String(Math.floor(Date.now()/1000)+MAX_AGE);
 return `${expires}.${signature(expires)}`;
}

export async function hasAdminSession(){
 const secret=key();if(!secret)return false;
 const value=(await cookies()).get(ADMIN_SESSION_COOKIE)?.value||"";
 const [expires,sig,...rest]=value.split(".");
 if(rest.length||!expires||!sig||!/^[0-9]+$/.test(expires)||Number(expires)<=Math.floor(Date.now()/1000))return false;
 const expected=signature(expires);
 if(sig.length!==expected.length)return false;
 return timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
}

export function adminCookieOptions(){
 return {httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict" as const,path:"/",maxAge:MAX_AGE};
}

export function validAdminKey(candidate:string){
 const secret=key();if(!secret||!candidate||candidate.length!==secret.length)return false;
 return timingSafeEqual(Buffer.from(candidate),Buffer.from(secret));
}
