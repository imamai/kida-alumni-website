"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { primaryNav, isNavGroup } from "@/components/site/nav-data";

type SiteHeaderProps = {
  siteName: string;
  siteShortName: string;
  logoUrl: string;
};

export function SiteHeader({ siteName, siteShortName, logoUrl }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={siteName}>
          <Image src={logoUrl} alt={`${siteName} crest`} width={44} height={44} priority className="h-11 w-11" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-lg font-semibold text-kida-purple">{siteShortName}</span>
            <span className="text-[11px] tracking-wide text-muted-foreground uppercase">Kibabiians Development Assoc.</span>
          </span>
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {primaryNav.map((entry) =>
              isNavGroup(entry) ? (
                <NavigationMenuItem key={entry.label}>
                  <NavigationMenuTrigger className="bg-transparent">{entry.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[320px] gap-1 p-2">
                      {entry.items.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink
                            render={
                              <Link href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted" />
                            }
                          >
                            <div className="font-medium">{item.label}</div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={entry.href}>
                  <NavigationMenuLink
                    render={
                      <Link
                        href={entry.href}
                        className={cn(
                          "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted",
                          pathname === entry.href && "text-kida-purple",
                        )}
                      />
                    }
                  >
                    {entry.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login" />}>
            Sign In
          </Button>
          <Button
            size="sm"
            className="bg-kida-purple hover:bg-kida-purple-dark"
            nativeButton={false}
            render={<Link href="/membership/become-member" />}
          >
            Become a Member
          </Button>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-heading text-kida-purple">
                <Image src={logoUrl} alt="" width={28} height={28} className="h-7 w-7" />
                {siteShortName}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 pb-6">
              {primaryNav.map((entry) =>
                isNavGroup(entry) ? (
                  <MobileNavGroup key={entry.label} label={entry.label} items={entry.items} onNavigate={() => setMobileOpen(false)} />
                ) : (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    {entry.label}
                  </Link>
                ),
              )}
              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  onClick={() => setMobileOpen(false)}
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-kida-purple hover:bg-kida-purple-dark"
                  onClick={() => setMobileOpen(false)}
                  nativeButton={false}
                  render={<Link href="/membership/become-member" />}
                >
                  Become a Member
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function MobileNavGroup({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm font-medium hover:bg-muted"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
