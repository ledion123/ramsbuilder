import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { scope, availableTrades } = await req.json() as {
    scope: string;
    availableTrades: string[];
  };

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ trades: [], error: "no_api_key" });
  }

  if (!scope?.trim() || !availableTrades?.length) {
    return NextResponse.json({ trades: [] });
  }

  try {
    const { orClient } = await import("@/lib/openrouterClient");

    const response = await orClient.chat.completions.create({
      model: "minimax/minimax-01",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: "You are a UK construction safety assistant. Return only valid JSON — no preamble, no markdown.",
        },
        {
          role: "user",
          content: `From the available trade activities list below, select only those that are relevant to this scope of works. Return a JSON array of exact trade names copied verbatim from the list. No other text.

Scope of works:
${scope.trim()}

Available trades (select from these only):
${availableTrades.join("\n")}`,
        },
      ],
    });

    const raw = (response.choices[0]?.message?.content ?? "").trim();
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed: unknown = JSON.parse(cleaned);

    if (!Array.isArray(parsed)) return NextResponse.json({ trades: [] });

    // Guard: only return exact matches from the provided list
    const tradeSet = new Set(availableTrades);
    const trades = (parsed as unknown[])
      .filter((t): t is string => typeof t === "string" && tradeSet.has(t));

    return NextResponse.json({ trades });
  } catch (err) {
    console.error("suggest-trades error:", err);
    return NextResponse.json({ trades: [], error: "parse_error" });
  }
}
