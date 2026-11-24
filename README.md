# Naija Football Network (NFN) — Frontend

Frontend for the Naija Football Network platform.

## Project status

- The web application is deployed at [naijafootballnetwork.com](https://naijafootballnetwork.com).
- Android / Google Play work is being prepared separately on the `chore/android-play-release-prep` branch.
- The Android work is currently a **Trusted Web Activity (TWA) preparation**, not a completed or signed Play Store release.
- Production must remain unchanged while Android preparation and testing are in progress.

## Android / Google Play preparation

Start here:

- [Android build and setup guide](android/README.md)
- [Android engineer handoff](docs/android-engineer-handoff.md)
- [TWA release plan](docs/android-twa-release-plan.md)
- [Google Play release gates](docs/google-play-release-gates.md)
- [Google Play Data Safety draft](docs/google-play-data-safety-draft.md)

Confirmed Android identity:

| Setting | Value |
| --- | --- |
| App name | Naija Football Network |
| Launcher name | NFN |
| Package ID | `com.naijafootballnetwork.app` |
| Web origin | `https://naijafootballnetwork.com` |
| Web manifest | `https://naijafootballnetwork.com/manifest.webmanifest` |

The Android CI job is intentionally restricted to pushes on `chore/android-play-release-prep`. It generates a TWA project from the production web manifest, verifies the app identity and Android API 36 settings, builds an **unsigned** AAB, and uploads a short-lived validation artifact. The AAB is not suitable for Play Console upload.

## Important release safeguards

- Do not merge the Android preparation branch into `main` or deploy it without explicit release approval.
- Do not change Production services, databases, environment variables, live Paystack configuration, or production data for Android preparation.
- Never commit a signing keystore, passwords, Play Console credentials, or service secrets.
- Do not publish Digital Asset Links until the correct release certificate SHA-256 fingerprint is known.
- The Data Safety worksheet is a draft. Verify the final Android binary and actual data flows before submitting declarations.

See the engineer handoff document for the current verified status, known CI limitations, and the next steps.
