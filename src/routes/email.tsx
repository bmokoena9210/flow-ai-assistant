import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, type Field } from "@/components/tool-workspace";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "AI Email Generator — Flow AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from audience, purpose, tone and context in seconds.",
      },
      { property: "og:title", content: "AI Email Generator — Flow AI" },
      {
        property: "og:description",
        content: "Draft, edit and copy professional emails with Flow AI.",
      },
    ],
  }),
  component: EmailPage,
});

const FIELDS: Field[] = [
  {
    name: "audience",
    label: "Audience",
    type: "text",
    placeholder: "e.g. Head of Finance",
    defaultValue: "Head of Finance and the budget committee",
  },
  {
    name: "purpose",
    label: "Purpose",
    type: "text",
    defaultValue: "Request approval for additional Q3 tooling spend",
  },
  {
    name: "tone",
    label: "Tone",
    type: "select",
    options: ["Professional", "Friendly", "Persuasive", "Direct", "Apologetic", "Formal"],
    defaultValue: "Persuasive",
  },
  {
    name: "length",
    label: "Length",
    type: "select",
    options: ["Short", "Medium", "Detailed"],
    defaultValue: "Medium",
  },
  {
    name: "context",
    label: "Context & key points",
    type: "textarea",
    rows: 7,
    defaultValue:
      "- Current tooling licences expire 30 September\n- Requesting R148,000 for annual analytics + automation stack\n- Expected saving: ~18 hours of manual reporting per month\n- Need a decision before the 12th to keep the renewal discount",
  },
];

const DEMO = `SUBJECT: Approval request — Q3 analytics & automation renewal (decision needed by the 12th)

Hi Thandi,

I'd like to request approval for R148,000 to renew our analytics and automation stack ahead of the 30 September licence expiry.

WHY IT MATTERS
- The stack removes roughly 18 hours of manual reporting each month across the ops and revenue teams — about R21,000 in recovered capacity per month.
- Renewing before the 12th keeps our multi-year discount; after that the same package rises by 14%.
- Two of our client SLA reports are generated directly from these tools, so a lapse creates delivery risk.

WHAT I'M ASKING FOR
1. Approval of the R148,000 line item against the Q3 tooling budget.
2. A short confirmation by Thursday the 12th so procurement can process the renewal.

I've attached a one-page cost/benefit view and can walk the committee through it in 10 minutes if that's useful.

Thank you for considering it.

Best regards,
Bathabile Mokoena
Operations Lead`;

function EmailPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool={TOOLS[0]!}
        toolKey="email"
        fields={FIELDS}
        demoResult={DEMO}
        demoMeta="Sample draft · 214 words · editable"
        submitLabel="Generate email"
        activityTitle={(v) => v["purpose"] || "Email draft"}
      />
    </AppShell>
  );
}
