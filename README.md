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

The landing page's feature previews are explicitly sample data. Authenticated pages request backend data. The service worker caches static icon assets only; it provides a public offline recovery page, not offline access to private application data. Private API responses and authenticated HTML are not cached.

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

Create a branch from current `staging`, commit and push scoped changes, open a PR, wait for its CI checks to pass, then merge into `staging` when CI passes. Production releases into `main` require separate approval. Update this checklist when functionality changes. Do not add co-authored trailers.

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

## Next five features — staging community safety

- [x] Versioned Community Terms acceptance at registration and before existing accounts create content.
- [x] Report individual opponent messages from match chat.
- [x] Report a team from its profile or match chat.
- [x] Block/unblock teams, with Settings management and backend enforcement.
- [x] Admin moderation queue with message removal, suspension/restoration and action audit.

These implementation checkboxes describe staging source and CI verification, not production release. The broader community-safety Play gate remains open until hosted staging QA, operator review of Terms/retention and moderation operations are confirmed.

Apply backend migration 026 to the isolated staging database before enabling COMMUNITY_SAFETY_ENABLED=true on staging. It defaults off. This chat has no Vercel/Render deployment access; the team must verify staging hosting, environment isolation and migrations. Backend staging history is preserved rather than replaced with master. Frontend staging was created from the current frontend source.

Staging frontend branches explicitly use the staging backend URL even if an old production BACKEND_API_URL remains configured. Individual admin identities remain a separate improvement; moderation audit currently identifies the shared admin credential.

## Next five — staging release preparation

- [x] Default-off checkout initialization that requires explicit staging opt-in and a test key.
- [x] Read-only admin release-readiness dashboard with secret-free configuration/schema diagnostics.
- [x] Source-based Data Safety inventory and JSON draft export, with operator questions.
- [x] Public offline navigation fallback and reconnection guidance without private caching or action replay.
- [x] Current registration/coach-letter verification guidance and removal of obsolete three-document instructions.

See docs/staging-release-readiness.md. These are implementation milestones only. Billing approval, final disclosures, operator-approved deletion activation, migrations/hosting checks, signing and physical-device QA remain open. No main/master or hosting settings are changed by this batch.

## Next five — staging deletion journey

- [x] Fresh password ownership verification, 24-hour expiry and attempt throttling reconciled into backend staging.
- [x] Team-owned request IDs/statuses in Settings without exposing other teams or admin notes.
- [x] Admin dependency preview with community records, ownership freshness and policy blockers.
- [x] Serialized cleanup with failure-stage audit, rollback/retry tests and idempotent completion.
- [x] Password-confirmed owner cancellation before deactivation, with cancelled requests protected in admin UI.

These are staging implementation items, not authorization to erase real accounts. Apply backend migrations 025/027 to the existing deletion schema; 026 is required for community safety. Execution defaults off. Retention approval, explicit review of the community redaction option and hosted storage/device QA remain open.

## Next five — staging account security (25 November 2026)

- [x] Server-tracked sign-ins with random identifiers stored only as SHA-256 digests, 24-hour expiry, coarse browser labels and backend-validated frontend session identity.
- [x] Owner-only active-session list and individual revocation, including remote revocation on normal logout and honest local-only fallback feedback.
- [x] Current-password-confirmed sign-out everywhere with a persistent, separate action-attempt budget.
- [x] Atomic password reset and tracked-session revocation; recovery/email tokens cannot authorize team APIs.
- [x] Current-password-confirmed account/squad JSON download with an explicit data whitelist, private response headers and no opponent/credential/document/moderation data.

Apply migration `028_account_security.sql` to isolated staging first, then set `SESSION_TRACKING_ENABLED=true` on the backend. Default is false; this batch does not apply migrations, enable hosting flags or verify a deployed instance. Enabling tracking forces existing stateless sessions to sign in again. Coordinate backend deployment before frontend deployment because session identity now calls `/api/auth/me`. Frontend branch routing remains pinned to staging.

Tracked tokens continue to check their database record even if the issuance switch is later disabled. Disabling the switch permits legacy stateless tokens again; do not use that as a security rollback after enabling tracking. Legacy tokens issued before tracking cannot be individually revoked. Password reset revokes tracked sessions whenever the table exists. Login/reset issuance serialize on the team row. A sign-in performed after sign-out-everywhere may create a new session; change/reset the password if credentials are compromised.

Session metadata is limited to digest, team, coarse browser label and creation/expiry/revocation times. Labels are approximate, derived from untrusted browser headers, and are not device identity. No raw JWT, IP address or raw User-Agent is stored in these tables. At most 50 sessions remain active; expired/revoked identifiers are pruned at the next login. Failed and successful sensitive actions share a per-team/per-action limit of five per 15-minute window. Team deletion cleans both new security tables; operator approval remains mandatory before deletion can run. Broader metadata/log/backup retention remains open.

New authenticated routes: GET `/api/auth/me`, GET `/api/auth/sessions`, POST `/api/auth/sessions/revoke`, POST `/api/auth/sessions/revoke-all`, POST `/api/auth/logout`, POST `/api/account/export`. IDs and ownership come from the authenticated context; request bodies cannot select another team. The limited export covers contact/account fields and squad only, not a complete rights-request response; private documents, payments, shared fixtures/messages and moderation records require support review. Downloads contain personal information and should be removed from shared devices. Data Safety remains a draft.

Checkmarks denote source implementation plus passing CI, not Play approval. Hosted activation/migration, physical-device QA, signing/Play Console, billing classification, operator retention and final disclosures remain unticked release gates.
