# NFN Account Deletion — Option A (approved design)
Date: 2026-11-18
Scope: staging design only. Not authorization to delete any existing team.

## Decision
Retain only legally or operationally necessary payment records and shared match history; remove or anonymize unnecessary personal information. Do not remove opponent teams' records.

## Safe implementation phases
1. Require logged-in team ownership verification, plus fresh independent email challenge or reauthentication. An existing session and matching request ID alone are insufficient for irreversible deletion.
2. Admin reviews dependency inventory and retention justification; capture approval identity, time, scope, and immutable audit event. An APPROVED_FOR_DELETION status is not deletion execution.
3. Introduce explicit disabled/deletion-pending account state. Ensure every authentication and match-making endpoint rejects disabled teams; invalidate active sessions and password-reset tokens.
4. In a database transaction, anonymize the team profile and unlink retained shared records only after confirming all foreign keys and app queries remain valid. Do not delete payment references required for financial audit. Define a non-identifying retained team tombstone if references require team_id.
5. Delete team-only chats, verification rows, and unnecessary personal data per approved retention rules. Remove external storage objects only after a durable retryable cleanup job; keep evidence of failures without retaining private document content.
6. Mark request completed only after DB, storage and access revocation succeed. Send requester confirmation without sensitive details.
7. Test with a NEW disposable staging team and zero live payments, including failed operations, retries, opponent fixtures, login revocation, and rollback/recovery. No production execution without separate authorization.

## Data inventory from staging schema
- teams: email, contact_name, phone, password_hash, pitch_address and GPS, team name, classification, verification metadata.
- payments: team_id, amount, currency, payment_reference, status, timestamps.
- match_requests: sender_team_id, receiver_team_id, message, venue and GPS, status and dates.
- verification_documents and match_messages: separate retention and external storage cleanup review required.
- account_deletion_requests: requester_email, team_name, reason and admin notes themselves contain personal data and require retention/minimization.

## Unresolved operator decisions
- Specify financial record retention period with local professional advice.
- Specify whether match history will show 'Deleted team' and whether shared chat content must be removed.
- Specify retention period for deletion-request audit records.
- Confirm identity challenge channel and support handling SLA.

## Release gate
Do not implement or enable an irreversible DELETE endpoint before these decisions and the regression test suite are complete.
