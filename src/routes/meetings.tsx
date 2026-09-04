import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, type Field } from "@/components/tool-workspace";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Flow AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into summaries, key points, decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Summarizer — Flow AI" },
      {
        property: "og:description",
        content: "Paste notes, get a clean recap with owners and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

const FIELDS: Field[] = [
  {
    name: "title",
    label: "Meeting title",
    type: "text",
    defaultValue: "Product sync — sprint 42 planning",
  },
  {
    name: "attendees",
    label: "Attendees",
    type: "text",
    defaultValue: "Bathabile (Ops), Sipho (Eng), Lerato (Design), Marcus (Sales)",
  },
  {
    name: "notes",
    label: "Raw notes or transcript",
    type: "textarea",
    rows: 12,
    defaultValue:
      "sipho: onboarding rebuild is 70% done, blocked on the new auth endpoint until wed\nlerato: new empty states designed, still needs mobile pass, will share fri\nmarcus: 3 enterprise demos next week, they keep asking about SSO - need a date we can commit to\nbathabile: churn dashboard numbers looked off last week, data team investigating\ndecided: push SSO discovery into sprint 43, don't promise a date to prospects yet\ndecided: ship onboarding rebuild behind a flag on the 18th\ndecided: lerato owns mobile empty states, due friday\nmarcus flagged that the pricing page copy is out of date\nopen question: do we need a migration plan for legacy accounts?",
  },
];

const DEMO = `SUMMARY
Sprint 42 planning focused on the onboarding rebuild, upcoming enterprise demos and unblocking design work. The team agreed to ship the onboarding rebuild behind a feature flag on 18 September and to delay any SSO commitments until discovery lands in sprint 43.

KEY POINTS
- Onboarding rebuild is ~70% complete; blocked on the new auth endpoint until Wednesday.
- New empty states are designed but still need a mobile pass.
- Three enterprise demos are scheduled next week and SSO keeps coming up in discovery calls.
- Churn dashboard figures looked inconsistent last week; the data team is investigating.
- Pricing page copy is out of date and was flagged as a quick win.

DECISIONS
1. SSO discovery moves into sprint 43 — no delivery date to be shared with prospects.
2. Onboarding rebuild ships behind a feature flag on 18 September.
3. Design owns the mobile pass on empty states for this sprint.

ACTION ITEMS
- Sipho — unblock and land the new auth endpoint — Wed 10 Sept
- Sipho — ship onboarding rebuild behind flag — Thu 18 Sept
- Lerato — mobile pass on new empty states — Fri 12 Sept
- Marcus — hold SSO messaging to "on the roadmap, no date" in demos — immediate
- Bathabile — get churn dashboard discrepancy root-caused with the data team — Mon 15 Sept

DEADLINES
- Wed 10 Sept — auth endpoint
- Fri 12 Sept — mobile empty states
- Mon 15 Sept — churn data findings
- Thu 18 Sept — onboarding rebuild flagged release

RISKS / OPEN QUESTIONS
- Auth endpoint slipping past Wednesday puts the 18 September release at risk.
- No migration plan yet for legacy accounts — owner not assigned.
- Enterprise deals may stall if SSO expectations are not managed carefully.`;

function MeetingsPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool={TOOLS[1]!}
        toolKey="meeting"
        fields={FIELDS}
        demoResult={DEMO}
        demoMeta="Sample recap · 5 action items · editable"
        submitLabel="Summarize meeting"
        activityTitle={(v) => v["title"] || "Meeting recap"}
      />
    </AppShell>
  );
}
