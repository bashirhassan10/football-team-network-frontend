# NFN Google Play Console — draft disclosure worksheet
Status: DRAFT, not a completed Data Safety declaration. Verify actual production behavior and the final Android binary before submission.
Updated: 2026-11-22.

## App basics
- App: Naija Football Network (NFN)
- Android application ID: `com.naijafootballnetwork.app` (client-confirmed)
- Purpose: football club/academy registration and verification, opponent discovery, match scheduling and team chat.
- Public privacy policy: https://naijafootballnetwork.com/privacy-policy
- Public account deletion request: https://naijafootballnetwork.com/account-deletion
- Signed AAB: not yet confirmed/built.

## Data categories to audit
- **Personal info:** team contact name, email and phone; account authentication credentials (password hashes, not plaintext).
- **Photos/files:** verification documents and team logo uploads.
- **Location:** team pitch address and optional map coordinates; verify whether device location is accessed and whether precise location is collected.
- **Messages:** match request messages and team chat.
- **Financial info:** payment references/status and Paystack payment handoff; confirm whether card details ever enter NFN systems (do not assume).
- **App activity/device IDs:** verify hosting logs, analytics, cookies, identifiers and any third-party SDKs in the final Android package.

## Account deletion status
The developer reports that the account deletion flow has passed an end-to-end test, including request submission, review/approval and account deletion. Before completing Play Console disclosures, verify and document the exact data deleted, anonymized or retained, including uploaded objects, shared match/chat records, payment/accounting records, logs, backups and email notifications. Do not claim every record is immediately erased unless that is demonstrably true.

## For EACH category confirm before entering Play Console
1. Collected by the app? Shared with external providers? Name each processor.
2. Mandatory or optional? Purpose (app functionality, security, payments, support).
3. Encrypted in transit? Confirm HTTPS across app and services.
4. Can users request deletion? What remains, why, and for how long?
5. What is actually retained in logs, backups, emails and object storage?
6. Does the Android package add any SDK or permission beyond the website?

## Known processors to validate
Vercel (web hosting), Render (backend), Neon (database), Paystack (payments), Resend (notifications). Confirm their actual data flows and roles against the shipped app and current service configuration.

## Do not submit yet
- Do not submit this worksheet as the final Data Safety declaration; it is a draft.
- Do not claim no data collection or sharing without inspecting actual requests and Android SDKs.
- Do not claim a completed Android bundle, signed release, verified Digital Asset Links or Play policy approval.
