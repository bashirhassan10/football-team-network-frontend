# NFN Android packaging — Trusted Web Activity preparation
Updated: 2026-11-22. Staging planning; not a signed Android release.

## App identity
- App name: **Naija Football Network**
- Client-approved Android application ID: `com.naijafootballnetwork.app`
- Treat this application ID as the permanent Play Store identity; do not change it casually after publication.

## Existing web app foundations
- Next.js 15 app uses `app/manifest.ts` with app name, start URL, scope, standalone display and PNG 192/512 icons.
- `app/layout.tsx` advertises the web manifest and registers the PWA service worker.
- Production web origin intended for the Trusted Web Activity: https://naijafootballnetwork.com.
- Before packaging, verify HTTPS, redirects, manifest, icons and service-worker behavior on the final origin.

## Build route
1. Generate a Trusted Web Activity Android project with Bubblewrap on a trusted development machine, pointing to the final production origin/manifest.
2. Generate and securely back up a release signing keystore; never commit the keystore, passwords or Play upload credentials.
3. Configure Digital Asset Links at `https://naijafootballnetwork.com/.well-known/assetlinks.json` using the actual SHA-256 fingerprint of the signing certificate and this exact package ID. Do not fabricate a fingerprint.
4. Build a signed Android App Bundle (.aab) and install/test an Android build on a real device. Verify domain verification works and the browser address bar is not shown unexpectedly.
5. Test signup/login, persistent sessions, Paystack payment redirects, map/geolocation permissions, file uploads, match chat, support email, account deletion and back navigation.
6. Complete Play Console listing, Data Safety, account deletion URL, privacy policy, screenshots, target API and testing requirements. Submit only after the final release behavior and disclosures have been checked.

## Current status / remaining gates
- Package ID is confirmed: `com.naijafootballnetwork.app`.
- The developer reports that the account deletion flow has passed an end-to-end test, including request, review/approval and deletion. Keep evidence of the test and re-check the final release behavior before submission.
- No verified signing certificate, release keystore, signed .aab or Play Console listing has been confirmed in this repository.
- `assetlinks.json` was not found in the frontend repository tree during this preparation review; it must be configured with the real signing fingerprint on the final domain.
- TWA suitability and current Google Play requirements must be checked against the actual Android build at submission time.

## Safety
Do not commit secrets or pretend a web manifest alone is a Play Store Android app. Keep staging and production credentials separate. This preparation branch must not be merged or deployed without explicit approval.
