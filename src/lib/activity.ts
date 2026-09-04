import { useCallback, useEffect, useState } from "react";
import type { ToolId } from "./tools";

export type ActivityItem = {
  id: string;
  tool: ToolId;
  title: string;
  detail: string;
  label?: string;
  ts?: number;
  words: number;
};

const STORAGE_KEY = "flow-ai.activity.v1";

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "seed-1",
    tool: "email",
    title: "Q3 budget approval request",
    detail: "Persuasive email to Finance leadership · 214 words",
    label: "12 min ago",
    words: 214,
  },
  {
    id: "seed-2",
    tool: "meeting",
    title: "Product sync — sprint 42 recap",
    detail: "7 key points · 3 decisions · 5 action items",
    label: "1 hr ago",
    words: 486,
  },
  {
    id: "seed-3",
    tool: "tasks",
    title: "Thursday deep-work plan",
    detail: "11 tasks prioritised · 6 h 30 m scheduled",
    label: "3 hrs ago",
    words: 322,
  },
  {
    id: "seed-4",
    tool: "research",
    title: "AI adoption in mid-market logistics",
    detail: "Executive brief with 6 recommendations",
    label: "Yesterday",
    words: 918,
  },
  {
    id: "seed-5",
    tool: "chat",
    title: "How to phrase a deadline pushback",
    detail: "4-message conversation",
    label: "Yesterday",
    words: 173,
  },
  {
    id: "seed-6",
    tool: "email",
    title: "Client onboarding welcome note",
    detail: "Friendly email to new account contact · 168 words",
    label: "2 days ago",
    words: 168,
  },
];

function read(): ActivityItem[] {
  if (typeof window === "undefined") return DEMO_ACTIVITY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_ACTIVITY;
    const parsed = JSON.parse(raw) as ActivityItem[];
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_ACTIVITY;
  } catch {
    return DEMO_ACTIVITY;
  }
}

const listeners = new Set<() => void>();
let cache: ActivityItem[] | null = null;

function emit() {
  listeners.forEach((l) => l());
}

export function useActivity() {
  const [items, setItems] = useState<ActivityItem[]>(DEMO_ACTIVITY);

  useEffect(() => {
    if (!cache) cache = read();
    setItems(cache);
    const listener = () => setItems(cache ?? DEMO_ACTIVITY);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const log = useCallback((entry: Omit<ActivityItem, "id" | "ts">) => {
    const next: ActivityItem[] = [
      { ...entry, id: `a-${Date.now()}`, ts: Date.now() },
      ...(cache ?? read()),
    ].slice(0, 40);
    cache = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
    emit();
  }, []);

  const clear = useCallback(() => {
    cache = DEMO_ACTIVITY;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    emit();
  }, []);

  return { items, log, clear };
}

export function timeLabel(item: ActivityItem) {
  if (item.label) return item.label;
  if (!item.ts) return "recently";
  const mins = Math.max(0, Math.round((Date.now() - item.ts) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  return `${Math.round(hrs / 24)} days ago`;
}
