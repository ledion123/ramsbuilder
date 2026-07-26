import { z } from "zod";

export const HazardSchema = z.object({
  id: z.string(),
  hazard: z.string(),
  description: z.string(),
  who_at_risk: z.string(),
  likelihood_pre: z.number(),
  severity_pre: z.number(),
  risk_score_pre: z.number(),
  risk_level_pre: z.enum(["Low", "Medium", "High"]),
  control_measures: z.array(z.string()),
  likelihood_post: z.number(),
  severity_post: z.number(),
  risk_score_post: z.number(),
  risk_level_post: z.enum(["Low", "Medium", "High"]),
  legislation_ref: z.string(),
});

export const LegislationRefSchema = z.object({
  regulation: z.string(),
  relevance: z.string(),
});

export const MethodStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
});

export const PlantItemSchema = z.object({
  item: z.string(),
  requirement: z.string(),
});

export const COSHHItemSchema = z.object({
  substance: z.string(),
  risk: z.string(),
  control: z.string(),
  regulation: z.string(),
});

export const TradePackSchema = z.object({
  schema_version: z.literal(1),
  id: z.string(),
  trade_name: z.string(),
  trigger_keywords: z.array(z.string()),
  hazards: z.array(HazardSchema),
  legislation: z.array(LegislationRefSchema),
  method_steps: z.array(MethodStepSchema),
  plant: z.array(PlantItemSchema),
  coshh: z.array(COSHHItemSchema),
  competency: z.array(z.string()),
  emergency_procedures: z.record(z.string(), z.string()),
});

export type HazardRecord = z.infer<typeof HazardSchema>;
export type TradePack = z.infer<typeof TradePackSchema>;
