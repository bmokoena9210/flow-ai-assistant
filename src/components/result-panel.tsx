import { Check, Copy, Download, RefreshCw, Pencil, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AI_DISCLAIMER } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function ResultSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {[92, 78, 96, 64, 88, 72, 50].map((w, i) => (
        <div
          key={i}
          className="h-3.5 animate-pulse rounded-full bg-surface-2"
          style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

export function ResultPanel({
  value,
  onChange,
  onRegenerate,
  loading,
  filename,
  meta,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  loading?: boolean;
  filename: string;
  meta?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard unavailable in this browser");
    }
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <section className="panel flex min-h-[420px] flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">Result</h2>
          <p className="text-[11px] text-muted-foreground">
            {loading ? "Flow AI is writing…" : meta ? meta : `${words} words · editable`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing((e) => !e)}
            disabled={loading || !value}
          >
            {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={download} disabled={loading || !value}>
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={copy} disabled={loading || !value}>
            {copied ? (
              <Check className="size-3.5 text-neon" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span className="hidden sm:inline">Copy</span>
          </Button>
          {onRegenerate ? (
            <Button variant="neon" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <ResultSkeleton />
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-full min-h-[360px] resize-none rounded-none border-0 bg-transparent font-body text-sm leading-relaxed focus-visible:ring-0"
          />
        ) : (
          <pre className="h-full max-h-[560px] overflow-y-auto whitespace-pre-wrap px-5 py-4 font-body text-sm leading-relaxed scrollbar-slim">
            {value || "Your generated result will appear here."}
          </pre>
        )}
      </div>

      <footer className="border-t border-border px-5 py-3">
        <p className="text-[11px] text-muted-foreground">{AI_DISCLAIMER}</p>
      </footer>
    </section>
  );
}
