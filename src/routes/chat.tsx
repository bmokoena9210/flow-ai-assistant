import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, SendHorizonal, Sparkles, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithFlow } from "@/lib/ai.functions";
import { AI_DISCLAIMER, TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Flow AI" },
      {
        name: "description",
        content:
          "A conversational AI assistant for everyday work: tricky messages, planning questions and quick thinking partners.",
      },
      { property: "og:title", content: "AI Workplace Chat — Flow AI" },
      {
        property: "og:description",
        content: "Ask Flow AI anything about your workday and get a practical answer.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const DEMO: Msg[] = [
  {
    role: "assistant",
    content:
      "Hi Bathabile — I'm Flow AI. I can help you word a difficult message, think through a decision, prep for a meeting or unblock a task. What are you working on?",
  },
  {
    role: "user",
    content:
      "I need to tell a client we're going to miss Friday's delivery by about a week. How do I say it without losing trust?",
  },
  {
    role: "assistant",
    content: `Lead with the news, not the excuse — clients lose trust from feeling managed, not from delays.

A structure that works:
- State the new date up front: "Delivery moves from Friday the 12th to Friday the 19th."
- Give one honest sentence of cause, no blame chain.
- Show what you've already done about it.
- Offer something concrete: a partial delivery, a preview build, or a standing check-in until it lands.
- Close by inviting a call, so they can react to a person rather than an inbox.

One caution: only commit to the 19th if you'd bet on it. A second slip costs far more than the first. If confidence is under 80%, say "the 19th, and I'll confirm on Tuesday."

Want me to draft the actual email?`,
  },
];

const SUGGESTIONS = [
  "Help me push back on an unrealistic deadline",
  "Draft an agenda for a 30-minute team retro",
  "How do I give critical feedback to a peer?",
  "Summarise this week's priorities into three lines",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(DEMO);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const send = useServerFn(chatWithFlow);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await send({ data: { messages: next.slice(-12) } });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch {
      toast.error("Couldn't reach Flow AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={TOOLS[4]!.icon}
        title={TOOLS[4]!.name}
        description={TOOLS[4]!.description}
        action={
          <Button variant="subtle" size="sm" onClick={() => setMessages(DEMO.slice(0, 1))}>
            <Trash2 className="size-3.5" /> New conversation
          </Button>
        }
      />

      <div className="panel flex h-[calc(100vh-19rem)] min-h-[480px] flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 scrollbar-slim md:px-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" ? (
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-neon-soft text-neon">
                  <Sparkles className="size-4" />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[72%]",
                  m.role === "user"
                    ? "rounded-br-md bg-neon text-primary-foreground"
                    : "rounded-bl-md border border-border bg-surface-2/70",
                )}
              >
                {m.content}
              </div>
              {m.role === "user" ? (
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground">
                  <User className="size-4" />
                </span>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-neon-soft text-neon">
                <Sparkles className="size-4" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-surface-2/70 px-4 py-4">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1.5 animate-bounce rounded-full bg-neon"
                    style={{ animationDelay: `${d * 140}ms` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-surface/60 px-4 py-4 md:px-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                disabled={loading}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] text-muted-foreground transition-all hover:border-ring hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Ask Flow AI about anything on your plate…"
              className="max-h-32 min-h-11 resize-none py-3"
            />
            <Button type="submit" variant="neon" size="lg" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="mt-2.5 text-[11px] text-muted-foreground">{AI_DISCLAIMER}</p>
        </div>
      </div>
    </AppShell>
  );
}
