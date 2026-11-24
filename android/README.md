> Current implementation update (24 November 2026): PR CI [45414505882](https://github.com/bashirhassan10/football-team-network-frontend/actions/runs/45414505882) passed TWA generation, canonical www identity, minimum SDK 24 / target SDK 36 checks and direct Gradle bundleRelease. Unsigned artifact nfn-android-twa-unsigned-224 was uploaded. Older diagnosis below is historical. Play Console is not created; release signing and certificate association remain incomplete.

# NFN Android — Trusted Web Activity

This directory contains the Android / Google Play preparation for **Naija Football Network (NFN)**. The intended packaging approach is a Trusted Web Activity (TWA) generated with Bubblewrap.

> **Current status:** preparation only. The latest recorded Android CI attempt was cancelled during interactive project initialization. The frontend quality job passed, but a successful Android project generation or AAB build has not yet been verified. Do not describe this as a working or Play-ready Android release.

## Confirmed app identity

| Setting | Value |
| --- | --- |
| App name | Naija Football Network |
| Launcher name | NFN |
| Package ID | `com.naijafootballnetwork.app` |
| Production web origin | `https://www.naijafootballnetwork.com` |
| Web manifest | `https://www.naijafootballnetwork.com/manifest.webmanifest` |
| Android API target | API 36 or higher |

The package ID is the intended permanent Play Store identity. Do not change it casually, especially after an app is created in Play Console.

## How the automated build works

The `android-twa` job in `.github/workflows/ci.yml` runs only for a **push** to `chore/android-play-release-prep`. It does not run for `main` or ordinary pull requests.

The job:

1. Checks out the Android preparation branch.
2. Installs JDK 17, Node.js 22, Android platform API 36, and Build Tools 36.1.0.
3. Installs the pinned Bubblewrap CLI version 1.27.0.
4. Runs `bubblewrap init` against the production web manifest URL.
5. Answers Bubblewrap's interactive questions, preserving the manifest defaults where appropriate and explicitly setting the package ID.
6. Sets and verifies `compileSdk` and `targetSdk` as 36.
7. Runs `bubblewrap build --skipSigning`.
8. Verifies the unsigned bundle at `app/build/outputs/bundle/release/app-release.aab`.
9. Uploads the generated project and unsigned AAB as a GitHub Actions artifact retained for 14 days.

The CI job generates its actual `twa-manifest.json` from the live web manifest. The checked-in `android/twa-manifest.json` is a configuration reference, not the file consumed as the input to `bubblewrap init`. Review the generated manifest in the artifact after each successful build.

## Local build reproduction

Use a clean checkout of `chore/android-play-release-prep`. Install:

- Node.js 18 or newer (CI uses Node.js 22)
- JDK 17
- Android command-line tools
- Android platform API 36
- Android Build Tools 36.1.0
- Bubblewrap CLI 1.27.0

Then run:

```bash
npm install --global @bubblewrap/cli@1.27.0
bubblewrap doctor
cd android
bubblewrap init --manifest=https://www.naijafootballnetwork.com/manifest.webmanifest
```

During `bubblewrap init`, confirm these values:

- Domain: `www.naijafootballnetwork.com`
- URL path: `/`
- Application name: `Naija Football Network`
- Short name: `NFN`
- Application ID: `com.naijafootballnetwork.app`
- Starting version code: `1` for the initial test build
- Keep the PWA manifest's display, orientation, colors, and icon defaults unless a reviewed design decision requires a change.
- Play Billing: No (NFN uses Paystack; do not add Play Billing without a separate policy/product review).
- Geolocation delegation: No unless the Android permission and location flow have been deliberately designed and tested.
- Do not create a signing key during this unsigned validation step.

After initialization, inspect `twa-manifest.json` and the generated Gradle project. Set `compileSdk` and `targetSdk` to at least 36, then build:

```bash
bubblewrap build --skipSigning
```

Expected unsigned AAB path:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

Bubblewrap may also produce an unsigned APK for local testing. Neither unsigned artifact is suitable for Play Console upload.

## Signing and Digital Asset Links

- No release keystore is included in this repository.
- Do not generate or commit a production signing key in CI.
- Generate the upload/release key through an agreed secure process, back it up securely, and store credentials in an approved secret manager.
- Verify the certificate fingerprint from the actual signing certificate.
- Configure `https://www.naijafootballnetwork.com/.well-known/assetlinks.json` with the exact package ID and correct SHA-256 certificate fingerprint.
- If Play App Signing is enabled, use the Play app-signing certificate fingerprint for the installed Play-distributed app's Digital Asset Links association. Do not guess or reuse a debug fingerprint.

## Required pre-submission testing

Test the signed candidate on physical Android devices, including:

- Installation, first launch, splash screen, app navigation and back behavior.
- Domain verification and absence of unexpected browser UI.
- Signup, login, logout, session persistence and password recovery.
- Team registration and verification-document uploads.
- Match discovery, match requests, fixtures and chat.
- Location permission and pitch/map behavior.
- Paystack handoff and return flow without using live payments as test transactions.
- Support contact and account deletion request/review/deletion.
- Network loss, app resume, external links and error states.

## Production safety

Android preparation must not change or deploy the production website, backend, database, environment variables, Paystack configuration, or production data. Do not merge this branch into `main`, publish a signed release, or submit to Google Play without explicit approval after the release gates have been reviewed.

For the complete status and handoff, see [the Android engineer handoff](../docs/android-engineer-handoff.md).
