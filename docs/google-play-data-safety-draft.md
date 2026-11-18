# NFN Google Play Console — draft disclosure worksheet
Status: DRAFT, not a completed Data Safety declaration. Verify actual production behavior and Android binary before submission.

## App basics
App: Naija Football Network (NFN)
Purpose: football club/academy registration and verification, opponent discovery, match scheduling, team chat.
Public privacy policy: https://naijafootballnetwork.com/privacy-policy (verify live)
Public account deletion request: https://naijafootballnetwork.com/account-deletion (verify live)
Android package ID: NOT YET CHOSEN
Signed AAB: NOT YET BUILT

## Data categories to audit
- Personal info: team contact name, email, phone; account authentication credentials (password hashes, not plaintext).
- Photos/files: verification documents and team logo uploads.
- Location: team pitch address and optional map coordinates; verify device location access and whether precise location is collected.
- Messages: match request messages and team chat.
- Financial info: payment references/status and Paystack payment handoff; confirm whether card details ever enter NFN systems (do not assume).
- App activity/device IDs: verify hosting, logs, analytics, cookies, and any third-party SDKs.

## For EACH category confirm before entering Play Console
1. Collected by app? Shared with external providers? Name each processor.
2. Mandatory or optional? Purpose (app functionality, security, payments, support).
3. Encrypted in transit? Confirm HTTPS across app and services.
4. Can users request deletion? What remains, why, and for how long?
5. What is actually retained in logs, backups, emails and storage?
6. Does Android package add any SDK or permission beyond the website?

## Known processors to validate
Vercel (web hosting), Render (backend), Neon (database), Paystack (payments), Resend (notifications). Check contractual roles and actual data transmission.

## Do not submit yet
- Do not claim all user data is deleted automatically: deletion execution is unfinished.
- Do not claim no data collection or sharing without inspecting actual requests and Android SDKs.
- Do not claim a completed Android bundle, signed release, or Play policy approval.
