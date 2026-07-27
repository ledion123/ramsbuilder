import type { RAMSInput } from "./types";

export function fillRequiredDefaults(partial: Partial<RAMSInput>): RAMSInput {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayFormatted = `${dd}/${mm}/${yyyy}`;

  // Use today as ISO for start_date field (form uses YYYY-MM-DD)
  const startDateISO = `${yyyy}-${mm}-${dd}`;

  const activity = partial.activity ?? "";

  return {
    company_name: partial.company_name ?? "To be confirmed",
    company_address: partial.company_address ?? "To be confirmed",
    company_reg: partial.company_reg,
    company_phone: partial.company_phone,
    company_email: partial.company_email,
    project_name: partial.project_name ?? (activity ? activity.split(/[.,]/)[0].trim().slice(0, 60) : "Site Works"),
    site_address: partial.site_address ?? "To be confirmed — see scope document",
    principal_contractor: partial.principal_contractor ?? "To be confirmed on induction",
    po_reference: partial.po_reference,
    activity: activity || "General construction works — see scope document",
    working_hours: partial.working_hours,
    plant_and_equipment: partial.plant_and_equipment?.length
      ? partial.plant_and_equipment
      : [{ item: "To be confirmed — see scope document" }],
    operatives: partial.operatives ?? "To be confirmed",
    supervisor: partial.supervisor ?? "To be confirmed",
    first_aider_name: partial.first_aider_name,
    welfare_arrangements: partial.welfare_arrangements,
    start_date: partial.start_date ?? startDateISO,
    duration: partial.duration ?? "To be confirmed",
    revision: partial.revision ?? "Rev 0",
    nearest_hospital: partial.nearest_hospital ?? "To be confirmed — check www.nhs.uk/service-search",
    emergency_contact: partial.emergency_contact ?? "999 (Police / Fire / Ambulance)",
    prepared_by: partial.prepared_by ?? "To be confirmed",
    prepared_by_position: partial.prepared_by_position ?? "Health & Safety Coordinator",
    approved_by: partial.approved_by,
    approved_by_position: partial.approved_by_position,
    el_insurance: partial.el_insurance,
    revision_description: partial.revision_description ?? `AI Express — generated ${todayFormatted}`,
    excavation_depth_m: partial.excavation_depth_m,
    confined_space_entry: partial.confined_space_entry,
    additional_hazards: partial.additional_hazards,
    selected_trades: partial.selected_trades,
    industry_type: partial.industry_type,
  };
}
