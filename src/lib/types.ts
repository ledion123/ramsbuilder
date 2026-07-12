export interface RAMSInput {
  company_name: string;
  company_address: string;
  company_reg?: string;
  company_phone?: string;
  company_email?: string;
  company_logo?: string;        // base64 data URI
  project_name: string;
  site_address: string;
  principal_contractor: string;
  po_reference?: string;        // PO / contract ref
  activity: string;
  working_hours?: string;       // e.g. "07:30–17:30 Mon–Fri"
  plant_and_equipment: Array<{ item: string }>;
  operatives: string;
  supervisor: string;
  first_aider_name?: string;
  welfare_arrangements?: string;
  start_date: string;
  duration: string;
  revision?: string;
  nearest_hospital: string;
  emergency_contact: string;
  prepared_by: string;
  prepared_by_position: string;
  approved_by?: string;
  approved_by_position?: string;
  el_insurance?: string;        // Employers' liability policy ref
  revision_description?: string;
  additional_hazards?: string;
  selected_trades?: string[];
  industry_type?: string;
}

export interface LegislationRef {
  regulation: string;
  relevance: string;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskAssessmentItem {
  ref: string;
  hazard: string;
  description: string;
  who_at_risk: string;
  likelihood_pre: number;
  severity_pre: number;
  risk_score_pre: number;
  risk_level_pre: RiskLevel;
  control_measures: string[];
  likelihood_post: number;
  severity_post: number;
  risk_score_post: number;
  risk_level_post: RiskLevel;
  legislation_ref: string;
}

export interface MethodStep {
  step: number;
  title: string;
  description: string;
}

export interface PlantEquipmentItem {
  item: string;
  requirement: string;
}

export interface PPEItem {
  item: string;
  standard: string;
  mandatory: boolean;
}

export interface COSHHItem {
  substance: string;
  risk: string;
  control: string;
  regulation: string;
}

export interface HAVSTool {
  tool: string;
  vibration_level: string;
  daily_exposure_limit: string;
  control: string;
}

export interface NoiseSource {
  source: string;
  approximate_db: string;
  control: string;
}

export interface EmergencyProcedures {
  first_aid: string;
  emergency_contacts: string;
  nearest_hospital: string;
  evacuation: string;
  excavation_collapse?: string;
  confined_space_rescue?: string;
  gas_escape?: string;
  ohl_contact?: string;
}

export interface RAMSDocument {
  document_ref: string;
  revision: string;
  revision_description?: string;
  date: string;
  _source?: "ai" | "template";
  company: {
    name: string;
    address: string;
    reg?: string;
    phone?: string;
    email?: string;
    logo?: string;
  };
  project: {
    name: string;
    site_address: string;
    principal_contractor: string;
    supervisor: string;
    start_date: string;
    duration: string;
    po_reference?: string;
    working_hours?: string;
  };
  scope_of_works: string;
  detected_trades?: string[];
  legislation: LegislationRef[];
  risk_assessment: RiskAssessmentItem[];
  method_statement: {
    sequence_of_works: MethodStep[];
    plant_and_equipment: PlantEquipmentItem[];
    ppe_requirements: PPEItem[];
    supervision: string;
    emergency_procedures: EmergencyProcedures;
    environmental_controls: string[];
    coshh_substances: COSHHItem[];
    welfare_arrangements?: string;
  };
  havs_assessment: {
    applicable: boolean;
    tools: HAVSTool[];
  };
  noise_assessment: {
    applicable: boolean;
    sources: NoiseSource[];
  };
  sign_off: {
    prepared_by: string;
    position: string;
    date_prepared: string;
    review_date: string;
    approved_by?: string;
    approved_by_position?: string;
  };
}
