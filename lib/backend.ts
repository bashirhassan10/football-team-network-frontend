const configuredBackendUrl = process.env.BACKEND_API_URL?.trim();

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
