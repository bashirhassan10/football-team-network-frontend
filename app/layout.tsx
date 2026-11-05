import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import "./globals.css";
import TeamSessionGuard from "./team-session-guard";
import PwaRegistration from "./pwa-registration";

export const metadata: Metadata = {
  title: { default: "Naija Football Network", template: "%s | Naija Football Network" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "NFN", statusBarStyle: "default" },
  icons: { icon: "/nfn-mark.svg", shortcut: "/nfn-mark.svg", apple: "/nfn-mark.svg" },
  description: "Connect football teams, verify clubs, organize matches and build stronger football communities across Nigeria.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><TeamSessionGuard /><PwaRegistration />{children}</body></html>;
}
