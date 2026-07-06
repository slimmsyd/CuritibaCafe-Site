import "server-only";

import type { CafeIntent } from "./cafe-knowledge";

const VALID_INTENTS: CafeIntent[] = [
  "hours",
  "location",
  "menu",
  "events",
  "artists",
  "greeting",
  "newsletter",
  "unknown",
];

const SYSTEM_PROMPT = `You classify guest questions for Curitiba Art Café, a coffee shop in Fredericksburg, VA.
Return JSON only: {"intent":"<one of: hours, location, menu, events, artists, greeting, newsletter, unknown>"}
- hours: opening times, when open/closed, schedule
- location: address, directions, where to find us, parking
- menu: drinks, food, cones, coffee, cocktails, what's served
- events: cuppings, classes, listening nights, RSVPs
- artists: artist shelf, makers, ceramics, prints
- greeting: hi, hello, casual opener with no real question
- newsletter: email list, subscribe
- unknown: anything else`;

type DeepSeekResponse = {
  choices?: { message?: { content?: string } }[];
};

export async function classifyIntentWithDeepSeek(
  query: string,
): Promise<CafeIntent | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    }),
  });

  if (!res.ok) {
    console.error("[chat] DeepSeek error", res.status, await res.text());
    return null;
  }

  const data = (await res.json()) as DeepSeekResponse;
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { intent?: string };
    const intent = parsed.intent as CafeIntent;
    return VALID_INTENTS.includes(intent) ? intent : "unknown";
  } catch {
    console.error("[chat] DeepSeek JSON parse failed", raw);
    return null;
  }
}