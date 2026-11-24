/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('app/api/admin/account-deletion/prepare-deactivation/route.ts','utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function route(authenticated) {
  const exports = {}, calls = [];
  vm.runInNewContext(compiled, { exports, Number, AbortSignal,
    process: { env: { ADMIN_API_KEY: 'server-only-test-key' } },
    require: name => {
      if(name==='next/server') return { NextResponse: { json: (body, init) => Response.json(body,init) } };
      if(name==='@/lib/admin-session') return { hasAdminSession: async()=>authenticated };
      if(name==='@/lib/backend') return { backendUrl: path=>'https://staging.invalid'+path };
      throw Error(name);
    },
    fetch: async (url, init) => { calls.push({url,init}); return Response.json({message:'Prepared'}); },
  });
  return { post: exports.POST, calls };
}
const request = body => new Request('https://frontend.invalid/api/admin/account-deletion/prepare-deactivation', {
  method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body),
});
test('deactivation rejects unauthenticated or malformed actions without forwarding',async()=>{
  const signedOut=route(false);
  assert.equal((await signedOut.post(request({id:1,confirmation:'DEACTIVATE APPROVED TEAM'}))).status,401);
  assert.equal(signedOut.calls.length,0);
  for(const body of [{id:0},{id:1,confirmation:'ERASE PRIVATE TEAM DATA'},{id:'1',confirmation:'DEACTIVATE APPROVED TEAM'}]) {
    const admin=route(true); assert.equal((await admin.post(request(body))).status,400);assert.equal(admin.calls.length,0);
  }
});
test('explicit deactivation forwards to preparation, never to erasure',async()=>{
  const admin=route(true);
  const response=await admin.post(request({id:1,confirmation:'DEACTIVATE APPROVED TEAM'}));
  assert.equal(response.status,200);
  assert.equal(admin.calls[0].url,'https://staging.invalid/api/admin/account-deletion/prepare-deactivation');
  assert.equal(admin.calls[0].init.headers['X-Admin-Key'],'server-only-test-key');
  assert.equal((await response.json()).message,'Prepared');
});
