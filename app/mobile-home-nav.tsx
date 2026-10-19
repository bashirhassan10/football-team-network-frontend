"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MobileHomeNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="homeMobileNav">
      <Link className="homeMobileSignIn" href="/login">Sign in</Link>
      <button type="button" className="homeMobileToggle" aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open} aria-controls="home-mobile-menu" onClick={() => setOpen(v => !v)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div id="home-mobile-menu" className="homeMobileMenu">
          <Link href="/register" onClick={close}>Register Team</Link>
          <Link href="/login" onClick={close}>Sign In</Link>
          <Link href="/admin/login" onClick={close}>Admin Login</Link>
          <a href="#features" onClick={close}>Features</a>
          <Link href="/teams" onClick={close}>Explore Teams</Link>
        </div>
      )}
    </div>
  );
}
