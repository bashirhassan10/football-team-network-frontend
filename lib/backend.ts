const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "https://football-team-network.onrender.com";

export function backendUrl(path: string) {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${BACKEND_API_URL}${safePath}`;
}
