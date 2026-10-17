import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import "./globals.css";
import TeamSessionGuard from "./team-session-guard";

export const metadata: Metadata = {
  title: { default: "Football Team Network", template: "%s | Football Team Network" },
  description: "Connect football teams, verify clubs, organize matches and build stronger football communities across Nigeria.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><TeamSessionGuard />{children}</body></html>;
}
