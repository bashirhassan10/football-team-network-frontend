// Regression tests for backend routing. No network calls or database writes.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync("lib/backend.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function loadBackend(env) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    process: { env },
    Error,
  });
  return exports.backendUrl;
}

test("Preview without BACKEND_API_URL fails closed instead of reaching production", () => {
  const url = loadBackend({ VERCEL_ENV: "preview" });
  assert.throws(() => url("/api/auth/login"), /BACKEND_API_URL is required/);
});

test("Development without BACKEND_API_URL fails closed", () => {
  const url = loadBackend({ NODE_ENV: "development" });
  assert.throws(() => url("/api/auth/login"), /BACKEND_API_URL is required/);
});

test("Preview uses configured Staging backend for authentication", () => {
  const url = loadBackend({
    VERCEL_ENV: "preview",
    BACKEND_API_URL: "https://football-team-network-staging.onrender.com/",
  });
  assert.equal(
    url("/api/auth/login"),
    "https://football-team-network-staging.onrender.com/api/auth/login",
  );
});

test("Preview does not infer production backend from missing environment setting", () => {
  const url = loadBackend({ VERCEL_ENV: "preview", BACKEND_API_URL: "  " });
  assert.throws(() => url("/api/auth/session"), /BACKEND_API_URL is required/);
});

test("Relative API paths are normalized", () => {
  const url = loadBackend({
    VERCEL_ENV: "preview",
    BACKEND_API_URL: "https://football-team-network-staging.onrender.com",
  });
  assert.equal(
    url("api/teams"),
    "https://football-team-network-staging.onrender.com/api/teams",
  );
});

test("Existing production default is unchanged when explicitly in production", () => {
  const url = loadBackend({ VERCEL_ENV: "production" });
  assert.equal(url("/api/auth/login"), "https://football-team-network.onrender.com/api/auth/login");
});
