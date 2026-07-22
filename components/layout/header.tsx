"use client";

import { ChevronDown, MapPin, Search, User } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logomark } from "./logomark";
import { useRouteMap } from "@/features/routes/route-context";
import { useLocale, useTranslation } from "@/lib/i18n/context";

export function Header() {
  const { query, setQuery } = useRouteMap();
  const t = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-3 md:gap-4 md:px-5">
      <div className="flex items-center gap-2.5">
        <Logomark />
        <span className="hidden font-display text-lg font-semibold tracking-tight text-foreground sm:inline">
          EasyBus
        </span>
      </div>

      <div className="mx-auto hidden w-full max-w-md md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.header.searchPlaceholder}
            className="h-9 rounded-full bg-muted pl-9 pr-14 text-sm shadow-none focus-visible:bg-card"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 md:gap-1.5">
        <Button variant="ghost" size="sm" className="gap-1.5 text-sm font-medium">
          <MapPin className="size-3.5 text-muted-foreground sm:hidden" />
          <span className="hidden sm:inline">{t.header.city}</span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground sm:inline" />
        </Button>
        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocale(locale === "vi" ? "en" : "vi")}
          className="hidden text-sm font-medium md:inline-flex"
          aria-label="Toggle language"
        >
          {locale.toUpperCase()}
        </Button>
        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <User className="size-3.5" />
              <span className="hidden sm:inline">{t.header.login}</span>
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="ghost" size="sm" className="hidden text-sm font-medium sm:inline-flex">
              {t.header.signup}
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
