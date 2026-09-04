import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";

import { NAV_FOOTER, NAV_MAIN, AI_DISCLAIMER } from "@/lib/tools";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-2 py-1">
      <span className="flex size-9 items-center justify-center rounded-xl bg-neon-soft glow">
        <Zap className="size-4 text-neon" strokeWidth={2.5} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold tracking-tight">Flow AI</span>
        <span className="block text-[11px] text-muted-foreground">Workplace Assistant</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const item = (
    { label, path, icon: Icon }: { label: string; path: string; icon: typeof Zap },
    key: string,
  ) => {
    const active = pathname === path;
    return (
      <Link
        key={key}
        to={path}
        onClick={onNavigate}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
          active
            ? "bg-neon-soft text-neon shadow-[inset_0_0_0_1px_var(--ring)]"
            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        )}
      >
        <Icon className={cn("size-4 transition-transform group-hover:scale-110")} />
        <span className="truncate font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="flex h-full flex-col gap-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
        Workspace
      </p>
      {NAV_MAIN.map((n) => item(n, n.path))}
      <p className="px-3 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
        Account
      </p>
      {NAV_FOOTER.map((n) => item(n, n.path))}
      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-xl border border-border bg-surface-2/60 p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-neon">
            <Sparkles className="size-3.5" /> Pro workspace
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            842 of 2,000 AI credits used this month.
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full w-[42%] rounded-full bg-neon" />
          </div>
        </div>
        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground/80">{AI_DISCLAIMER}</p>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background grid-backdrop">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border bg-sidebar px-3 py-4 lg:flex">
        <Brand />
        <div className="mt-6 flex-1 overflow-y-auto scrollbar-slim">
          <NavLinks />
        </div>
      </aside>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-border bg-sidebar p-3">
              <Brand />
              <div className="mt-6 h-[calc(100%-4rem)] overflow-y-auto scrollbar-slim">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <span className="font-display text-sm font-semibold">Flow AI</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] text-muted-foreground sm:flex">
              <span className="size-1.5 rounded-full bg-neon shadow-[0_0_8px_var(--neon)]" />
              AI engine online
            </span>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-neon text-[11px] font-bold text-primary-foreground">
                BM
              </span>
              <span className="hidden text-xs font-medium sm:block">Bathabile M.</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
