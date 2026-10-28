// This dedicated override is used only by the team-logo feature preview.
// It avoids modifying the shared Production/Preview BACKEND_API_URL setting.
const teamLogoPreviewOverride =
  process.env.VERCEL_ENV === "preview" &&
  ["feat/staging-team-logo-upload", "feat/staging-professional-team-profile", "feat/staging-team-divisions-fixtures"].includes(process.env.VERCEL_GIT_COMMIT_REF || "")
    ? (["feat/staging-professional-team-profile", "feat/staging-team-divisions-fixtures"].includes(process.env.VERCEL_GIT_COMMIT_REF || "") ? "https://football-team-network-staging.onrender.com" : process.env.TEAM_LOGO_STAGING_BACKEND_URL?.trim())
    : undefined;

const configuredBackendUrl =
  teamLogoPreviewOverride || process.env.BACKEND_API_URL?.trim();

// Only the real Vercel production environment may use the legacy production default.
// Preview and development must never silently send requests to production.
const BACKEND_API_URL =
  configuredBackendUrl ||
  (process.env.VERCEL_ENV === "production"
    ? "https://football-team-network.onrender.com"
    : "");

export function backendUrl(path: string) {
  if (!BACKEND_API_URL) {
    throw new Error(
      "BACKEND_API_URL is required for Preview and Development deployments.",
    );
  }

  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_URL.replace(/\/$/, "")}${safePath}`;
}
