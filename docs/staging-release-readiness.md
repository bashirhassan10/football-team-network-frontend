# Staging release-readiness batch

1. New checkout initialization defaults off. To test on an isolated staging service, set APP_ENVIRONMENT=staging, STAGING_TEST_CHECKOUT_ENABLED=true and a genuine Paystack test secret. A live-key prefix cannot enable it. Existing verification/webhook handling remains separate; do not use live transactions as tests.
2. Admin readiness is read-only and returns safe presence/schema signals. It never returns credentials or runs migrations. Overall release readiness remains false because manual gates are unresolved.
3. Admin Data Safety export is a static source inventory marked DRAFT_NOT_FOR_SUBMISSION, not user data or a final declaration.
4. Offline navigation returns only a public fallback; private HTML/API responses and actions are never cached/queued. Reconnection offers an explicit refresh and warns users to check interrupted payment/upload status. A first-ever visit with no installed worker still needs a network connection.
5. New reviews require registration and coach-letter documents. Historical ID types remain supported in records but are not new requirements.

Fresh deletion controls are now selectively reconciled into backend staging. The readiness panel checks migration signals and configured retention/redaction prerequisites separately from source implementation. No migration, operator approval or hosted deletion QA is implied.

Play Billing reference: https://support.google.com/googleplay/android-developer/answer/9858738
Data Safety reference: https://support.google.com/googleplay/android-developer/answer/10787469
