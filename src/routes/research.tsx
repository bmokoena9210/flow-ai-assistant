import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { ToolWorkspace, type Field } from "@/components/tool-workspace";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Flow AI" },
      {
        name: "description",
        content:
          "Generate structured business insights, opportunities, risks and recommendations from any research topic.",
      },
      { property: "og:title", content: "AI Research Assistant — Flow AI" },
      {
        property: "og:description",
        content: "Decision-ready briefs from a single research prompt.",
      },
    ],
  }),
  component: ResearchPage,
});

const FIELDS: Field[] = [
  {
    name: "topic",
    label: "Research topic",
    type: "text",
    defaultValue: "AI adoption among mid-market logistics operators",
  },
  {
    name: "industry",
    label: "Industry / context",
    type: "text",
    defaultValue: "B2B SaaS selling into supply chain and freight",
  },
  {
    name: "depth",
    label: "Depth",
    type: "select",
    options: ["Quick scan", "Standard brief", "Deep analysis"],
    defaultValue: "Standard brief",
  },
  {
    name: "questions",
    label: "Specific questions",
    type: "textarea",
    rows: 6,
    defaultValue:
      "- Where is the strongest willingness to pay?\n- What objections block adoption today?\n- Which use case should we lead with in sales conversations?",
  },
];

const DEMO = `EXECUTIVE SUMMARY
Mid-market logistics operators are past the curiosity phase on AI but stuck at operationalisation. Interest is concentrated in a narrow band of high-friction, high-volume workflows — documentation handling, exception management and customer status enquiries — rather than in broad "AI transformation". The realistic wedge is a single painful workflow with measurable hours saved, priced per seat or per shipment, and provable inside 30 days.

KEY INSIGHTS
- Budget authority sits with operations, not IT. Deals close faster when framed as capacity recovery instead of technology adoption.
- Data readiness is the dominant blocker: most operators hold shipment data across a TMS, spreadsheets and email threads.
- Exception handling is the highest-pain workflow — a single delayed shipment can trigger 6–10 manual touchpoints.
- Trust is earned through auditability. Buyers expect to see the source of every AI-generated answer.
- Procurement cycles run 6–14 weeks, dominated by security review rather than pricing negotiation.

MARKET / CONTEXT
Mid-market operators (50–500 employees) are squeezed between enterprise competitors with in-house data teams and small brokers competing on price. They cannot fund custom builds, which makes packaged, workflow-specific AI attractive — but only where it plugs into the systems they already run.

OPPORTUNITIES
- Lead with an exception-management copilot: detect at-risk shipments, draft the customer update, log the resolution.
- Position document intelligence (bills of lading, customs paperwork) as the low-risk entry product.
- Offer an ROI pilot: 30 days, one lane or one customer account, hours-saved reporting built in.
- Partner with TMS vendors for distribution rather than competing for the system of record.

RISKS
- Accuracy failures in customer-facing messages carry disproportionate reputational cost.
- Pilots stall when the champion leaves or gets pulled into peak season.
- Data-integration effort can consume margin if not templated per TMS.
- Regulatory scrutiny on automated customs documentation varies by corridor — verify per market.

RECOMMENDATIONS
1. Choose exception management as the flagship use case and build the demo around a real delayed-shipment scenario.
2. Package a fixed-scope 30-day paid pilot with an hours-saved dashboard as the primary success metric.
3. Ship human-in-the-loop approval on every customer-facing message; make review visible, not optional.
4. Build three TMS connectors first and treat everything else as CSV import.
5. Price per active shipment for alignment with seasonal volume, with a seat-based floor.
6. Produce a security and data-handling pack up front to compress the procurement cycle.

NEXT STEPS
- Validate the exception-management hypothesis with 8–10 operator interviews in the next three weeks.
- Confirm current TMS market share in your target region — treat all market-size figures here as directional and verify with primary sources.
- Draft the pilot commercial terms and the ROI reporting template before the next sales cycle.`;

function ResearchPage() {
  return (
    <AppShell>
      <ToolWorkspace
        tool={TOOLS[3]!}
        toolKey="research"
        fields={FIELDS}
        demoResult={DEMO}
        demoMeta="Sample brief · 6 recommendations · editable"
        submitLabel="Generate research brief"
        activityTitle={(v) => v["topic"] || "Research brief"}
      />
    </AppShell>
  );
}
