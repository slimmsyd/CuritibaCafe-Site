"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/artists", label: "Artists" },
  { href: "/admin/chat", label: "Chat" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 overflow-x-auto p-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-3">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-nav-link shrink-0 whitespace-nowrap ${active ? "admin-nav-link-active" : ""}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}