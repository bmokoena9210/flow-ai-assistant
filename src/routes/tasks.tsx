import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, type Field } from "@/components/tool-workspace";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Flow AI" },
      {
        name: "description",
        content: "Drop in your task list and get a prioritised, time-blocked plan for the day.",
      },
      { property: "og:title", content: "AI Task Planner — Flow AI" },
      {
        property: "og:description",
        content: "Priorities, effort estimates and a practical schedule in one pass.",
      },
    ],
  }),
  component: TasksPage,
});

const FIELDS: Field[] = [
  {
    name: "tasks",
    label: "Your tasks (one per line)",
    type: "textarea",
    rows: 11,
    defaultValue:
      "Finish Q3 budget deck — exec review Thursday 09:00\nReview 4 pull requests for the onboarding flow\nCall supplier about delayed hardware order\nWrite performance feedback for two team members (due Friday)\nRespond to 23 unread emails\nPrepare agenda for Monday leadership sync\nFix broken churn dashboard numbers\nBook venue for team offsite (quotes expire this week)",
  },
  {
    name: "hours",
    label: "Working hours available today",
    type: "select",
    options: ["4", "6", "7", "8", "10"],
    defaultValue: "7",
  },
  {
    name: "style",
    label: "Working style",
    type: "select",
    options: [
      "Balanced",
      "Deep focus in the morning",
      "Deep focus in the afternoon",
      "Short bursts with frequent breaks",
    ],
    defaultValue: "Deep focus in the morning",
  },
];

const DEMO = `PRIORITISED TASKS
1. Finish Q3 budget deck — CRITICAL — 2 h — Hard deadline Thursday 09:00 with executive visibility; everything else can move, this cannot.
2. Fix broken churn dashboard numbers — HIGH — 1 h — Leadership is making decisions on this data; incorrect figures compound daily.
3. Book team offsite venue — HIGH — 30 m — Quotes expire this week; small effort, irreversible if missed.
4. Review 4 onboarding pull requests — HIGH — 1 h — Four people are blocked behind your review.
5. Write performance feedback (2 people) — MEDIUM — 1 h — Due Friday; needs quiet focus, not end-of-day energy.
6. Call supplier re: hardware delay — MEDIUM — 20 m — Time-sensitive but short; batch into an admin block.
7. Prepare Monday leadership agenda — MEDIUM — 30 m — Can be drafted in 15 minutes and refined tomorrow.
8. Clear 23 unread emails — LOW — 45 m — Triage only; convert anything real into a task.

SUGGESTED SCHEDULE
08:30 – 08:45  Plan review: confirm the day, silence notifications
08:45 – 10:45  Deep work — Q3 budget deck (protected block, no meetings)
10:45 – 11:00  Break
11:00 – 12:00  Churn dashboard fix with the data team
12:00 – 12:30  Admin burst — supplier call + offsite venue booking
12:30 – 13:15  Lunch, away from the desk
13:15 – 14:15  Pull request reviews (unblock the team)
14:15 – 15:15  Performance feedback drafts
15:15 – 15:45  Email triage
15:45 – 16:15  Monday agenda draft
16:15 – 16:30  Shutdown review — carry-overs into tomorrow

DEFER OR DELEGATE
- Email triage: delegate anything routine to your assistant or auto-file it.
- Monday agenda: defer to tomorrow morning if the budget deck runs long.
- Supplier call: delegate to procurement if they already own the vendor relationship.

FOCUS TIP
Protect the 08:45–10:45 block like a meeting. Your only "must-land" item today is the budget deck — finishing it before 11:00 turns the rest of the day into low-stakes execution.`;

function TasksPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool={TOOLS[2]!}
        toolKey="tasks"
        fields={FIELDS}
        demoResult={DEMO}
        demoMeta="Sample plan · 8 tasks prioritised · editable"
        submitLabel="Prioritise & schedule"
        activityTitle={() => "Daily priority plan"}
      />
    </AppShell>
  );
}
