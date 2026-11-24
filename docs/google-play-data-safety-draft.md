# NFN Google Play Console — Data Safety draft worksheet

**Status: DRAFT.** This is an engineering audit worksheet, not a completed Google Play Data Safety declaration. Updated: 2026-11-24.

Do not submit these notes directly in Play Console. Reconcile every answer against the final signed Android package, backend behavior, privacy policy, and actual provider integrations.

## App basics

- App: Naija Football Network (NFN)
- Android application ID: `com.naijafootballnetwork.app` (client-confirmed)
- Purpose: football club/academy registration and verification, opponent discovery, match scheduling and team chat.
- Public privacy policy: `https://www.naijafootballnetwork.com/privacy-policy`
- Public account deletion request: `https://www.naijafootballnetwork.com/account-deletion`
- Signed AAB: not confirmed.
- Android SDK permissions and third-party SDK inventory: not yet verified against a generated/signed release package.

## Data categories to audit

- **Personal info:** team contact name, email and phone; authentication credentials (password hashes, not plaintext).
- **Photos/files:** verification documents and team logo uploads.
- **Location:** team pitch address and optional map coordinates; verify whether device location is accessed and whether precise location is collected.
- **Messages:** match request messages and team chat.
- **Financial info:** payment references/status and Paystack payment handoff; confirm whether card details ever enter NFN systems. Do not assume card details are or are not collected without evidence.
- **App activity/device IDs:** inspect hosting logs, analytics, cookies, identifiers and all third-party SDKs included in the final Android package.

## Account deletion and retention

The developer reports that the account deletion flow passed an end-to-end test, including request submission, review/approval and account deletion. Before completing Play Console disclosures, verify and document exactly what is deleted, anonymized or retained, including uploaded objects, shared match/chat records, payment/accounting records, logs, backups and email notifications. Do not claim every record is immediately erased unless this is demonstrably true.

## Questions for every category

1. Is the data collected by the app? Is it shared with external providers? Identify each processor.
2. Is collection mandatory or optional? What is the purpose?
3. Is the data encrypted in transit? Verify HTTPS and any non-HTTPS service paths.
4. Can users request deletion? What remains, why, and for how long?
5. What is retained in logs, backups, emails and object storage?
6. Does the generated Android package add any SDK or permission beyond the website?
7. Does the data flow differ for team owners, coaches, admins, or other roles?

## Known providers to validate

- Vercel — web hosting
- Render — backend hosting
- Neon — database
- Paystack — payments
- Resend — transactional email / notifications

Confirm actual data flows, provider roles and data retention against current service configuration and the final Android app.

## Do not submit yet

- Do not treat this worksheet as the final Data Safety declaration.
- Do not claim no data collection or sharing without inspecting actual requests and Android SDKs.
- Do not claim a completed Android bundle, signed release, verified Digital Asset Links, or Play policy approval.
