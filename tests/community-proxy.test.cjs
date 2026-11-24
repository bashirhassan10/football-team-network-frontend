/* eslint-disable @typescript-eslint/no-require-imports */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const compiled=ts.transpileModule(fs.readFileSync('lib/community-proxy.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function load({team=true,admin=false,status=200,backendBody="Access denied"}={}){
 const exports={},calls=[];
 vm.runInNewContext(compiled,{exports,AbortSignal,process:{env:{ADMIN_API_KEY:'server-test-key'}},require:name=>{
  if(name==='next/server')return {NextResponse:{json:(data,init)=>Response.json(data,init)}};
  if(name==='@/lib/backend')return {backendUrl:path=>'https://staging.invalid'+path};
  if(name==='@/lib/session')return {sessionToken:async()=>team?'team-test-token':null};
  if(name==='@/lib/admin-session')return {hasAdminSession:async()=>admin};throw Error(name);
 },fetch:async(url,init)=>{calls.push({url,init});return status===200?Response.json({saved:true}):new Response(backendBody,{status})}});
 return {proxy:exports.communityProxy,calls};
}
test('team and admin safety routes require the appropriate session',async()=>{
 const a=load({team:false});assert.equal((await a.proxy('/api/community/reports','POST',new Request('https://test.invalid'))).status,401);assert.equal(a.calls.length,0);
 const b=load({team:true,admin:false});assert.equal((await b.proxy('/api/admin/community/reports','GET',undefined,true)).status,401);assert.equal(b.calls.length,0);
});
test('unblocking preserves DELETE body and team authorization',async()=>{
 const a=load();const body=JSON.stringify({team_id:2});const req=new Request('https://test.invalid',{method:'DELETE',body});
 assert.equal((await a.proxy('/api/community/blocks','DELETE',req)).status,200);
 assert.equal(a.calls[0].init.method,'DELETE');assert.equal(a.calls[0].init.body,body);assert.equal(a.calls[0].init.headers.Authorization,'Bearer team-test-token');assert.equal(a.calls[0].init.headers['X-Admin-Key'],undefined);
});
test('moderator credential stays server-side and backend denial is preserved',async()=>{
 const a=load({admin:true,status:403});const response=await a.proxy('/api/admin/community/action','POST',new Request('https://test.invalid',{method:'POST',body:'{}'}),true);
 assert.equal(response.status,403);assert.equal(response.headers.get("Cache-Control"),"no-store");assert.equal(a.calls[0].init.headers['X-Admin-Key'],'server-test-key');assert.equal(a.calls[0].init.headers.Authorization,undefined);assert.ok(!(await response.text()).includes('server-test-key'));
});

test('password-confirmed cancellation forwards only to backend and normalizes a private JSON denial',async()=>{
 const a=load({status:403,backendBody:JSON.stringify({error:"Account reauthentication failed"})});
 const body=JSON.stringify({request_id:4,password:"synthetic-password"});
 const response=await a.proxy('/api/account-deletion/cancel','POST',new Request('https://test.invalid',{method:'POST',body}));
 assert.equal(a.calls[0].init.body,body);assert.equal(a.calls[0].url,'https://staging.invalid/api/account-deletion/cancel');
 const output=await response.text();assert.ok(!output.includes('synthetic-password'));assert.equal(JSON.parse(output).error,'Account reauthentication failed');assert.equal(response.headers.get('Cache-Control'),'no-store');
});
