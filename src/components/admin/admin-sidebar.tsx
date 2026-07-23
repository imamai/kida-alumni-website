"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNav } from "@/components/admin/admin-nav";
import { signOut } from "@/app/actions/auth";

export function AdminSidebar({ logoUrl, userEmail }: { logoUrl: string; userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Image src={logoUrl} alt="" width={32} height={32} className="h-8 w-8" />
        <div>
          <p className="font-heading text-sm font-semibold text-kida-purple">KIDA Admin</p>
          <p className="text-[11px] text-muted-foreground">Content & Operations</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNav.map((item) => {
          const active = pathname === item.href;
          if (item.disabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground/50"
                title="Coming in a later phase"
              >
                <item.icon className="size-4" />
                {item.label}
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                active && "bg-kida-purple/10 text-kida-purple",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <p className="truncate px-3 text-xs text-muted-foreground">{userEmail}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
