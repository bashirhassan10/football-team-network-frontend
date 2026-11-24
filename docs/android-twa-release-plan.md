# NFN Android packaging — Trusted Web Activity release plan

Updated: 2026-11-24. This is a preparation plan, not a signed Android release or Play Store approval.

## App identity

- App name: **Naija Football Network**
- Launcher name: **NFN**
- Client-approved Android application ID: `com.naijafootballnetwork.app`
- Intended TWA origin: `https://www.naijafootballnetwork.com`
- Web manifest: `https://www.naijafootballnetwork.com/manifest.webmanifest`

Treat the application ID as the permanent Play Store identity. Do not change it casually.

## Existing web foundations

The web application has a PWA manifest, standalone display configuration, 192px / 512px icons, and a service worker. The service worker is intentionally conservative and caches static icon assets rather than authenticated pages, API responses, verification documents, or payment content.

The production manifest and icons were opened and visually checked during preparation. This does not replace full TWA validation or Android device testing.

## Current implementation

- Android preparation is isolated on `chore/android-play-release-prep`.
- `android/README.md` documents prerequisites, local build commands, signing safety, and release checks.
- `.github/workflows/ci.yml` includes an Android job restricted to pushes to the preparation branch.
- The job pins Bubblewrap CLI 1.27.0, uses JDK 17 / Node.js 22 / Android API 36, generates a TWA project from the production web manifest, checks app identity and SDK levels, and attempts an unsigned AAB build.
- The Android job's interactive initialization was corrected to match Bubblewrap's actual prompt order and prompt markers. A successful rerun is still required to verify the correction.
- The checked-in `android/twa-manifest.json` is a reference configuration. Bubblewrap init currently fetches the web manifest and writes the generated manifest in the CI workspace.
- The most recent known run before the prompt correction was cancelled during `bubblewrap init`; it did not reach Gradle generation or bundle build.
- Frontend tests, lint and build passed in that same run.
- No successful Android AAB build, signing certificate, release keystore, signed AAB, verified Digital Asset Links file, or Play Console submission has been confirmed.

## Build route

1. Use Bubblewrap to initialize a TWA project from the production web manifest.
2. Verify the generated manifest values and package ID.
3. Verify the generated Gradle project uses `compileSdk` and `targetSdk` 36 or higher.
4. Build an unsigned AAB for technical validation.
5. Review the generated Android project and test the unsigned build locally where practical.
6. Establish a secure release-signing process and back up the key safely.
7. Build a signed Android App Bundle and verify its signing certificate.
8. Configure Digital Asset Links at `https://www.naijafootballnetwork.com/.well-known/assetlinks.json` using the exact package ID and actual certificate fingerprint.
9. Test domain verification and all critical user flows on physical Android devices.
10. Complete Play Console listing, Data Safety, account deletion, privacy, screenshots, app access and testing requirements.
11. Submit only after the final release candidate and declarations have been reviewed and explicitly approved.

## Google Play policy and data review

The release gate and Data Safety worksheet are separate documents:

- [Google Play release gates](google-play-release-gates.md)
- [Google Play Data Safety draft](google-play-data-safety-draft.md)

The Data Safety worksheet is not a final declaration. Verify actual data collection, sharing, retention, permissions and third-party SDK behavior against the signed candidate.

## Production safety

Keep Android preparation separate from the production branch and services. Do not merge, deploy, modify production configuration, use live Paystack payments for tests, or create fake production teams as part of this work. The user must explicitly approve any release action.
