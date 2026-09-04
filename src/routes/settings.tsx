import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_DISCLAIMER } from "@/lib/tools";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Flow AI" },
      {
        name: "description",
        content:
          "Manage your Flow AI profile, default tone, workspace preferences and responsible-AI review controls.",
      },
      { property: "og:title", content: "Settings — Flow AI" },
      {
        property: "og:description",
        content: "Profile, defaults and responsible-AI controls for your workspace.",
      },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5 md:p-6">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function ToggleRow({
  label,
  hint,
  defaultOn,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Tune how Flow AI writes for you and how much review it asks for."
        action={
          <Button variant="neon" size="sm" onClick={() => toast.success("Preferences saved")}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Profile" description="Used to sign off generated emails and documents.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs text-muted-foreground">
                Full name
              </Label>
              <Input id="name" defaultValue="Bathabile Mokoena" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs text-muted-foreground">
                Job title
              </Label>
              <Input id="role" defaultValue="Operations Lead" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Work email
              </Label>
              <Input id="email" type="email" defaultValue="bathabile@flowai.work" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company" className="text-xs text-muted-foreground">
                Company
              </Label>
              <Input id="company" defaultValue="Northbridge Logistics" />
            </div>
          </div>
        </Section>

        <Section title="AI defaults" description="Applied to every new generation.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Default tone</Label>
              <Select defaultValue="Professional">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Direct", "Formal"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Default length</Label>
              <Select defaultValue="Medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Language</Label>
              <Select defaultValue="English (South Africa)">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["English (South Africa)", "English (US)", "English (UK)"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <ToggleRow
            label="Save generations to activity history"
            hint="Keeps a local record of everything you generate so you can reopen it later."
            defaultOn
          />
        </Section>

        <Section
          title="Responsible AI"
          description="Guardrails that keep a human in the loop."
        >
          <div className="rounded-xl border border-border bg-neon-soft p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-neon">
              <ShieldCheck className="size-4" /> Human review
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              {AI_DISCLAIMER} Flow AI never sends messages on your behalf — every result stays
              editable until you copy or export it.
            </p>
          </div>
          <ToggleRow
            label="Show review reminder on every result"
            hint="Displays the human-review notice above each generated output."
            defaultOn
          />
          <ToggleRow
            label="Flag low-confidence claims"
            hint="Marks statements in research briefs that should be verified with a primary source."
            defaultOn
          />
          <ToggleRow
            label="Allow AI to reference past generations"
            hint="Improves consistency of tone across your documents."
          />
        </Section>

        <Section title="Notifications" description="How Flow AI keeps you informed.">
          <ToggleRow
            label="Daily priority digest"
            hint="A short plan in your inbox each morning at 07:30."
            defaultOn
          />
          <ToggleRow
            label="Meeting recap ready"
            hint="Notify me as soon as a summary finishes generating."
            defaultOn
          />
          <ToggleRow
            label="Weekly productivity report"
            hint="Hours saved, generations and tool usage every Friday."
          />
          <ToggleRow label="Product updates" hint="New tools and improvements, roughly monthly." />
        </Section>
      </div>
    </AppShell>
  );
}
