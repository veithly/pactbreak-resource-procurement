"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardCheck, FileClock, Search, ShieldCheck, ShoppingCart, SlidersHorizontal, WalletCards } from "lucide-react";

const nav = [
  { href: "/app/queue", label: "Procurement", icon: ShoppingCart },
  { href: "/app/pact", label: "Pact", icon: WalletCards },
  { href: "/app/proof", label: "Proof", icon: ClipboardCheck },
  { href: "/app/policy", label: "Policy", icon: SlidersHorizontal },
  { href: "/app/runs", label: "Runs", icon: FileClock },
  { href: "/about", label: "Architecture", icon: Activity }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" data-collapse-toggle="sidebar-static">
      <Link href="/" className="brand-lockup" aria-label="PactBreak Resource Procurement">
        <span className="brand-mark" aria-hidden="true">
          <img src="/brand/logomark.svg" alt="" />
        </span>
        <span>PactBreak</span>
      </Link>

      <label className="sidebar-search">
        <Search size={16} aria-hidden />
        <input type="search" aria-label="Find routes and proof receipts" />
      </label>

      <nav className="sidebar-nav" aria-label="Primary">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/about" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${active ? "active" : ""}`}>
              <Icon size={18} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="surface sidebar-proof-card">
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
          <ShieldCheck size={18} color="var(--green)" aria-hidden />
          <strong>Judge path</strong>
        </div>
        <p style={{ color: "var(--muted)", lineHeight: 1.55, margin: 0, fontSize: 14 }}>
          Select an agent purchase, mutate price or vendor, then inspect the live CAW proof.
        </p>
      </div>
    </aside>
  );
}
