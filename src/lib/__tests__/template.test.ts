import { describe, it, expect } from "vitest";
import { generateFromTemplate } from "../generateFromTemplate";
import type { RAMSInput } from "../types";

const base: RAMSInput = {
  company_name: "Test Co Ltd",
  company_address: "1 Test Street, London",
  project_name: "Test Project",
  site_address: "Site Road, London",
  principal_contractor: "Main Contractor Ltd",
  activity: "General site works",
  plant_and_equipment: [],
  operatives: "2 operatives",
  supervisor: "J Smith",
  start_date: "2026-08-01",
  duration: "2 weeks",
  nearest_hospital: "Royal London Hospital",
  emergency_contact: "07700 900000",
  prepared_by: "J Smith",
  prepared_by_position: "Site Manager",
};

describe("extractDepth (via template generation)", () => {
  it("returns 2.5, not 30, when activity says '2.5m deep' and '30m intervals'", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "Excavation up to 2.5m deep in soft ground. Precast concrete manholes at approx. 30m intervals.",
    });
    expect(doc.scope_of_works).not.toMatch(/30[\s.]*m depth/i);
    // Confined space hazard row should not claim 30m depth
    const csRow = doc.risk_assessment.find((r) => r.hazard.toLowerCase().includes("confined"));
    if (csRow) {
      expect(csRow.description).not.toMatch(/30(?:\.\d+)?\s*m depth/i);
    }
  });
});

describe("confined space detection", () => {
  it("fires for 'enter existing manhole to connect pipework' even at depth 0", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "Enter existing manhole to connect pipework and test drainage.",
      excavation_depth_m: undefined,
    });
    const hasConfinedSpaceRow = doc.risk_assessment.some(
      (r) => r.hazard.toLowerCase().includes("confined") || r.hazard.toLowerCase().includes("manhole")
    );
    expect(hasConfinedSpaceRow).toBe(true);
  });

  it("fires when excavation_depth_m = 2.0 even if activity text has no 'deep'", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "Lay foul drainage pipes and backfill trench with granular material.",
      excavation_depth_m: 2.0,
    });
    const csRow = doc.risk_assessment.find((r) => r.hazard.toLowerCase().includes("confined"));
    expect(csRow).toBeDefined();
  });

  it("fires when confined_space_entry checkbox is true regardless of depth", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "Install ducting in existing chamber.",
      excavation_depth_m: 0,
      confined_space_entry: true,
    });
    const csRow = doc.risk_assessment.find((r) => r.hazard.toLowerCase().includes("confined"));
    expect(csRow).toBeDefined();
  });
});

describe("field mapping integrity", () => {
  it("scope stays in scope — no leakage into hospital/name/contact fields", () => {
    const doc = generateFromTemplate({
      ...base,
      company_name: "SENTINEL_COMPANY",
      activity: "SENTINEL_ACTIVITY general excavation for drainage",
      nearest_hospital: "SENTINEL_HOSPITAL",
      emergency_contact: "SENTINEL_EMERGENCY",
      prepared_by: "SENTINEL_PREPAREDBY",
      prepared_by_position: "SENTINEL_POSITION",
      approved_by: "SENTINEL_APPROVEDBY",
    });
    expect(doc.scope_of_works).not.toMatch(/SENTINEL_HOSPITAL|SENTINEL_PREPAREDBY|SENTINEL_APPROVEDBY/);
    expect(doc.method_statement.emergency_procedures.nearest_hospital).toContain("SENTINEL_HOSPITAL");
    expect(doc.sign_off.prepared_by).toContain("SENTINEL_PREPAREDBY");
    expect(doc.sign_off.position).toContain("SENTINEL_POSITION");
    // scope must not contain itself nested more than once
    expect((doc.scope_of_works.match(/SENTINEL_ACTIVITY/g) ?? []).length).toBe(1);
  });
});

describe("hazard row L×S integrity", () => {
  it("risk_score_pre = likelihood_pre × severity_pre for all rows", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "General excavation for drainage installation",
    });
    for (const row of doc.risk_assessment) {
      expect(typeof row.likelihood_pre).toBe("number");
      expect(typeof row.severity_pre).toBe("number");
      expect(row.risk_score_pre).toBe(row.likelihood_pre * row.severity_pre);
      expect(row.risk_score_post).toBe(row.likelihood_post * row.severity_post);
    }
  });
});

describe("trade selection is authoritative (Fix 4)", () => {
  it("selecting only drainage + excavation trades produces no masonry or plumbing hazard rows", () => {
    const doc = generateFromTemplate({
      ...base,
      activity: "Excavation for foul drainage, lay pipework, install manholes, backfill and compact.",
      selected_trades: ["Foul Water Drainage Installation", "General Excavation (open cut)"],
      industry_type: "groundworks",
    });

    const hazardNames = doc.risk_assessment.map((r) => r.hazard.toLowerCase());

    // Masonry/building hazards should not appear
    const hasMasonry = hazardNames.some((h) => h.includes("masonry") || h.includes("brickwork") || h.includes("block laying"));
    expect(hasMasonry).toBe(false);

    // Boiler/heating/unvented hazards (plumbing trade) should not appear
    const hasPlumbing = hazardNames.some((h) => h.includes("boiler") || h.includes("unvented") || h.includes("legionella"));
    expect(hasPlumbing).toBe(false);
  });
});
