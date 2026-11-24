# Community safety: staging handoff

The five implementation tasks are tracked in README. They are code/CI milestones, not a production release or Google Play compliance certification.

## Team-operated staging setup

1. Confirm the Render staging service deploys the backend staging branch and uses an isolated database, storage and test credentials.
2. Apply migrations in dependency order to that staging database. This batch adds 026_community_safety.sql; it does not apply it remotely.
3. Set COMMUNITY_SAFETY_ENABLED=true only after the schema is present and the matching frontend is deployed. Default is false.
4. Confirm the frontend staging deployment and its API requests reach football-team-network-staging.onrender.com. Source pins the staging branch and this feature branch to that endpoint.
5. Use disposable authorized test teams; accept Terms, exchange a message, report it, block the opponent, confirm chat and new challenges are denied, then unblock.
6. In the admin moderation queue review evidence, hide a message, suspend and restore a test team, and inspect the action audit. Do not moderate real users as test fixtures.

## Data and operational gates (still open)

- Obtain operator review of Community Terms, adult account management and moderation escalation/response process.
- Decide retention/minimization for report evidence, consent, blocks, sanctions and audit, including deletion/export requests and backups.
- Shared admin key access is inherited from the existing product. Audit records label that credential; individual moderator attribution remains future work.
- Verify migration/rollback, representative staging journeys, Android UI and runtime behavior. CI uses a disposable schema and does not prove hosted deployment correctness.
- Reconcile Data Safety and privacy disclosures with actual configured providers and data flow.

The backend staging history differs from master and is intentionally preserved. Earlier master-only release changes are not silently backported. Main/master and hosting settings were not changed by this batch.

Policy reference: https://support.google.com/googleplay/android-developer/answer/9876937
