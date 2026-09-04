import { createFileRoute, Link } from "@tanstack/react-router";
import { History, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { timeLabel, useActivity } from "@/lib/activity";
import { AI_DISCLAIMER, TOOLS, type ToolId } from "@/lib/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity History — Flow AI" },
      {
        name: "description",
        content: "Every email, recap, plan, brief and conversation Flow AI has generated for you.",
      },
      { property: "og:title", content: "Activity History — Flow AI" },
      {
        property: "og:description",
        content: "Browse and filter your full Flow AI generation history.",
      },
    ],
  }),
  component: ActivityPage,
});

type Filter = "all" | ToolId;

function ActivityPage() {
  const { items, clear } = useActivity();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? items : items.filter((i) => i.tool === filter);
  const totalWords = items.reduce((sum, i) => sum + i.words, 0);

  return (
    <AppShell>
      <PageHeader
        icon={History}
        title="Activity History"
        description="A running log of everything Flow AI has generated in this workspace."
        action={
          <Button
            variant="subtle"
            size="sm"
            onClick={() => {
              clear();
              toast.success("History reset to demo data");
            }}
          >
            <RotateCcw className="size-3.5" /> Reset history
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total generations", value: String(items.length) },
          { label: "Words produced", value: totalWords.toLocaleString("en-US") },
          { label: "Tools used", value: `${new Set(items.map((i) => i.tool)).size} of 5` },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {([{ id: "all" as Filter, label: "All" }] as { id: Filter; label: string }[])
          .concat(TOOLS.map((t) => ({ id: t.id as Filter, label: t.short })))
          .map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs transition-all",
                filter === f.id
                  ? "border-transparent bg-neon font-medium text-primary-foreground"
                  : "border-border bg-surface text-muted-foreground hover:border-ring hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
      </div>

      <div className="panel mt-5 divide-y divide-border overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            Nothing here yet — generate something with this tool and it will show up.
          </p>
        ) : (
          filtered.map((a) => {
            const tool = TOOLS.find((t) => t.id === a.tool) ?? TOOLS[0]!;
            return (
              <div
                key={a.id}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface-2/60 sm:flex-row sm:items-center"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-neon">
                  <tool.icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {tool.short} · {a.detail}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground">{timeLabel(a)}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={tool.path}>Open</Link>
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground">{AI_DISCLAIMER}</p>
    </AppShell>
  );
}
