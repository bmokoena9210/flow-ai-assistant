import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, FileText, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { timeLabel, useActivity } from "@/lib/activity";
import { AI_DISCLAIMER, TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flow AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Your productivity overview: AI generations, hours saved, recent activity and quick access to all five Flow AI tools.",
      },
      { property: "og:title", content: "Dashboard — Flow AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Productivity stats, recent activity and one-click access to every Flow AI tool.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "AI generations", value: "148", delta: "+22% vs last week", icon: Sparkles },
  { label: "Hours saved", value: "31.5", delta: "+4.2 hrs this week", icon: Clock },
  { label: "Documents produced", value: "62", delta: "9 awaiting review", icon: FileText },
  { label: "Avg. response time", value: "4.1s", delta: "Fastest this month", icon: Zap },
];

const CHART = [
  { day: "Mon", runs: 14 },
  { day: "Tue", runs: 22 },
  { day: "Wed", runs: 18 },
  { day: "Thu", runs: 31 },
  { day: "Fri", runs: 27 },
  { day: "Sat", runs: 8 },
  { day: "Sun", runs: 6 },
];

const USAGE = [
  { label: "Email Generator", pct: 34 },
  { label: "Meeting Summarizer", pct: 26 },
  { label: "Task Planner", pct: 18 },
  { label: "Research Assistant", pct: 14 },
  { label: "Workplace Chat", pct: 8 },
];

function Dashboard() {
  const { items } = useActivity();

  return (
    <AppShell>
      <PageHeader
        title="Good morning, Bathabile"
        description="Here's how your workspace is performing this week. Pick a tool and Flow AI will handle the writing, planning and research."
        action={
          <Button variant="neon" size="lg" asChild>
            <Link to="/chat">
              <Sparkles className="size-4" /> Ask Flow AI
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="panel group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ring"
          >
            <div className="flex items-start justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon className="size-4 text-neon transition-transform group-hover:scale-110" />
            </div>
            <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-neon">
              <TrendingUp className="size-3" />
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        <div className="panel p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">AI activity this week</h2>
              <p className="text-[11px] text-muted-foreground">Generations per day across all tools</p>
            </div>
            <span className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[10px] text-muted-foreground">
              Last 7 days
            </span>
          </div>
          <div className="mt-5 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART} margin={{ top: 6, right: 6, bottom: 0, left: 6 }}>
                <defs>
                  <linearGradient id="runsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--foreground)",
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="runs"
                  stroke="var(--neon)"
                  strokeWidth={2}
                  fill="url(#runsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-sm font-semibold">Tool usage</h2>
          <p className="text-[11px] text-muted-foreground">Share of generations this month</p>
          <div className="mt-5 space-y-4">
            {USAGE.map((u) => (
              <div key={u.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="font-medium">{u.pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-neon transition-all duration-700"
                    style={{ width: `${u.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">Quick actions</h2>
            <p className="text-xs text-muted-foreground">Jump straight into any Flow AI tool</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.id}
              to={t.path}
              className="panel group flex flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ring hover:glow"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-neon-soft text-neon transition-transform duration-300 group-hover:scale-110">
                  <t.icon className="size-[18px]" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{t.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">Recent activity</h2>
            <p className="text-xs text-muted-foreground">Your latest AI generations</p>
          </div>
          <Button variant="subtle" size="sm" asChild>
            <Link to="/activity">View all</Link>
          </Button>
        </div>
        <div className="panel divide-y divide-border overflow-hidden">
          {items.slice(0, 5).map((a) => {
            const tool = TOOLS.find((t) => t.id === a.tool) ?? TOOLS[0]!;
            return (
              <Link
                key={a.id}
                to={tool.path}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2/60"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-neon">
                  <tool.icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{timeLabel(a)}</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">{AI_DISCLAIMER}</p>
      </section>
    </AppShell>
  );
}
