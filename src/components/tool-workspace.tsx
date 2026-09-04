import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { PageHeader } from "@/components/page-header";
import { ResultPanel } from "@/components/result-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActivity } from "@/lib/activity";
import { generateWithTool } from "@/lib/ai.functions";
import type { ToolMeta } from "@/lib/tools";

export type Field =
  | { name: string; label: string; type: "text"; placeholder?: string; defaultValue: string }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      defaultValue: string;
      rows?: number;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: string[];
      defaultValue: string;
    };

export function ToolWorkspace({
  tool,
  toolKey,
  fields,
  demoResult,
  demoMeta,
  submitLabel,
  activityTitle,
}: {
  tool: ToolMeta;
  toolKey: "email" | "meeting" | "tasks" | "research";
  fields: Field[];
  demoResult: string;
  demoMeta: string;
  submitLabel: string;
  activityTitle: (values: Record<string, string>) => string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])),
  );
  const [result, setResult] = useState(demoResult);
  const [meta, setMeta] = useState<string | undefined>(demoMeta);
  const [loading, setLoading] = useState(false);
  const generate = useServerFn(generateWithTool);
  const { log } = useActivity();

  const set = (name: string, v: string) => setValues((prev) => ({ ...prev, [name]: v }));

  const run = async () => {
    setLoading(true);
    setMeta(undefined);
    try {
      const res = await generate({ data: { tool: toolKey, fields: values } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setResult(res.text);
      const words = res.text.trim().split(/\s+/).length;
      log({
        tool: tool.id,
        title: activityTitle(values),
        detail: `${tool.short} · ${words} words`,
        words,
      });
      toast.success("Result ready — review before sending");
    } catch {
      toast.error("Something went wrong generating that. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader icon={tool.icon} title={tool.name} description={tool.description} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section className="panel h-fit p-5">
          <h2 className="text-sm font-semibold">Inputs</h2>
          <p className="mb-5 mt-0.5 text-[11px] text-muted-foreground">
            Pre-filled with a realistic example — edit anything.
          </p>

          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label htmlFor={f.name} className="text-xs text-muted-foreground">
                  {f.label}
                </Label>
                {f.type === "text" ? (
                  <Input
                    id={f.name}
                    value={values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                ) : f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    rows={f.rows ?? 6}
                    value={values[f.name] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => set(f.name, e.target.value)}
                    className="resize-y leading-relaxed"
                  />
                ) : (
                  <Select value={values[f.name]} onValueChange={(v) => set(f.name, v)}>
                    <SelectTrigger id={f.name}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          <Button variant="neon" size="lg" className="mt-6 w-full" onClick={run} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> {submitLabel}
              </>
            )}
          </Button>
        </section>

        <ResultPanel
          value={result}
          onChange={setResult}
          onRegenerate={run}
          loading={loading}
          filename={`flow-ai-${toolKey}`}
          meta={meta}
        />
      </div>
    </>
  );
}
