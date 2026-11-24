# Google Play release gates — staging status

Checkmarks in README mean source implementation plus CI verification, not production deployment or Google approval.

## Implemented preparation

- Unsigned Android bundle build, minimum SDK 24 and target SDK 36 validation.
- Canonical www host configuration and certificate-association route (unconfigured until real certificate is available).
- Community consent, reports, blocking, moderation and audit (migration 026 / rollout switch required).
- Test-only staging checkout gate, read-only readiness diagnostics, structured Data Safety draft and offline recovery.
- Current verification requirements are REGISTRATION and COACH_LETTER. Legacy ID types are not new review requirements.

## Release gates remain open

- [ ] Play Console creation, release signing and correct Play app-signing certificate association.
- [ ] Verification-payment classification and Play Billing decision. Test-only Paystack support is not approval for Android payments.
- [ ] Backend staging reconciliation of fresh deletion controls previously implemented on master. A schema column alone is not sufficient.
- [ ] Operator-approved retention, community Terms, moderation operations and final privacy/Data Safety declaration.
- [ ] Hosting branch, database/storage isolation, migrations and runtime staging smoke tests.
- [ ] Real Android login/recovery, uploads, payment return, chat/blocking, navigation, network interruption and resume tests.
- [ ] Store listing, reviewer access, required testing tracks and submission.

No hosting configuration or database migration is applied from this chat. Work remains on staging; main/master changes need explicit release approval.
