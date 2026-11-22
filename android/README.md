# NFN Android (Trusted Web Activity)

This directory is reserved for the Bubblewrap-generated Android project. The generated Gradle project and `twa-manifest.json` are not committed yet.

## Fixed app identity

- App name: Naija Football Network
- Package ID: `com.naijafootballnetwork.app`
- Production web origin: `https://naijafootballnetwork.com`
- Web manifest: `https://naijafootballnetwork.com/manifest.webmanifest`

## Local prerequisites

- Node.js 18 or newer
- Java Development Kit (JDK) 17
- Android command-line tools / SDK (Bubblewrap can help install the required Android build tools)

## Initialize the TWA project

Run these commands from the frontend repository root on the isolated branch `chore/android-play-release-prep`:

```bash
npm install --global @bubblewrap/cli
bubblewrap init --manifest=https://naijafootballnetwork.com/manifest.webmanifest --directory=android
```

During initialization, verify the package ID is exactly `com.naijafootballnetwork.app`, the start URL is `/`, and the scope is `/`. Do not accept a different application ID.

Bubblewrap may ask to create a signing key. Keep the keystore and its passwords private. The repository ignores `*.jks` and `*.keystore`; do not force-add them, upload them to GitHub, or paste passwords into chat. Store a secure offline backup of the release/upload key.

## Build and validate (after initialization)

```bash
bubblewrap doctor
bubblewrap validate --url=https://naijafootballnetwork.com
bubblewrap build
```

The build should produce a test APK and an Android App Bundle (AAB). Keep generated artifacts local until reviewed. Never commit signed APK/AAB files.

## Digital Asset Links

Do not create or publish `/.well-known/assetlinks.json` yet. First identify the certificate SHA-256 fingerprint that will sign the app installed by users. If Google Play App Signing is enabled, use the **app-signing certificate** fingerprint from Play Console for the Play-distributed app, not automatically the upload-key fingerprint. We will verify the correct fingerprint before creating the file.

## Production protection

This is Android release preparation only. Do not deploy, merge this branch into `main`, modify Production configuration, or create Production test data as part of these steps. Do not submit to Google Play until the signed candidate and disclosures have been reviewed and explicitly approved.
