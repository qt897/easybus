"use client";

import { useTranslation } from "@/lib/i18n/context";

export function ComingSoon({ label }: { label: string }) {
  const t = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-muted-foreground">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs">{t.sidebar.comingSoon}</p>
    </div>
  );
}
