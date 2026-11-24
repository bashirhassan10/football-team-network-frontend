# Android / Google Play engineer handoff — NFN

Updated: 2026-11-24

This document is the handoff entry point for an engineer or coding agent continuing Android packaging and Google Play preparation for Naija Football Network.

## 1. Goal and boundaries

Package the existing NFN web application as an Android Trusted Web Activity (TWA), validate it, complete signing and Digital Asset Links, test the signed candidate, and prepare the Google Play Console submission.

**Do not treat this as authorization to release.** Work only on the isolated branch:

```text
chore/android-play-release-prep
```

Production must remain unchanged. Do not merge into `main`, deploy the website/backend, change Production environment variables or databases, use live Paystack for test payments, or create test teams in Production. Any release action requires the user's explicit approval.

## 2. Repositories and app identity

Frontend repository: `bashirhassan10/football-team-network-frontend`

| Item | Value |
| --- | --- |
| App name | Naija Football Network |
| Launcher name | NFN |
| Android package ID | `com.naijafootballnetwork.app` |
| Production origin | `https://naijafootballnetwork.com` |
| Web manifest | `https://naijafootballnetwork.com/manifest.webmanifest` |
| Privacy policy | `https://naijafootballnetwork.com/privacy-policy` |
| Account deletion page | `https://naijafootballnetwork.com/account-deletion` |
| Support email | `support@naijafootballnetwork.com` |

The package ID is client-confirmed and should be treated as permanent. Do not change it without an explicit product decision and before Play Console identity is established.

## 3. Read these files first

1. `README.md` — project overview and Android entry points.
2. `android/README.md` — prerequisites, CI behavior, local build, signing and test notes.
3. `docs/android-twa-release-plan.md` — implementation approach and status.
4. `docs/google-play-release-gates.md` — release checklist.
5. `docs/google-play-data-safety-draft.md` — audit worksheet; explicitly not final Play Console content.
6. `.github/workflows/ci.yml` — automated frontend and Android validation jobs.
7. `android/twa-manifest.json` — checked-in reference configuration. Note: current CI `bubblewrap init` fetches the web manifest and generates its own TWA manifest in the build workspace; the checked-in file is not passed as the init input.

## 4. What is already in place

- The production PWA manifest, icons and conservative service worker were checked in a browser during earlier preparation.
- The PWA service worker caches static icon assets only; it does not intentionally cache authenticated HTML, API responses, verification documents or payment content.
- App name, launcher name and package ID are documented and fixed.
- Android preparation is isolated on the branch above.
- Git ignore rules exclude Gradle output, local SDK properties, signing keystores, APKs and AABs.
- Release plan, release gates, Data Safety draft and Android setup documentation are present.
- The Android GitHub Actions job is restricted to pushes on the Android preparation branch.
- The workflow pins Bubblewrap CLI 1.27.0 and uses JDK 17, Node.js 22, Android platform API 36 and Build Tools 36.1.0.
- Frontend quality checks (tests, lint and production build command against the staging backend URL on this branch) passed in the last recorded run.

## 5. Latest CI diagnosis and current status

The last recorded Android workflow run before the latest correction was:

`45392506609`

The frontend `quality` job passed. The Android job was cancelled during `bubblewrap init`, before Gradle project generation, API-level verification, AAB build or artifact upload.

Root cause found in the logs and verified against Bubblewrap CLI 1.27.0 source:

- The previous Expect script matched strings such as `Domain:` in Bubblewrap's explanatory help text instead of the actual Inquirer prompt.
- As a result, answers were sent to the wrong questions. The logs show the package ID being entered into the application-name prompt and the version number into the short-name prompt.
- Bubblewrap's actual prompt sequence was checked against the upstream `init.ts` and `strings.ts` source.

The CI workflow has now been updated to:
- Pin Bubblewrap to `@bubblewrap/cli@1.27.0`.
- Match the leading interactive `?` prompt marker so the explanatory text is not mistaken for a prompt.
- Follow the actual Bubblewrap question order.
- Keep Play Billing and geolocation delegation disabled.
- Decline creation of a signing key in CI.
- Verify the generated TWA manifest identity.
- Verify `compileSdk` and `targetSdk` 36.
- Verify the actual unsigned AAB path: `android/app/build/outputs/bundle/release/app-release.aab`.

**Important:** the corrected workflow has not yet been confirmed by a successful run in this handoff. Check the latest run on the branch before claiming the Android build works.

## 6. Immediate next actions

1. Open the latest GitHub Actions run triggered by the latest branch push.
2. Confirm the Android job passes the Bubblewrap initialization step. Inspect its log to ensure each prompt received the correct answer:
   - Domain: `naijafootballnetwork.com`
   - URL path: `/`
   - Application name: `Naija Football Network`
   - Short name: `NFN`
   - Application ID: `com.naijafootballnetwork.app`
   - Version code: `1` for the initial validation build
   - Display, orientation, theme, background and icon defaults retained from the web manifest
   - Play Billing: No
   - Geolocation delegation: No
   - Create signing key: No
3. Confirm generated `android/twa-manifest.json` contains the expected host, name, launcher name and package ID.
4. Confirm generated Gradle configuration uses compile and target API 36 or higher.
5. Confirm the unsigned bundle exists at `android/app/build/outputs/bundle/release/app-release.aab` and is uploaded as the workflow artifact.
6. Download and inspect the generated project artifact. Confirm no signing key or secret was generated or included.
7. If CI fails, inspect the failed step logs and fix only the preparation branch. Do not weaken identity/API/artifact checks to make the workflow green.

GitHub Actions page:
`https://github.com/bashirhassan10/football-team-network-frontend/actions`

## 7. Local reproduction

Use Node.js 18+, JDK 17, Android command-line tools, platform API 36 and Build Tools 36.1.0.

```bash
git checkout chore/android-play-release-prep
npm install --global @bubblewrap/cli@1.27.0
bubblewrap doctor
cd android
bubblewrap init --manifest=https://naijafootballnetwork.com/manifest.webmanifest
```

Review every prompt and verify the generated `twa-manifest.json`. Then verify the Gradle SDK levels and build an unsigned validation bundle:

```bash
bubblewrap build --skipSigning
```

Expected unsigned bundle:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

The Bubblewrap `init` command uses the live web manifest and writes the generated TWA manifest. The checked-in `android/twa-manifest.json` is reference configuration; do not assume it is the actual generated build input.

## 8. Signing and Digital Asset Links — not completed

- No release keystore has been confirmed in the repository.
- No signed AAB has been confirmed.
- No certificate fingerprint has been verified.
- No `/.well-known/assetlinks.json` has been confirmed in the repository or configured on the domain.
- Do not fabricate a fingerprint or use a debug fingerprint for the production Play build.
- Generate and back up the upload/release key through an agreed secure process. Keep the keystore and passwords outside Git and ordinary chat.
- If Play App Signing is enabled, distinguish the upload certificate from the Play app-signing certificate. Use the correct app-signing fingerprint for the installed Play-distributed app's Digital Asset Links association.

## 9. QA and Play Console work still required

Test the signed candidate on physical Android devices:

- Install, launch, splash screen, app navigation and Android back behavior.
- TWA domain verification and browser UI behavior.
- Signup, login, logout, persistent sessions and password recovery.
- Team registration, verification and document uploads.
- Match discovery, match requests, fixtures and team chat.
- Pitch/map/location behavior and permission prompts.
- Paystack redirect and return behavior. Do not use live transactions as test payments.
- Support contact and account deletion request, review and deletion.
- Network interruption, app resume, external links and error states.

Before Play submission:
- Verify account deletion and retention behavior against the final build.
- Reconcile Data Safety with actual production data flows, service providers, SDKs and Android permissions.
- Complete Play Console app access instructions, store listing, screenshots, support contact, testing-track requirements and policy declarations.
- Review current Google Play target API and policy requirements at submission time.

## 10. Explicit non-goals for this handoff

The next engineer must not:
- Merge this branch into `main`.
- Deploy to Vercel or Render.
- Change Production database, environment variables, Paystack or user data.
- Create fake Production teams or accounts.
- Submit the unsigned AAB to Google Play.
- Publish `assetlinks.json` with an unverified fingerprint.
- Generate or commit a release keystore in GitHub Actions.
- Mark Data Safety complete based only on the draft worksheet.

## 11. Definition of handoff completion

The repository is ready for another engineer to continue when they can use this document and the linked Android guide to identify the branch, understand the current verified state, reproduce the unsigned build, find the remaining signing / Digital Asset Links / QA / Play Console gates, and avoid Production changes.

The documentation handoff is complete; the Android build itself remains pending successful CI validation and the release gates above.
