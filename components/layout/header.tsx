"use client";

import { ChevronDown, MapPin, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouteMap } from "@/features/routes/route-context";

function Logomark() {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="3.5" r="2.1" fill="currentColor" />
        <line x1="9" y1="5.6" x2="9" y2="12.4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 12.4 L6.4 16 H11.6 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Header() {
  const { query, setQuery } = useRouteMap();

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
            placeholder="Tìm tuyến, trạm, địa điểm..."
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
          <span className="hidden sm:inline">TP. Hồ Chí Minh</span>
          <ChevronDown className="hidden size-3.5 text-muted-foreground sm:inline" />
        </Button>
        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
        <Button variant="ghost" size="sm" className="hidden text-sm font-medium md:inline-flex">
          VI
        </Button>
        <Separator orientation="vertical" className="mx-1 hidden h-5 md:block" />
        <Button variant="secondary" size="sm" className="gap-1.5">
          <User className="size-3.5" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Button>
      </div>
    </header>
  );
}
