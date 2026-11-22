# NFN Android / Google Play release gate
Updated: 2026-11-22. Preparation checklist only; this is not a Play approval claim.

## Confirmed preparation details
- App name: **Naija Football Network**
- Client-approved Android application ID: `com.naijafootballnetwork.app`
- Public privacy policy: https://naijafootballnetwork.com/privacy-policy
- Public account deletion page: https://naijafootballnetwork.com/account-deletion
- Developer reports the account deletion flow has passed an end-to-end test, including request, review/approval and deletion. Preserve test evidence and verify behavior on the final release build before submission.

## Remaining release gates
1. **Android artifact and signing:** Generate the Android Trusted Web Activity project and verify `targetSdkVersion` is Android 16 (API level 36) or higher (required for new app submissions from August 31, 2026). Establish a secure release-signing process, build a signed Android App Bundle (.aab), and test it on real Android devices.
2. **Digital Asset Links:** Publish `/.well-known/assetlinks.json` on the final domain with the exact package ID and actual SHA-256 fingerprint for the release signing certificate. Verify domain association from the installed build.
3. **Deletion and retention evidence:** Document what is deleted, anonymized or retained after a completed request, including payment/accounting records, shared match history, chat records, logs, backups, emails and uploaded files. Do not promise immediate erasure of records that must be retained or that remain in backups.
4. **Google Play disclosures:** Reconcile the Data Safety form, privacy policy, actual data flows (location, documents, messaging, payments), account deletion instructions, target audience and permissions with the shipped Android app and any added SDKs.
5. **Play Console readiness:** Confirm account access, store listing, support contact, screenshots, app access instructions, target API and testing-track requirements.
6. **Final QA:** Test the signed candidate build, including signup/login, sessions, payment redirects, location permissions, document uploads, match discovery, chat, support and account deletion. Do not use Production test teams or fake payments.

## Security and environment rules
- Never execute destructive database commands as a shortcut.
- Never use an email address alone as proof of account ownership.
- Keep Production data and live payments out of staging tests.
- Do not merge this preparation branch into `main`, deploy it, or change Production configuration until the release candidate has been reviewed and the user explicitly approves.
