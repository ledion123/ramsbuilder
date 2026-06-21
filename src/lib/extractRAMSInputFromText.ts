import Anthropic from "@anthropic-ai/sdk";
import { scopeExtractionPrompt } from "@/prompts/scopeExtractionPrompt";
import type { RAMSInput } from "./types";

const client = new Anthropic();

export async function extractRAMSInputFromText(
  text: string
): Promise<{ data: Partial<RAMSInput>; warnings: string[] }> {
  const warnings: string[] = [];

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: scopeExtractionPrompt,
    messages: [{ role: "user", content: text }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: Partial<RAMSInput> = {};
  try {
    parsed = JSON.parse(cleaned) as Partial<RAMSInput>;
  } catch {
    warnings.push("Could not parse extraction response — please fill in the form manually.");
    return { data: {}, warnings };
  }

  // Validate start_date is YYYY-MM-DD
  if (parsed.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(parsed.start_date)) {
    warnings.push(`Start date "${parsed.start_date}" could not be parsed — please enter it manually.`);
    delete parsed.start_date;
  }

  // Ensure plant_and_equipment is the correct shape
  if (parsed.plant_and_equipment) {
    const items = parsed.plant_and_equipment;
    if (
      !Array.isArray(items) ||
      items.some((i) => typeof i !== "object" || typeof (i as { item?: unknown }).item !== "string")
    ) {
      warnings.push("Plant & equipment list could not be parsed — please review Step 3.");
      delete parsed.plant_and_equipment;
    }
  }

  // Strip empty string fields — only keep fields with real values
  for (const key of Object.keys(parsed) as (keyof RAMSInput)[]) {
    const val = parsed[key];
    if (val === "" || val === null || val === undefined) {
      delete parsed[key];
    }
  }

  if (Object.keys(parsed).length === 0) {
    warnings.push("No work details could be extracted from this document. Please fill in the form manually.");
  }

  return { data: parsed, warnings };
}
