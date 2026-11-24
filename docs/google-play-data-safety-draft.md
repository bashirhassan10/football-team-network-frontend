# Google Play Data Safety worksheet — draft

Status: DRAFT_NOT_FOR_SUBMISSION. Source inventory is in lib/data-safety.ts and visible to authorized admins at /admin/release-readiness, with a JSON draft download. It contains no user records and makes no production-verification claim.

The worksheet covers account/contact details, authentication, documents/logos/squad data, locations/map searches, chat/fixtures, community reports and evidence, payments, support/deletion requests, and hosting/device information. Each entry has purpose, source references, candidate processors, collection context and required operator review.

## Still required

- Verify actual production data flows and all third-party SDK/network behavior, including map providers and browser handoffs.
- Decide collected/shared classification and any valid processor exceptions using current Google guidance; do not infer no sharing.
- Verify required/optional fields, purpose, transport encryption, private storage, backup/log handling and deletion behavior.
- Approve retention and minimization for financial/shared records and moderation evidence.
- Review youth audience, authorized adult management, permissions, content rating and final Android binary.
- Enter the final operator-approved declaration in Play Console only after these checks.

Source: https://support.google.com/googleplay/android-developer/answer/10787469
