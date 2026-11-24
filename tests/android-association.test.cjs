/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/android-association.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: exportsObject });
const association = exportsObject.androidAssociation;
test('missing or malformed certificates never create a domain association', () => {
  for (const value of [undefined, '', 'debug', 'AB:CD', 'AA'.repeat(32)]) assert.equal(association(value), null);
});
test('association uses the exact package and deduplicated public SHA256 fingerprints', () => {
  const fingerprint = Array(32).fill('ab').join(':');
  const result = JSON.parse(JSON.stringify(association(`${fingerprint},${fingerprint}`)));
  assert.equal(result[0].target.package_name, 'com.naijafootballnetwork.app');
  assert.deepEqual(result[0].target.sha256_cert_fingerprints, [fingerprint.toUpperCase()]);
  assert.deepEqual(result[0].relation, ['delegate_permission/common.handle_all_urls']);
});
