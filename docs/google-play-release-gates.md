# NFN Android / Google Play release gate (staging planning)
Updated: 2026-11-18. This is a checklist, not a Play approval claim.

## Current verified capabilities
- Public privacy policy and public account deletion request page.
- Deletion requests persisted in staging and support notification delivered in test.
- Team-session ownership check, admin impact preview, non-destructive review approval.

## Release blockers
1. **Android artifact:** No verified signed Android App Bundle (.aab), Android package ID, signing key, or Play Console listing has been supplied. Decide native vs Trusted Web Activity implementation, and test device behavior.
2. **Actual deletion:** No deletion execution endpoint. Do not mark deletion completed or claim immediate removal. Implement verified deletion with audit trail, explicit retention and anonymization policy, and storage-object cleanup. Require independent authentication and operator sign-off before irreversible actions.
3. **Financial retention:** Payments table references teams with NO ACTION FK. Determine lawful retention period and minimization/anonymization with operator and appropriate legal/accounting advice. Do not remove payment records blindly.
4. **Shared match history:** Match requests have NO ACTION FKs and messages have CASCADE behavior. Decide what shared records should be retained, anonymized, or removed without corrupting opponents' fixtures or chats.
5. **Verification uploads:** DB rows may be cascaded, but files in external object storage require a separate authenticated cleanup plan. Verify storage paths and permissions.
6. **Google Play disclosures:** Reconcile Data safety form, privacy policy, actual data flows (location, documents, messaging, payments), account deletion instructions, target audience and permissions with the shipped Android app.
7. **Operator approval:** Confirm real support mailbox, operator name, retention policy, account deletion handling timelines, and production readiness.
8. **QA:** Test staging deletion with a fresh disposable team and no live payments; regression-test match flows, login, emails and admin access; only then plan production migration.

## Security rules
- Never execute DELETE FROM teams as a shortcut.
- Never use an email alone as proof of ownership.
- Review approval is not deletion execution.
- Production data and live payments are out of scope for staging tests.
