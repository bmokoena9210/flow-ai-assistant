import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const ToolInput = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research"]),
  fields: z.record(z.string()),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

const BASE_STYLE =
  "You are Flow AI, a workplace productivity assistant. Write in clean, scannable markdown-free plain text using short headings in CAPS, hyphen bullets and blank lines between sections. Never mention that you are an AI model. Be concrete, professional and concise.";

function buildPrompt(tool: string, f: Record<string, string>) {
  switch (tool) {
    case "email":
      return {
        system: `${BASE_STYLE} You draft professional workplace emails with a subject line, greeting, body and sign-off.`,
        prompt: [
          `Audience: ${f["audience"] || "colleague"}`,
          `Purpose: ${f["purpose"] || "general update"}`,
          `Tone: ${f["tone"] || "professional"}`,
          `Length: ${f["length"] || "medium"}`,
          `Context and key points: ${f["context"] || "n/a"}`,
          "",
          "Write the email. Start with 'SUBJECT: ' on the first line.",
        ].join("\n"),
      };
    case "meeting":
      return {
        system: `${BASE_STYLE} You convert raw meeting notes into an executive-quality recap.`,
        prompt: [
          `Meeting title: ${f["title"] || "Team meeting"}`,
          `Attendees: ${f["attendees"] || "not specified"}`,
          `Raw notes / transcript:`,
          f["notes"] || "",
          "",
          "Return these sections in order: SUMMARY, KEY POINTS, DECISIONS, ACTION ITEMS (owner - task - deadline), DEADLINES, RISKS / OPEN QUESTIONS.",
        ].join("\n"),
      };
    case "tasks":
      return {
        system: `${BASE_STYLE} You are a pragmatic prioritisation and scheduling coach.`,
        prompt: [
          `Available working hours today: ${f["hours"] || "8"}`,
          `Working style: ${f["style"] || "balanced"}`,
          `Tasks (one per line, may include deadlines):`,
          f["tasks"] || "",
          "",
          "Return: PRIORITISED TASKS (ranked, each with priority level, estimated effort and one-line rationale), SUGGESTED SCHEDULE (time-blocked from the start of the workday), DEFER OR DELEGATE, FOCUS TIP.",
        ].join("\n"),
      };
    case "research":
      return {
        system: `${BASE_STYLE} You are a business research analyst producing decision-ready briefs.`,
        prompt: [
          `Research topic: ${f["topic"] || ""}`,
          `Industry / context: ${f["industry"] || "general business"}`,
          `Depth: ${f["depth"] || "standard"}`,
          `Specific questions: ${f["questions"] || "none"}`,
          "",
          "Return: EXECUTIVE SUMMARY, KEY INSIGHTS, MARKET / CONTEXT, OPPORTUNITIES, RISKS, RECOMMENDATIONS (numbered, actionable), NEXT STEPS. Flag anything that needs verification.",
        ].join("\n"),
      };
    default:
      return { system: BASE_STYLE, prompt: "" };
  }
}

async function run(system: string, prompt: string, messages?: { role: "user" | "assistant"; content: string }[]) {
  const { getGatewayModel } = await import("./ai-gateway.server");
  try {
    const result = streamText(
      messages
        ? { model: getGatewayModel(), system, messages }
        : { model: getGatewayModel(), system, prompt },
    );
    return { ok: true as const, text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ?? (error as { status?: number })?.status;
    const message =
      status === 429
        ? "Flow AI is rate limited right now. Please try again in a moment."
        : status === 402
          ? "AI credits for this workspace are exhausted. Add credits to keep generating."
          : status === 403
            ? "AI access is currently blocked for this workspace."
            : error instanceof Error
              ? error.message
              : "Generation failed.";
    return { ok: false as const, error: message };
  }
}

export const generateWithTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildPrompt(data.tool, data.fields);
    return run(system, prompt);
  });

export const chatWithFlow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    return run(
      `${BASE_STYLE} You are chatting with a colleague. Keep replies conversational and under 250 words unless asked for more. Offer next steps when useful.`,
      "",
      data.messages,
    );
  });
