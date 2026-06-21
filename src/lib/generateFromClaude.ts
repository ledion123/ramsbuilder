import Anthropic from "@anthropic-ai/sdk";
import { ramsSystemPrompt } from "@/prompts/ramsSystemPrompt";
import type { RAMSInput, RAMSDocument } from "./types";

const client = new Anthropic();

export async function generateFromClaude(input: RAMSInput): Promise<RAMSDocument> {
  const userMessage = JSON.stringify(
    {
      company_name: input.company_name,
      company_address: input.company_address,
      company_reg: input.company_reg ?? "",
      company_phone: input.company_phone ?? "",
      company_email: input.company_email ?? "",
      project_name: input.project_name,
      site_address: input.site_address,
      principal_contractor: input.principal_contractor,
      activity: input.activity,
      plant_and_equipment: input.plant_and_equipment.map((p) => p.item),
      operatives: input.operatives,
      supervisor: input.supervisor,
      start_date: input.start_date,
      duration: input.duration,
      revision: input.revision ?? "Rev 0",
      nearest_hospital: input.nearest_hospital ?? "",
      emergency_contact: input.emergency_contact ?? "",
      prepared_by: input.prepared_by ?? "",
      prepared_by_position: input.prepared_by_position ?? "",
      additional_hazards: input.additional_hazards ?? "",
      industry_type: input.industry_type ?? "General Construction",
      selected_trades: input.selected_trades ?? [],
    },
    null,
    2
  );

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: ramsSystemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as RAMSDocument;
}
