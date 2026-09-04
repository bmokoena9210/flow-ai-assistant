import {
  Mail,
  NotebookPen,
  ListChecks,
  Telescope,
  MessagesSquare,
  LayoutDashboard,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type ToolId = "email" | "meeting" | "tasks" | "research" | "chat";

export type ToolMeta = {
  id: ToolId;
  name: string;
  short: string;
  description: string;
  path: "/email" | "/meetings" | "/tasks" | "/research" | "/chat";
  icon: LucideIcon;
};

export const TOOLS: ToolMeta[] = [
  {
    id: "email",
    name: "AI Email Generator",
    short: "Email Generator",
    description: "Draft polished emails from audience, purpose, tone and context.",
    path: "/email",
    icon: Mail,
  },
  {
    id: "meeting",
    name: "Meeting Summarizer",
    short: "Meeting Summarizer",
    description: "Turn raw notes into summaries, decisions, actions and deadlines.",
    path: "/meetings",
    icon: NotebookPen,
  },
  {
    id: "tasks",
    name: "AI Task Planner",
    short: "Task Planner",
    description: "Prioritise your task list and get a realistic time-blocked day.",
    path: "/tasks",
    icon: ListChecks,
  },
  {
    id: "research",
    name: "AI Research Assistant",
    short: "Research Assistant",
    description: "Structured business insights, risks and recommendations.",
    path: "/research",
    icon: Telescope,
  },
  {
    id: "chat",
    name: "AI Workplace Chat",
    short: "Workplace Chat",
    description: "A conversational assistant for everyday work questions.",
    path: "/chat",
    icon: MessagesSquare,
  },
];

export const NAV_MAIN = [
  { label: "Dashboard", path: "/" as const, icon: LayoutDashboard },
  ...TOOLS.map((t) => ({ label: t.short, path: t.path, icon: t.icon })),
];

export const NAV_FOOTER = [
  { label: "Activity History", path: "/activity" as const, icon: History },
  { label: "Settings", path: "/settings" as const, icon: Settings },
];

export const AI_DISCLAIMER = "AI-generated content may require human review.";
