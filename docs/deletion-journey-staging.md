# Staging deletion journey

## Five implementation items

Fresh password verification and 24-hour approval/deactivation expiry are reconciled into staging with a PostgreSQL-backed five-attempt/15-minute throttle. Teams can see their own request IDs/statuses and cancel with their current password before deactivation. Public submission remains generic to avoid revealing whether an account exists.

Admin dependency inspection includes community counts and execution blockers. Review approval does not erase data. Deactivation and cleanup use exclusive transaction-scoped account leases; authenticated handlers retain shared leases so late account writes cannot race deactivation. Busy operations return a conflict for explicit retry. Transaction scope avoids relying on session-level advisory locks through a transaction pooler.

Cleanup records failure-stage metadata, supports retry after external-object removal and database rollback, and returns already_completed on a repeated completed request without duplicating completion. External deletion cannot be rolled back by a database transaction. No automatic replay or real-account test is performed.

## Operator gates

- Apply 025 and 027 to the existing deletion schema on isolated staging; apply 026 before enabling community safety. No remote migration is performed here.
- Keep DELETION_RETENTION_POLICY_APPROVED=false until the operator reviews the full retention/minimization policy.
- If community records exist, the operator must explicitly approve/select COMMUNITY_DELETION_POLICY=redact before deactivation or execution.
- The redaction option removes deleted-team consent/block/suspension rows and free-text report details/evidence/review notes involving the team. Report/decision metadata stays linked to the anonymized tombstone. Unrelated reports, opponent-authored chat and payment/shared fixture associations remain.
- Shared venues, logs, email and backups still need operator retention decisions. The redaction option is prepared for review, not silently accepted by this implementation.
- Verify private object storage, hosted account revocation, failure/retry, restoration expectations and device UX with disposable staging accounts. Cancellation never reactivates a deactivated account.
- The account becomes inaccessible after deactivation; support handles follow-up. No unauthenticated request-status lookup is exposed.

Source reference for pooling restrictions: https://neon.com/docs/connect/connection-pooling
