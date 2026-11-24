# NFN Android / Google Play release gates

Updated: 2026-11-24. Checklist only; this document is not a Play approval claim.

## Confirmed preparation details

- App name: **Naija Football Network**
- Launcher name: **NFN**
- Client-approved Android application ID: `com.naijafootballnetwork.app`
- Web origin: `https://www.naijafootballnetwork.com`
- Public privacy policy: `https://www.naijafootballnetwork.com/privacy-policy`
- Public account deletion page: `https://www.naijafootballnetwork.com/account-deletion`
- The developer reports that the account deletion workflow passed an end-to-end test, including request, review/approval and deletion. Preserve test evidence and retest the final signed Android candidate.

## Current Android build status

- Android work is isolated on `chore/android-play-release-prep`.
- The Android GitHub Actions job is configured to generate a TWA project and unsigned AAB using Bubblewrap.
- The last recorded attempt was cancelled during Bubblewrap's interactive initialization. The corrected prompt automation has not yet been proven by a successful rerun.
- A successful generated project, unsigned AAB, signed AAB, release keystore, verified Digital Asset Links association, or Play Console submission is **not confirmed**.

## Required release gates

1. **Generated project and build:** Complete a successful CI run. Inspect the generated TWA manifest, Gradle project, package ID, versioning and API levels. Confirm `compileSdk` and `targetSdk` are 36 or higher.
2. **Signing:** Establish an approved secure signing process. Back up the upload/release key safely. Build a signed AAB and verify the certificate. Never commit the keystore or passwords.
3. **Digital Asset Links:** Publish `/.well-known/assetlinks.json` on the final domain with the exact package ID and the actual SHA-256 fingerprint for the certificate appropriate to the distribution setup. Verify domain association from an installed build.
4. **Device QA:** Test the signed candidate on physical devices: install/upgrade, launch, navigation/back, login/session, password recovery, team registration, document uploads, match requests, fixtures, chat, location, payment redirects, support and account deletion.
5. **Deletion and retention evidence:** Document what is deleted, anonymized or retained after a completed request, including payment/accounting records, shared match history, chat records, logs, backups, emails and uploaded files. Do not promise immediate erasure of records that must be retained or remain in backups.
6. **Google Play disclosures:** Reconcile Data Safety, privacy policy, actual data flows (location, documents, messaging, payments), account deletion instructions, target audience, permissions and SDKs with the final Android binary.
7. **Play Console readiness:** Confirm developer account access, store listing, support contact, screenshots, app access instructions, target API and testing-track requirements.

## Security and environment rules

- Never execute destructive database commands as a shortcut.
- Never use an email address alone as proof of account ownership.
- Keep Production data and live payments out of staging tests.
- Do not merge the preparation branch into `main`, deploy it, or change Production configuration until the signed candidate and disclosures have been reviewed and the user explicitly approves.
