import Anthropic from "@anthropic-ai/sdk";
import { ramsSystemPrompt } from "@/prompts/ramsSystemPrompt";
import type { RAMSInput, RAMSDocument } from "./types";
import { generateFromTemplate } from "./generateFromTemplate";

const client = new Anthropic();

export async function generateFromClaude(input: RAMSInput): Promise<RAMSDocument> {
  const userMessage = JSON.stringify(
    {
      company_name: input.company_name,
      company_address: input.company_address,
      company_reg: input.company_reg ?? "",
      company_phone: input.company_phone ?? "",
      company_email: input.company_email ?? "",
      company_logo: input.company_logo ? "[LOGO PROVIDED]" : undefined,
      project_name: input.project_name,
      site_address: input.site_address,
      principal_contractor: input.principal_contractor,
      po_reference: input.po_reference ?? "",
      activity: input.activity,
      working_hours: input.working_hours ?? "",
      plant_and_equipment: input.plant_and_equipment.map((p) => p.item),
      operatives: input.operatives,
      supervisor: input.supervisor,
      first_aider_name: input.first_aider_name ?? "",
      welfare_arrangements: input.welfare_arrangements ?? "",
      start_date: input.start_date,
      duration: input.duration,
      revision: input.revision ?? "Rev 0",
      nearest_hospital: input.nearest_hospital,
      emergency_contact: input.emergency_contact,
      prepared_by: input.prepared_by,
      prepared_by_position: input.prepared_by_position,
      approved_by: input.approved_by ?? "",
      approved_by_position: input.approved_by_position ?? "",
      el_insurance: input.el_insurance ?? "",
      revision_description: input.revision_description ?? "",
      additional_hazards: input.additional_hazards ?? "",
      industry_type: input.industry_type ?? "General Construction",
      selected_trades: input.selected_trades ?? [],
    },
    null,
    2
  );

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    system: ramsSystemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content block");
  }
  const cleaned = textBlock.text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as RAMSDocument;
  } catch (err) {
    console.error("[generateFromClaude] JSON parse failed, falling back to template:", err);
    console.error("[generateFromClaude] raw response:", textBlock.text.slice(0, 500));
    return generateFromTemplate(input);
  }
}
