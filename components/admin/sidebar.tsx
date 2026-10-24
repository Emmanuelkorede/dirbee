"use client";

import {
  Briefcase,
  Camera,
  Clapperboard,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { signOut } from "@/app/auth/sign-out/action";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import cn from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: Clapperboard },
  { label: "Artists", href: "/admin/artists", icon: Users },
  { label: "Clients", href: "/admin/clients", icon: Briefcase },
  { label: "Photography", href: "/admin/photography", icon: Camera },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquareQuote },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const rowClass =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors";

function SidebarContent({
  userEmail,
  onNavigate,
}: {
  userEmail: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-8">
      <Link href="/admin" onClick={onNavigate} className="px-3">
        <BrandLockup orientation="horizontal" logoSize={28} />
      </Link>

      <nav aria-label="Admin" className="flex-1">
        <ul className="space-y-1">
          {links.map(({ label, href, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    rowClass,
                    active
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-border pt-4">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(rowClass, "text-muted-foreground hover:bg-card hover:text-foreground")}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View site
        </Link>

        <p className="truncate px-3 text-xs text-muted-foreground">{userEmail}</p>

        <div className="flex items-center gap-2">
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className={cn(rowClass, "text-muted-foreground hover:bg-card hover:text-foreground")}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </form>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Phones: top bar + dropdown panel */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:hidden">
        <Link href="/admin">
          <BrandLockup orientation="horizontal" logoSize={26} />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-10 place-items-center rounded-lg hover:bg-card"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-border bg-background px-4 py-6 md:hidden">
          <SidebarContent userEmail={userEmail} onNavigate={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop: fixed column */}
      <aside className="sticky top-0 hidden h-dvh border-r border-border px-4 py-6 md:block">
        <SidebarContent userEmail={userEmail} />
      </aside>
    </>
  );
}