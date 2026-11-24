# NFN Android (Trusted Web Activity)

The Android app is being generated as a Trusted Web Activity (TWA) with Bubblewrap. The app identity and Bubblewrap configuration are stored in `twa-manifest.json`; the generated Gradle project is created by the isolated GitHub Actions job.

## Fixed app identity

- App name: Naija Football Network
- Launcher name: NFN
- Package ID: `com.naijafootballnetwork.app`
- Production web origin: `https://naijafootballnetwork.com`
- Web manifest: `https://naijafootballnetwork.com/manifest.webmanifest`
- Android compile/target API requirement: 36 or higher

## Automated unsigned build

The `android-twa` job in `.github/workflows/ci.yml` runs only on pushes to `chore/android-play-release-prep`. It:

1. Sets up JDK 17, Node.js and Android SDK tools.
2. Installs Android platform API 36 and Build Tools 36.0.0.
3. Generates the Gradle project from this directory's `twa-manifest.json`.
4. Verifies the package ID, compile SDK and target SDK.
5. Builds an unsigned Android App Bundle using Bubblewrap's `--skipSigning` option.
6. Uploads the generated project and unsigned AAB as a short-lived GitHub Actions artifact.

This is a build-validation artifact only. It is not suitable for Play Console upload or public distribution.

## Local reproduction (optional)

From the repository root on the isolated preparation branch:

```bash
npm install --global @bubblewrap/cli
cd android
bubblewrap update --skipVersionUpgrade
bubblewrap build --skipSigning
```

Prerequisites: Node.js 18+, JDK 17, Android command-line tools, Android platform API 36 and Build Tools 36.0.0.

## Signing and Digital Asset Links

- The manifest's signing-key path and alias are placeholders; no release keystore is included.
- Do not create, commit, upload or share a production signing keystore or its passwords in GitHub or chat.
- A signed release build requires a separately generated and securely backed-up upload/release key.
- Do not publish `/.well-known/assetlinks.json` until the correct SHA-256 fingerprint is confirmed. If Play App Signing is enabled, the Play app-signing certificate fingerprint must be used for the installed Play-distributed app.

## Remaining release checks

- Review the generated Gradle project and unsigned build output.
- Configure and securely back up the release/upload signing key.
- Generate a signed AAB and verify its certificate.
- Configure and verify Digital Asset Links on the final domain.
- Test the app on physical Android devices, including login, sessions, payment redirects, location, document uploads, chat, support and account deletion.
- Finalize Play Console listing, screenshots, Data Safety disclosures and testing requirements.

## Production protection

This is Android release preparation only. Do not merge this branch into `main`, deploy it, modify Production configuration, or create Production test data as part of these steps. Do not submit to Google Play until the signed candidate and disclosures have been reviewed and explicitly approved.
