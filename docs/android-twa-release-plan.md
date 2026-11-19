# NFN Android packaging — Trusted Web Activity preparation
Date: 2026-11-18. Staging planning; not a signed Android release.

## Existing code verified
- Next.js 15 app uses `app/manifest.ts` with name, start_url, scope, standalone display and PNG 192/512 icons.
- `app/layout.tsx` advertises the web manifest and registers the PWA service worker.
- Production web origin is intended to be https://naijafootballnetwork.com; verify HTTPS, redirects, manifest and icons on the final origin before packaging.

## Build route
1. Confirm the client-approved Android application ID (example only: `com.naijafootballnetwork.app`; not reserved).
2. Generate a Trusted Web Activity Android project with Bubblewrap on a trusted development machine, pointing to the live production manifest, not a staging preview.
3. Generate and securely back up a release signing keystore; never commit the keystore, passwords or Play upload credentials.
4. Configure Digital Asset Links at `https://naijafootballnetwork.com/.well-known/assetlinks.json` using the **actual** SHA-256 fingerprint of the signing certificate and the final package ID. Do not fabricate a fingerprint.
5. Build a signed Android App Bundle (.aab) and install/test an Android build on a real device. Verify that domain verification works and the browser address bar is not shown unexpectedly.
6. Test signup/login, persistent sessions, Paystack payment redirects, map/geolocation permissions, file uploads, match chat, support email, account deletion and back navigation.
7. Complete Play Console listing, Data Safety, account deletion URL, privacy policy, screenshots, target API and testing requirements. Submit only after production account deletion works as declared.

## Known blockers
- No verified package ID, signing certificate, keystore, signed .aab or Play Console access.
- Account deletion execution not yet implemented.
- WebView/TWA suitability and current Google Play policy requirements need confirmation at submission time.

## Safety
Do not commit secrets or pretend a web manifest alone is a Play Store Android app. Keep staging and production credentials separate.
