# Naija Football Network — Frontend

Next.js web application for Nigerian football clubs, academies and Old Timers to register, verify their teams, discover opponents, arrange matches and manage their clubs.

Updated: 24 November 2026. This README describes code on `main`; implemented does not mean every flow has been verified against Production.

## Project links

- Website: https://naijafootballnetwork.com (observed redirect to https://www.naijafootballnetwork.com/)
- Backend repository: https://github.com/bashirhassan10/football-team-network
- Default branch: `main`
- Android preparation branch: [chore/android-play-release-prep](https://github.com/bashirhassan10/football-team-network-frontend/tree/chore/android-play-release-prep)

## Implemented in the web application

- [x] Landing page, mobile navigation, registration, login, logout and password recovery.
- [x] HTTP-only team session cookie, server-side API proxies and stale-tab identity guard.
- [x] Clubs, academies and Old Timers registration; men's/women's divisions and age categories.
- [x] State/LGA selection, privacy consent and authenticated team discovery.
- [x] Team dashboard, directory filters, individual profiles and team logos.
- [x] Verification document uploads, status/history, review submission and Paystack checkout/status/verification.
- [x] Admin login, document viewing/review, team classification and final approval/rejection.
- [x] Match requests and actions, accepted fixtures, calendar and pitch/map links.
- [x] Match chat, unread tracking, result submissions and completed-match history.
- [x] Squad management, profile/settings editing and statistics calculated from confirmed scores.
- [x] Email-change request UI and support contact form.
- [x] Privacy policy, public deletion request form, session ownership confirmation and admin deletion review/execution UI.
- [x] PWA manifest, 192/512 PNG icons and service-worker registration.
- [x] Automated backend-routing tests, ESLint and Next.js build in CI.

The landing page's feature previews are explicitly sample data. Authenticated pages request backend data. The service worker caches static icon assets only; it does not provide an offline application or intentionally cache private API responses.

## Architecture and technology

Next.js 15.5.21, React 19, TypeScript, Lucide icons and Leaflet.

| Location | Responsibility |
| --- | --- |
| `app/` | Public, team and admin pages; manifest and icon routes |
| `app/api/` | Same-origin server handlers forwarding authenticated requests to Go; contact email |
| `lib/backend.ts` | Backend URL selection and preview isolation |
| `lib/session.ts`, `lib/admin-session.ts` | Team cookie access and admin sessions |
| `components/` | Branding, crests and identification components |
| `public/sw.js` | Conservative static-asset service worker |
| `tests/` | Backend-routing regression tests |
| `docs/` | Deletion design and Android/Play release planning |

The Go backend owns database access, verification storage, payments and match rules. Backend secrets must remain server-side.

## Local development

Use Node.js 22 to match CI.

```sh
npm install
# Set BACKEND_API_URL to a local or staging Go API in .env.local.
npm run dev
```

`.env.example` currently contains the production backend URL. Replace it for development; do not use live accounts or payments for tests.

| Server variable | Purpose |
| --- | --- |
| `BACKEND_API_URL` | Required in development/preview; use a local or staging backend |
| `ADMIN_API_KEY` | Admin session signing and backend admin credential; must match the selected backend |
| `RESEND_API_KEY` | Contact and deletion-request support email |
| `CONTACT_FROM_EMAIL` | Verified sender address |
| `SUPPORT_EMAIL` | Support notification recipient |
| `TEAM_LOGO_STAGING_BACKEND_URL` | Specific legacy team-logo preview override; see `lib/backend.ts` |

Only Vercel Production may fall back to the legacy production API URL. Selected named preview branches have explicit staging overrides. Never expose secret variables with a `NEXT_PUBLIC_` prefix.

## Validation and contribution workflow

```sh
npm run test
npm run lint
npm run build
```

Set a staging `BACKEND_API_URL` for local validation. The repository currently has no committed package lock; CI uses `npm install`. Tests cover backend URL routing, not the complete user journey.

Create a branch from current `main`, commit and push scoped changes, open a PR, wait for its CI checks to pass, then merge when authorized. Update this checklist when functionality changes. Do not add co-authored trailers.

## Android / Google Play status

The existing approach is a Trusted Web Activity (TWA), using Bubblewrap to package the hosted web application. PWA installation alone is not a Play Store release.

| Item | Status at review |
| --- | --- |
| App / launcher | Naija Football Network / NFN |
| Package ID | `com.naijafootballnetwork.app`, recorded as client-confirmed in the Android handoff |
| Preparation | Separate `chore/android-play-release-prep` branch |
| Toolchain | Branch workflow pins Bubblewrap 1.27.0, Java 17, Node 22 and Android API 36 |
| Latest inspected run | [45414505882](https://github.com/bashirhassan10/football-team-network-frontend/actions/runs/45414505882) |
| Web quality checks | Passed in that run |
| TWA generation and identity/API checks | Passed in that run |
| Unsigned AAB build | Passed; unsigned validation artifact uploaded |
| Signed AAB, signing certificate, Digital Asset Links | Not verified as completed |
| Physical-device QA and Play submission | Outstanding |

The Android workflow also validates pull requests. Minimum SDK is 24 to match Android Browser Helper; compile/target SDK remain 36. The generated project is built directly with Gradle to preserve verified SDK settings.

Current Android instructions live on that branch:
- [Engineer handoff](https://github.com/bashirhassan10/football-team-network-frontend/blob/chore/android-play-release-prep/docs/android-engineer-handoff.md)
- [Build guide](https://github.com/bashirhassan10/football-team-network-frontend/blob/chore/android-play-release-prep/android/README.md)

The older documents on `main` remain useful background but contain stale claims, including that deletion execution does not exist and the package ID is unchosen.

## Remaining work before release

- [x] Diagnose and fix the unsigned Android bundle build (PR CI 45414505882 produced an unsigned AAB).
- [x] Reconcile non-www Android configuration with the observed www production redirect.
- [ ] Complete secure signing, correct app-signing certificate association and Digital Asset Links.
- [x] Finish deletion integration: admin impact inspection, explicit preparation proxy/UI, then execution; authenticated proxy and backend lifecycle tests pass.
- [ ] Add fresh independent ownership authentication, review retention rules and test deletion/storage cleanup/retry behavior with disposable staging data.
- [ ] Add appropriate user/content reporting, blocking, Terms acceptance and admin moderation for team chat.
- [ ] Assess verification payments against Google Play Billing requirements before shipping Paystack in the Android app.
- [ ] Reconcile Data Safety, privacy/retention disclosures, audience, permissions and reviewer access with actual behavior.
- [ ] Test login persistence, uploads, payments/returns, matches, maps, chat, deletion, back navigation, external links and network interruption on Android.
- [ ] Complete Play listing, screenshots, required testing tracks and final submission checks.
- [ ] Reconcile older release documents and verification error messages with the current registration/coach-letter policy.
- [ ] Confirm deployed frontend/backend versions, schema migrations, support delivery and end-to-end production readiness.

Do not mark any gate complete based only on source inspection or an older handoff. README updates do not execute deletions, apply migrations, change secrets or authorize a Play release.

## First five release items — implementation batch

- [x] Unsigned AAB build fix: minimum SDK 24 and direct Gradle bundleRelease passed Android CI 45414505882; artifact nfn-android-twa-unsigned-224 uploaded.
- [x] Android configuration uses the observed canonical www host, including manifest/icon URLs and generated identity checks. Installed-app domain verification remains part of signing/device QA.
- [ ] Signing and Play certificate association: Play Console app is not created yet. The assetlinks route validates public certificate fingerprints from ANDROID_APP_SIGNING_SHA256 and returns 404 while unconfigured. No private signing material is generated or committed.
- [x] Deletion integration: admin inspection exposes preparation state; explicit deactivation precedes erasure. Frontend proxy tests and backend disposable-database lifecycle CI pass.
- [ ] Ownership/retention/cleanup: current password is required; approval and deactivation require verification within 24 hours. Operator retention decision and production-like storage/concurrency QA remain outstanding.

Deployment order: apply backend migration 025 before the new backend handlers, then deploy the matching frontend. DELETION_RETENTION_POLICY_APPROVED defaults off and must remain off until the operator approves retention. Do not test against real accounts. No production migration or environment change is performed by this source change.

To configure Digital Asset Links after Play App Signing enrollment, set ANDROID_APP_SIGNING_SHA256 to the Play app-signing certificate SHA-256 (colon-separated bytes; comma-separated certificates for a verified rotation). Do not use the upload-key fingerprint for Play-installed builds. Verify the canonical /.well-known/assetlinks.json response and installed app before marking signing complete.
