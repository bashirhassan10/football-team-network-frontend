"use client";

import { useEffect, useState } from "react";

const TAB_TEAM_KEY = "nfn_active_tab_team_id";
const TEAM_ROUTES = /^\/(dashboard|matches|calendar|statistics|settings|squad|teams|verification)(\/|$)/;

export default function TeamSessionGuard() {
  const [changed, setChanged] = useState(false);
  const [currentTeam, setCurrentTeam] = useState("");

  useEffect(() => {
    if (!TEAM_ROUTES.test(window.location.pathname)) return;

    let disposed = false;
    let checking = false;
    const check = async () => {
      if (checking || disposed) return;
      checking = true;
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (disposed) return;
        if (response.status === 401) {
          window.location.replace("/login");
          return;
        }
        if (!response.ok) return;
        const session: { authenticated?: boolean; team_id?: number | null; team_name?: string | null } =
          await response.json();
        if (disposed || !session.authenticated || !session.team_id) return;

        const actualID = String(session.team_id);
        const tabID = sessionStorage.getItem(TAB_TEAM_KEY);
        if (!tabID) {
          sessionStorage.setItem(TAB_TEAM_KEY, actualID);
        } else if (tabID !== actualID) {
          setCurrentTeam(session.team_name || "another team");
          setChanged(true);
        }
      } catch {
        // Network failures must not be mistaken for a changed identity.
      } finally {
        checking = false;
      }
    };

    void check();
    const onFocus = () => void check();
    const onVisibility = () => { if (!document.hidden) void check(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    const timer = window.setInterval(() => { if (!document.hidden) void check(); }, 4000);
    return () => {
      disposed = true;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(timer);
    };
  }, []);

  if (!changed) return null;

  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="nfn-session-title"
      style={{ position: "fixed", inset: 0, zIndex: 2147483647, background: "rgba(0,0,0,.78)", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ maxWidth: 440, width: "100%", padding: 28, background: "white", color: "#12271d", borderRadius: 16 }}>
        <h2 id="nfn-session-title" style={{ marginTop: 0 }}>Team session changed</h2>
        <p>You signed in as {currentTeam} in another tab. This tab belongs to your previous team session. To prevent sending messages or results as the wrong team, reload your workspace.</p>
        <button type="button" onClick={() => {
          sessionStorage.removeItem(TAB_TEAM_KEY);
          window.location.replace("/dashboard");
        }} style={{ padding: "12px 18px", border: 0, borderRadius: 8, background: "#0b7043", color: "white", cursor: "pointer" }}>
          Open current team workspace
        </button>
      </div>
    </div>
  );
}
