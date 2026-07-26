import type {
  RAMSInput,
  RAMSDocument,
  RiskAssessmentItem,
  MethodStep,
  PlantEquipmentItem,
  PPEItem,
  COSHHItem,
  HAVSTool,
  NoiseSource,
  LegislationRef,
} from "./types";
import { detectPacks } from "./packs/loadPacks";

function today(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function slugify(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "-").replace(/-+/g, "-").slice(0, 20);
}

function extractDepth(activity: string): number {
  const s = activity.toLowerCase();
  const found: number[] = [];

  // Pattern A: "1.8m deep" / "1.8 metres depth" / "2m below"
  for (const m of s.matchAll(/(\d+(?:\.\d+)?)\s*m(?:etre)?s?\s*(?:deep|depth|below)/gi)) {
    found.push(parseFloat(m[1]));
  }

  // Pattern B: "to 1.8m" / "to 2 m" — e.g. "excavation to 1.8m", "dig to 2m"
  for (const m of s.matchAll(/\bto\s+(\d+(?:\.\d+)?)\s*m(?:etre)?s?\b/gi)) {
    found.push(parseFloat(m[1]));
  }

  // Pattern C: standalone "Xm" when a depth-context word appears anywhere in the string
  // e.g. "2m trench", "excavate 1.5m"
  if (/excav|trench|dig\b|below|depth|deep/.test(s)) {
    for (const m of s.matchAll(/\b(\d+(?:\.\d+)?)\s*m(?:etre)?s?\b/gi)) {
      found.push(parseFloat(m[1]));
    }
  }

  return found.length ? Math.max(...found) : 0;
}

function detect(activity: string, ...terms: string[]): boolean {
  const lower = activity.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

export function generateFromTemplate(input: RAMSInput): RAMSDocument {
  const industry = (input.industry_type ?? "").toLowerCase();
  const trades = (input.selected_trades ?? []).join(" ").toLowerCase();
  const act = input.activity;
  const depth = extractDepth(act);

  // Detect from activity text + selected trades + industry
  const inAll = `${act} ${trades} ${industry}`;
  const isExcavation = detect(inAll, "excav", "trench", "dig", "drain", "sewer", "duct", "cable", "pipe", "culvert");
  const isConfinedSpace = isExcavation && depth >= 1.2;
  const isNearCarriageway = detect(inAll, "carriageway", "road", "highway", "live traffic", "traffic management", "footway");
  const hasConcrete = detect(inAll, "concret", "cement", "grout", "shutter", "pour", "foundation", "blinding");
  const hasBreaking = detect(inAll, "break", "jackhammer", "pneumatic", "hoe ram", "demolit");
  const hasCompaction = detect(inAll, "compact", "wacker", "plate", "vibrat", "roller");
  const hasPlant = input.plant_and_equipment.length > 0;

  // Industry-type flags
  const isElectrical  = industry === "electrical"  || detect(inAll, "electrical", "electric", "wiring", "cable install", "loto", "isolat");
  const isScaffolding = industry === "scaffolding" || detect(inAll, "scaffold", "tube and fitting", "system scaffold");
  const isRoofing     = industry === "roofing"     || detect(inAll, "roof", "flat roof", "pitched roof", "felt", "slate", "tile");
  const isPlumbing    = industry === "plumbing"    || detect(inAll, "plumb", "heating", "gas install", "boiler", "pipework", "unvented");
  const isDemolition  = industry === "demolition"  || detect(inAll, "demolit", "strip out", "soft strip", "asbestos");
  const isBuilding    = industry === "building"    || detect(inAll, "brickwork", "block", "masonry", "structural", "beam");
  const isME          = industry === "me"          || detect(inAll, "mechanical", "hvac", "ventilation", "air conditioning", "f-gas", "refrigerant");
  const isFitout      = industry === "fitout"      || detect(inAll, "fit out", "fit-out", "partition", "suspended ceiling", "fire door", "acoustic");
  const isGas         = isPlumbing && detect(inAll, "gas install", "gas safe", "mdpe", "purging", "gas commission");
  const gasPack = detectPacks(inAll, input.selected_trades ?? []).find((p) => p.id === "groundworks-gas");

  const docRef = `RAMS-${slugify(input.project_name)}-001`;
  const dateStr = today();
  const plantList = input.plant_and_equipment.map((p) => p.item);

  // ─── LEGISLATION ────────────────────────────────────────────────────────────
  const legislation: LegislationRef[] = [
    { regulation: "Health & Safety at Work Act 1974", relevance: "Overarching duty to ensure, so far as reasonably practicable, the health and safety of all persons at work and others affected by the works." },
    { regulation: "CDM Regulations 2015", relevance: "As a subcontractor, duties to cooperate with the Principal Contractor, comply with relevant parts of the Construction Phase Plan, and not endanger the health and safety of any person." },
    { regulation: "Management of Health and Safety at Work Regulations 1999", relevance: "Requirement to carry out suitable and sufficient risk assessment and implement appropriate control measures." },
    { regulation: "Manual Handling Operations Regulations 1992", relevance: "Applies to all manual handling activities on site. Where loads exceed 25 kg or are awkward in shape, mechanical handling aids or team lifts must be used." },
    { regulation: "Personal Protective Equipment at Work Regulations 1992", relevance: "Requires provision, maintenance, and use of appropriate PPE where risks cannot be adequately controlled by other means." },
    { regulation: "Noise at Work Regulations 2005", relevance: "Plant and breaking equipment used during these works will generate noise levels above the Lower Exposure Action Value of 80 dB(A)." },
    { regulation: "Control of Vibration at Work Regulations 2005", relevance: "Compaction plant and breaking equipment expose operatives to hand-arm vibration above the Exposure Action Value of 2.5 m/s²." },
    { regulation: "PUWER 1998", relevance: "All plant and equipment must be suitable for purpose, maintained in good condition, and operated only by competent, ticketed operatives." },
  ];

  if (isExcavation) {
    legislation.push({ regulation: "Electricity at Work Regulations 1989", relevance: "Risk of striking underground electrical services during excavation works." });
  }
  if (isElectrical) {
    legislation.push({ regulation: "Electricity at Work Regulations 1989", relevance: "All electrical work must be carried out by competent, qualified electricians. Systems must be made dead before work commences unless live working is unavoidable and controlled." });
    legislation.push({ regulation: "BS 7671:2018+A2:2022 (IET Wiring Regulations 18th Edition)", relevance: "All fixed electrical installations must be designed, installed, and tested in accordance with the current edition of the Wiring Regulations." });
  }
  if (isScaffolding) {
    legislation.push({ regulation: "Work at Height Regulations 2005", relevance: "Scaffold must be erected, altered, and dismantled by competent persons (CISRS card). All work at height must be properly planned and supervised." });
    legislation.push({ regulation: "NASC TG20:21 Technical Guidance", relevance: "Tube and fitting scaffold design and erection must comply with NASC TG20 or a bespoke design by a Temporary Works Engineer." });
  }
  if (isRoofing) {
    legislation.push({ regulation: "Work at Height Regulations 2005", relevance: "All roofing works require suitable edge protection (barriers or safety netting). Fragile surfaces must be identified and boards/crawling boards provided." });
    legislation.push({ regulation: "ACR[M]001:2019 — Test for Fragility of Roofing Assemblies", relevance: "Any fragile roof surface (profiled metal, fibre cement, glass, rooflights) must be treated as fragile; crawl boards and collective fall protection required." });
  }
  if (isPlumbing) {
    legislation.push({ regulation: "Water Supply (Water Fittings) Regulations 1999", relevance: "All plumbing installations must comply with Water Regulations and use WRAS-approved materials where applicable." });
  }
  if (gasPack) {
    for (const leg of gasPack.legislation) {
      legislation.push(leg);
    }
  }
  if (isDemolition) {
    legislation.push({ regulation: "Control of Asbestos Regulations 2012 (CAR 2012)", relevance: "A Type 3 asbestos refurbishment/demolition survey must be obtained before any demolition or strip-out works commence. All ACMs to be removed by licensed contractor before demolition." });
  }
  if (isBuilding || hasConcrete || hasBreaking) {
    legislation.push({ regulation: "Control of Substances Hazardous to Health Regulations 2002 (COSHH)", relevance: "Silica dust generated by cutting and breaking activities. Wet cutting methods and RPE (FFP3) mandatory. WEL: 0.1 mg/m³ (8-hr TWA)." });
  }
  if (isME) {
    legislation.push({ regulation: "F-Gas Regulations (SI 2022/1013)", relevance: "Work on refrigeration and air conditioning systems containing F-Gas refrigerants must be carried out by F-Gas certified engineers. Leakage checks required." });
    legislation.push({ regulation: "Pressure Systems Safety Regulations 2000 (PSSR)", relevance: "Pressurised systems must be operated within safe operating limits; Written Scheme of Examination required for statutory systems." });
  }
  if (isFitout) {
    legislation.push({ regulation: "Building Regulations 2010 — Part B (Fire Safety)", relevance: "Fire-stopping and compartmentation must be reinstated following any penetrations through fire-rated elements. Fire door installation to BS EN 16034 and BS 8214." });
    legislation.push({ regulation: "Regulatory Reform (Fire Safety) Order 2005", relevance: "Fire escape routes must be maintained throughout the fit-out works. All operatives to be briefed on fire escape routes before works commence." });
  }
  if (hasConcrete || hasBreaking) {
    legislation.push({ regulation: "COSHH 2002", relevance: "Cement and concrete works generate respirable crystalline silica dust and present risk of cement dermatitis. Diesel exhaust fumes from plant are also controlled substances." });
  }
  if (isConfinedSpace) {
    legislation.push({ regulation: "Confined Spaces Regulations 1997", relevance: `Excavation to ${depth}m depth constitutes a confined space requiring a permit-to-enter system, atmospheric monitoring, and a documented rescue plan.` });
  }
  if (isNearCarriageway) {
    legislation.push({ regulation: "Traffic Management Act 2004 / Chapter 8 of the Traffic Signs Manual", relevance: "Works adjacent to the live carriageway require a Traffic Management Plan and compliance with Chapter 8 signing, lighting, and guarding requirements." });
  }
  if (hasPlant) {
    legislation.push({ regulation: "LOLER 1998", relevance: "Any lifting operations using plant or lifting accessories require a documented Lifting Plan and pre-use LOLER inspection records." });
  }
  legislation.push({ regulation: "RIDDOR 2013", relevance: "Any accident resulting in a specified injury, over-7-day incapacitation, dangerous occurrence, or occupational disease must be reported to the HSE." });
  legislation.push({ regulation: "Environmental Protection Act 1990 / Controlled Waste Regulations", relevance: "Excavated arisings, surplus materials, and site waste must be managed and disposed of appropriately with a valid waste carrier licence." });

  // ─── RISK ASSESSMENT ────────────────────────────────────────────────────────
  const risks: RiskAssessmentItem[] = [];
  let raIdx = 1;
  const ra = (r: Omit<RiskAssessmentItem, "ref">) =>
    risks.push({ ref: `RA-${String(raIdx++).padStart(2, "0")}`, ...r });

  if (isExcavation) {
    ra({
      hazard: "Excavation collapse / side wall failure",
      description: `During excavation to ${depth > 0 ? depth + "m" : "the required"} depth, the side walls may collapse due to soil instability, ground water ingress, surcharging from adjacent plant or spoil heaps, or vibration from nearby traffic. Collapse can bury operatives working within the excavation, causing fatal crushing injuries.`,
      who_at_risk: "Operatives working in or adjacent to the excavation",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "Competent person to assess ground conditions and battering/shoring requirements before and throughout excavation.",
        `Excavate in maximum 1m stages; batter sides at minimum 1:1 in granular soils or install proprietary trench support (Mabey, Ultrashore or equivalent) prior to personnel entry at depths exceeding 1.2m.`,
        "No operatives to enter unsupported excavation exceeding 1.2m depth at any time.",
        "Spoil heaps to be set back minimum 1m from excavation edge; no plant to operate within 1.5m of unsupported excavation edge.",
        "Inspect excavation at start of each shift and following any rainfall, frost, or vibration event; record inspection in excavation register.",
        "Emergency rescue plan in place; operatives briefed on evacuation procedure before works commence.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "CDM Regulations 2015 / Work at Height Regulations 2005",
    });

    ra({
      hazard: "Buried services strike (gas, electric, water, telecoms)",
      description: `Underground services including gas mains, high and low voltage electrical cables, water mains, and telecoms ducts may be present within the excavation zone. A services strike during mechanical or hand excavation can cause explosion, electrocution, flooding, or telecoms outage, resulting in fatal or life-changing injuries to operatives and members of the public.`,
      who_at_risk: "Operatives, adjacent workers, members of the public",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "Obtain statutory undertakers' plans for all services within the works area before commencing excavation; review and mark up on site plan.",
        "Carry out CAT (Cable Avoidance Tool) and Genny survey of the entire excavation footprint before any mechanical dig; results to be recorded and reviewed by supervisor.",
        "Issue a 'Permit to Dig' for every excavation; no mechanical dig within 0.5m of any known or suspected service — hand dig only within this exclusion zone.",
        "All operatives to receive services awareness briefing before works commence; never assume services follow drawings exactly — treat any unidentified object as a live service.",
        "Ensure emergency contacts for all statutory undertakers are to hand on site at all times.",
        "If any service is struck: stop work, clear the area, notify statutory undertaker and PC immediately; do not recommence until declared safe.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Electricity at Work Regulations 1989 / Health & Safety at Work Act 1974",
    });

    ra({
      hazard: "Plant and pedestrian interface / collision",
      description: `360° excavator and ancillary plant operating within the site boundary creates a risk of collision with operatives on foot, members of the public, or adjacent workers. Risks are heightened when reversing, slewing, or moving in confined sites with limited visibility.`,
      who_at_risk: "Operatives, banksmen, members of the public, adjacent workers",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Establish and maintain a pedestrian exclusion zone of minimum 3m around operating plant; demarcate with hard barriers (Heras fencing or water-filled barriers), not soft tape.",
        "A trained banksman/slinger to be present during all manoeuvring and lifting operations; plant operator to maintain eye contact with banksman at all times.",
        "All plant to be fitted with working reversing alarms and rotating beacon; operatives to wear Class 2 minimum hi-vis at all times within the works area.",
        "No operative to enter the swing radius of the excavator without the operator's knowledge and a clear signal; plant engine to be shut down if work requires operative to be within 1m of machine.",
        "Traffic management and exclusion zone segregation reviewed daily by site supervisor.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "PUWER 1998 / CDM Regulations 2015",
    });

    ra({
      hazard: "Slips, trips and falls adjacent to or into the excavation",
      description: "The excavation edge, uneven spoil heaps, and site compound present a risk of operatives and others slipping, tripping, or falling into the open excavation, particularly in wet weather or poor light conditions.",
      who_at_risk: "Operatives, site visitors, members of the public",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "Install edge protection (minimum 950mm high barriers with toeboards) around all open excavations; trench covers or bridging plates to be used where crossing is required.",
        "Maintain good housekeeping; clear spoil, surplus materials, and tools from walkways at end of each shift.",
        "Adequate lighting to be provided for any works outside daylight hours.",
        "Access ladders to comply with Work at Height Regulations 2005; extend minimum 1m above excavation edge; secured top and bottom.",
        "Trench plates and covers to be provided over excavation when unattended; secured to prevent displacement.",
      ],
      likelihood_post: 1, severity_post: 3, risk_score_post: 3, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005",
    });
  }

  const mhItems = isRoofing     ? "membrane rolls, insulation boards, roof lights, scaffold components"
    : isScaffolding ? "scaffold tubes, boards, couplers, base plates"
    : isElectrical  ? "cable drums, conduit, distribution boards, trunking"
    : isDemolition  ? "rubble, stripped materials, debris, heavy plant attachments"
    : isBuilding    ? "masonry blocks, bricks, mortar bags, lintels"
    : isME          ? "ductwork sections, fan coil units, pipe spools, refrigerant cylinders"
    : isFitout      ? "plasterboard sheets, access flooring panels, fire door sets"
    : isPlumbing    ? "copper pipe, boiler units, cylinder tanks, radiators"
    : "pipes, manhole components, aggregate bags";

  const mhAids = isRoofing     ? "panel carriers, suction cups, pallet truck"
    : isScaffolding ? "tube/board carriers, gin wheel, pallet truck"
    : isElectrical  ? "cable drum dispensers, hand truck, pallet truck"
    : isDemolition  ? "excavator, dumper, wheelbarrow"
    : isBuilding    ? "block grab, telehandler, pallet truck"
    : isME          ? "ductwork trolleys, pipe cradles, pallet truck"
    : isFitout      ? "panel carriers, suction lifters, door trolley"
    : isPlumbing    ? "cylinder trolley, boiler hoist, pipe rollers"
    : "excavator, pipe handler, pallet truck";

  ra({
    hazard: `Manual handling of materials (${mhItems.split(", ").slice(0, 3).join(", ")}…)`,
    description: `Manual handling of ${mhItems} and tools presents risk of musculoskeletal injury (back, shoulder, wrist) to operatives. Heavy or awkward loads may require team lifts or mechanical assistance.`,
    who_at_risk: "Operatives",
    likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
    control_measures: [
      `Plan all manual handling tasks in advance; use mechanical aids (${mhAids}) wherever practicable to eliminate or reduce manual handling.`,
      "Restrict individual manual lifts to maximum 25kg; team lifts for loads between 25–50kg; mechanical lift only for loads exceeding 50kg or awkward shapes.",
      "All operatives to have received manual handling awareness training; trained in correct posture, grip, and team lift techniques.",
      `Appropriate handling aids (${mhAids}) to be available on site; all certified lifting accessories to be LOLER-inspected and colour-coded where applicable.`,
      "Rest breaks to be incorporated into heavy manual handling tasks.",
    ],
    likelihood_post: 2, severity_post: 2, risk_score_post: 4, risk_level_post: "Low",
    legislation_ref: "Manual Handling Operations Regulations 1992",
  });

  if (isConfinedSpace) {
    ra({
      hazard: `Confined space entry (excavation depth ${depth}m — oxygen depletion, toxic atmosphere)`,
      description: `An excavation exceeding 1.2m depth is classified as a confined space under the Confined Spaces Regulations 1997. Risks include oxygen depletion, accumulation of toxic gases (hydrogen sulphide from disturbed ground, carbon monoxide from nearby plant), and the inability to escape rapidly in the event of an emergency.`,
      who_at_risk: "Operatives entering the excavation",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "A written Confined Space Entry Permit must be issued and signed off by the site supervisor before any operative enters the excavation.",
        "Atmospheric testing to be carried out before entry and continuously during occupation using a calibrated 4-gas monitor (O2, LEL, CO, H2S); readings to be logged every 30 minutes.",
        "Minimum two operatives on site at all times during confined space operations — one worker, one trained standby person who remains outside the space.",
        "Full rescue plan to be documented and briefed to all persons before entry; rescue equipment (tripod, harness, lifeline, BA set) to be on site and immediately accessible.",
        "No smoking, naked flames, or ignition sources within 6m of the excavation entry point.",
        "If atmospheric alarm activates: evacuate immediately, do not attempt rescue without BA — call 999.",
        "Excavation to be barriered and covered when unattended; access/egress via secured ladder only.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Confined Spaces Regulations 1997",
    });
  }

  if (isNearCarriageway) {
    ra({
      hazard: "Impact from live traffic / vehicle incursion into works area",
      description: "Works adjacent to the live carriageway expose operatives to risk of vehicle incursion into the working zone, particularly from inattentive or impaired drivers. Risk is heightened at night, in poor visibility, or where temporary traffic management is degraded.",
      who_at_risk: "Operatives, road users, members of the public",
      likelihood_pre: 4, severity_pre: 5, risk_score_pre: 20, risk_level_pre: "High",
      control_measures: [
        "A Traffic Management Plan compliant with Chapter 8 of the Traffic Signs Manual must be in place and approved by the Highway Authority before works commence.",
        "Road Space Booking (S50/S278 notice or equivalent) to be obtained from the Local Highway Authority.",
        "Dedicated Traffic Management Operative (TMO) to monitor TM at all times during works; TM to be inspected at start of each shift and after any vehicle strike or interference.",
        "Impact protection vehicle (IPV/TMA) to be deployed on all higher-speed roads (NSL/50mph+); positioned in accordance with Chapter 8 taper requirements.",
        "Operatives to wear Class 3 hi-vis; no operative to turn their back to live traffic; site supervisor to halt works if TM is compromised.",
        "Works hours to be agreed with Highway Authority; night works to require enhanced lighting.",
      ],
      likelihood_post: 2, severity_post: 5, risk_score_post: 10, risk_level_post: "Medium",
      legislation_ref: "Traffic Management Act 2004 / New Roads and Street Works Act 1991",
    });
  }

  if (isExcavation) {
    ra({
      hazard: "Water ingress and flooding of excavation",
      description: "Ground water, surface water run-off, or connection to existing drainage infrastructure may cause the excavation to flood, destabilising the sides, creating a drowning risk, and potentially causing collapse of unexcavated ground.",
      who_at_risk: "Operatives within or adjacent to the excavation",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Review ground investigation data and statutory drainage records before commencing; establish expected water table depth.",
        "Provide dewatering pump (minimum 2-inch submersible) on site before commencing excavation; test before use.",
        "No operative to enter a flooded or partially flooded excavation under any circumstances.",
        "Monitor weather forecast; in the event of heavy rainfall, cease works and cover excavation until water has been removed and sides re-assessed.",
        "Discharge of dewatering effluent to be managed in accordance with Environment Agency requirements (settlement tank if required).",
      ],
      likelihood_post: 2, severity_post: 4, risk_score_post: 8, risk_level_post: "Medium",
      legislation_ref: "CDM Regulations 2015 / Confined Spaces Regulations 1997",
    });
  }

  if (hasCompaction || hasBreaking) {
    ra({
      hazard: "Hand-arm vibration (HAVS) from compaction and breaking equipment",
      description: `Use of ${[hasBreaking && "hydraulic/pneumatic breakers", hasCompaction && "vibrating plate compactors"].filter(Boolean).join(" and ")} exposes operatives to hand-arm vibration in excess of the EAV of 2.5 m/s². Prolonged exposure without controls can result in Hand-Arm Vibration Syndrome (HAVS) and Carpal Tunnel Syndrome — irreversible conditions.`,
      who_at_risk: "Operatives using vibratory equipment",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "Conduct HAV exposure calculation for each tool before works commence; ensure daily exposure does not exceed ELV of 5 m/s².",
        "Implement job rotation to limit individual daily HAV exposure below the EAV (2.5 m/s²) wherever practicable.",
        "Provide anti-vibration gloves to all operatives using vibratory equipment; ensure gloves are manufacturer-rated for the tool being used.",
        "Pre-use check: ensure all equipment is properly maintained (worn anti-vibration mounts replaced); report any unusual vibration to supervisor immediately.",
        "Operatives using vibratory equipment to be enrolled in health surveillance programme; any reporting of tingling, numbness, or whitening of fingers to be reported to site supervisor immediately and work suspended.",
        "Keep hands warm (gloves, warm shelter during breaks) to reduce susceptibility to HAVS.",
      ],
      likelihood_post: 2, severity_post: 3, risk_score_post: 6, risk_level_post: "Low",
      legislation_ref: "Control of Vibration at Work Regulations 2005",
    });
  }

  // ── Electrical ──────────────────────────────────────────────────────────────
  if (isElectrical) {
    ra({
      hazard: "Electric shock / electrocution",
      description: "Contact with live conductors, damaged cables, or inadequately isolated equipment during electrical installation work can cause cardiac arrest, severe burns, or death.",
      who_at_risk: "Electricians, operatives working nearby",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "Lock-Out Tag-Out (LOTO) procedure mandatory before work on any circuit (EaWR 1989 Reg 13); isolate, lock, test dead using GS38-compliant voltage tester before touching any conductor.",
        "Permit to Work required for all live working; live work to be avoided unless technically impossible to de-energise.",
        "All electricians to hold minimum NVQ Level 3 in Electrotechnical Technology; work to be supervised by NICEIC/NAPIT registered Approved Contractor.",
        "RCD protection (max 30mA) on all portable tools and temporary supplies on site.",
        "Inspect all cables and leads daily; any damaged insulation to be taken out of service immediately and replaced before further use.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Electricity at Work Regulations 1989 / BS 7671:2018 (18th Edition)",
    });
    ra({
      hazard: "Arc flash from LV / HV switchgear",
      description: "Inadvertent contact with or working too close to energised switchgear or distribution boards can cause an arc flash releasing intense heat, blast pressure, and molten metal, causing severe burns and blindness.",
      who_at_risk: "Electricians, commissioning engineers",
      likelihood_pre: 2, severity_pre: 4, risk_score_pre: 8, risk_level_pre: "Medium",
      control_measures: [
        "Confirm dead and prove isolation with approved voltage tester before opening any panel or switchgear.",
        "Arc-rated PPE (minimum Category 2 FR clothing, arc-rated face shield with minimum 8 cal/cm²) to be worn for any LV panel work that cannot be confirmed dead.",
        "Segregate work area with insulating barriers; post warning signs on all adjacent live panels.",
        "Only competent persons authorised in writing by the site Electrical Supervisor to access HV equipment.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Electricity at Work Regulations 1989",
    });
    ra({
      hazard: "Damage to existing buried / concealed cables during installation",
      description: "Drilling, cutting, or chasing into walls, floors, or ceilings may inadvertently contact existing live cables, causing electric shock, arc fault, or fire.",
      who_at_risk: "Electricians, operatives",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "CAT & Genny (cable avoidance tool) scan of all surfaces before any chasing or drilling; results recorded before work begins.",
        "Obtain as-built drawings from client/PC before work; cross-reference with CAT scan findings.",
        "Follow safe-zones for cable routing (horizontal and vertical from sockets/switches) per GN6 guidance.",
        "Supervise all cable-pulling operations; do not use excessive force — stop and investigate if resistance is felt.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Electricity at Work Regulations 1989 / HSG47",
    });
  }

  // ── Scaffolding ──────────────────────────────────────────────────────────────
  if (isScaffolding) {
    ra({
      hazard: "Fall from height during scaffold erection and dismantling",
      description: "Operatives working at height without adequate edge protection during erection or dismantling phases are at risk of fatal or life-changing falls. Scaffolding erection is classified as work at height with the highest risk period being the leading edge of the scaffold prior to guard-rails being fixed.",
      who_at_risk: "Scaffold erectors, dismantlers",
      likelihood_pre: 4, severity_pre: 5, risk_score_pre: 20, risk_level_pre: "High",
      control_measures: [
        "All scaffold erectors and dismantlers to hold current CISRS Scaffold Operative or Advanced Scaffold Operative cards appropriate to the work; cards to be checked on site before work commences.",
        "Scaffold design to comply with TG20:21 (standard duty) or bespoke design by a Temporary Works Engineer for non-standard configurations.",
        "WAH 2005 hierarchy applied: no erection above 2m without collective protection (safety net, airbag) or personal fall arrest (harness + short lanyard to structure); no solo working at height.",
        "Scafftag/handover certificate issued and signed before scaffold is handed over for use; tag to remain displayed and current throughout the project.",
        "Erection/dismantling sequence to be documented in method statement and briefed to all operatives before work commences.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / NASC TG20:21 / BS EN 12811",
    });
    ra({
      hazard: "Scaffold collapse due to overloading or structural failure",
      description: "Incorrect tie patterns, overloading of scaffold lifts, inadequate foundations, or unauthorised alterations can cause partial or total scaffold collapse, putting operatives and members of the public at risk.",
      who_at_risk: "Scaffold operatives, trades using scaffold, public below",
      likelihood_pre: 2, severity_pre: 5, risk_score_pre: 10, risk_level_pre: "Medium",
      control_measures: [
        "Scaffold designed and erected to TG20:21 or bespoke Temporary Works design; tie pattern agreed with PC before erection.",
        "Weekly documented inspections by CISRS Scaffolding Inspector; additional inspection after adverse weather, alteration, or impact damage.",
        "Maximum distributed load per board lift clearly signed; operatives briefed at induction — no concentrated point loads.",
        "No alteration to ties, standards, or ledgers by non-scaffolding trades — any alteration requires written consent from scaffold contractor and reinspection before further use.",
        "Scaffold foundations checked for suitability; base plates and sole boards used on all standards on soft or uneven ground.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / NASC TG20:21 / BS 5975",
    });
    ra({
      hazard: "Falling materials from scaffold",
      description: "Tools, materials, and debris falling from scaffold lifts can cause fatal head injuries to operatives or members of the public below.",
      who_at_risk: "Operatives below, members of the public",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Brick guards / toe boards fitted to all open edges of working lifts; debris netting fitted below working platform.",
        "Debris fans (loading fan) at each lift level adjacent to public areas; fans to extend minimum 2.4m from face of scaffold.",
        "Exclusion zone established directly below all working areas; zone to be physically segregated (barriers, signage) and policed.",
        "All personnel within exclusion zone to wear hard hats (EN 397) at all times; helmets to be visually inspected before daily use.",
        "No throwing of materials or equipment between lifts; all materials to be lowered or hoisted in bags/skips.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / CDM 2015",
    });
  }

  // ── Roofing ──────────────────────────────────────────────────────────────────
  if (isRoofing) {
    ra({
      hazard: "Fall from roof edge or through fragile surface",
      description: "Unprotected roof edges and fragile roofing materials (roof lights, older fibre cement, corrugated asbestos) represent the highest risk of fatal injury for roofing operatives. Falls from roofs account for a disproportionate share of construction fatalities.",
      who_at_risk: "Roofers, labourers, any operative accessing the roof",
      likelihood_pre: 4, severity_pre: 5, risk_score_pre: 20, risk_level_pre: "High",
      control_measures: [
        "WAH 2005 hierarchy applied before any operative accesses the roof: collective protection (edge protection to BS EN 13374 Class A/B/C, or safety netting to BS EN 1263-1/2 installed by FASET-trained riggers) to be in place before work begins.",
        "Fall arrest anchors (BS EN 795 Class B, tested to 12kN) to be installed by competent person and used where edge protection cannot be provided.",
        "ACR TR57 fragility survey to be completed for all existing roof surfaces before work begins; fragile areas to be highlighted with warning signs and physical barriers.",
        "Crawling boards spanning a minimum of 2 purlins to be used on all fragile or unverified roof surfaces; no point loading directly on sheets.",
        "All roof lights and skylights to be highlighted in a contrasting colour, physically covered (load-rated covers), and signed before any operative accesses the roof.",
        "Minimum 2-person working on roof at all times; lone working on roofs prohibited.",
        "WAH Plan to be prepared by a competent person, briefed to all operatives, and signed before commencement.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / BS EN 13374 / ACR TR57",
    });
    ra({
      hazard: "Hot works fire risk (bitumen, torch-on felt, hot melt)",
      description: "Use of LPG torches and hot bitumen on or near roof structures, insulation, or combustible substrates creates a significant fire risk. Fires started during torch-on roofing may not become evident until hours after the work has finished.",
      who_at_risk: "Roofers, building occupants, fire service",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Hot Works Permit issued and signed before any torch-on, bitumen, or hot melt activity; permit to state time, location, operative, and fire watcher details.",
        "Minimum 9kg dry powder fire extinguisher within 5m of hot work at all times; extinguisher to be inspected annually and within service date.",
        "Dedicated fire watcher to remain at the work area during hot works and for a minimum of 60 minutes after all heat sources are extinguished.",
        "Clear 1m exclusion zone around hot work area free of all combustible materials (insulation, felt offcuts, packaging); combustibles to be removed or covered with fire blanket.",
        "LPG cylinders to be stored upright in cage outside building; flash-back arrestors on all torches; cylinders not in use to have valve closed.",
        "Notify building insurer and building owner before hot works commence on occupied or sensitive structures.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Regulatory Reform (Fire Safety) Order 2005 / Fire Safety Order",
    });
    ra({
      hazard: "Weather-related risk — wind and wet conditions",
      description: "High winds create a risk of loss of balance and fall for operatives working at roof level, and can dislodge unsecured materials causing falling object hazards. Wet roof surfaces significantly increase the risk of slipping.",
      who_at_risk: "Roofers, operatives, public below",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Check Met Office forecast before each working day; suspend roofing work when wind speed exceeds 15 m/s (Beaufort Scale 7) or as directed by WAH Plan.",
        "All loose materials and tools to be secured or brought down at the end of each shift and when operatives leave the roof unattended.",
        "Anti-slip footwear (EN ISO 20345 SRC rated) mandatory for all operatives on roof; wet surfaces to be assessed before access.",
        "Work on pitched roofs in wet conditions to be suspended unless collective fall protection is in place and the roof surface has been assessed as safe to access.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / CDM 2015",
    });
  }

  // ── Gas Works (pack-driven) ──────────────────────────────────────────────────
  if (gasPack) {
    for (const h of gasPack.hazards) {
      ra({
        hazard: h.hazard,
        description: h.description,
        who_at_risk: h.who_at_risk,
        likelihood_pre: h.likelihood_pre,
        severity_pre: h.severity_pre,
        risk_score_pre: h.risk_score_pre,
        risk_level_pre: h.risk_level_pre,
        control_measures: h.control_measures,
        likelihood_post: h.likelihood_post,
        severity_post: h.severity_post,
        risk_score_post: h.risk_score_post,
        risk_level_post: h.risk_level_post,
        legislation_ref: h.legislation_ref,
      });
    }
  }

  // ── Plumbing (non-gas) ───────────────────────────────────────────────────────
  if (isPlumbing) {
    ra({
      hazard: "Legionella contamination in hot and cold water systems",
      description: "Poorly designed or commissioned domestic water systems with dead legs, low-temperature zones, or stagnation can allow Legionella pneumophila to proliferate, creating a risk of Legionnaires' disease — a potentially fatal form of pneumonia — for building occupants and maintenance personnel.",
      who_at_risk: "Building occupants, maintenance personnel, plumbers during commissioning",
      likelihood_pre: 2, severity_pre: 4, risk_score_pre: 8, risk_level_pre: "Medium",
      control_measures: [
        "Design to minimise dead legs and stagnant zones; all pipework to drain or circulate; L8 ACOP requirements to be followed from design stage.",
        "Hot water to be stored at minimum 60°C and distributed at 50°C at the draw-off point within 1 minute; cold water to be maintained below 20°C.",
        "Full system disinfection to BS 8558 before commissioning and handover; disinfection certificate to be retained and passed to building owner.",
        "Responsible Person appointed by client before building occupation; Legionella risk assessment to be completed and documented.",
        "Plumbers to be aware of risks during commissioning; avoid inhaling spray from system flushing — wear FFP2 RPE when flushing systems that have been stagnant.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "COSHH Regulations 2002 / L8 ACOP / HSG274",
    });
    ra({
      hazard: "Unvented hot water system failure",
      description: "Incorrectly installed or commissioned unvented hot water systems (G3) can fail catastrophically if pressure relief devices are absent or incorrectly sized, resulting in steam explosion (BLEVE) and serious scalding injuries.",
      who_at_risk: "Plumber, building occupants",
      likelihood_pre: 2, severity_pre: 5, risk_score_pre: 10, risk_level_pre: "Medium",
      control_measures: [
        "All unvented hot water systems to be installed and commissioned by a City & Guilds 6035 (or equivalent) qualified operative only.",
        "Pressure Relief Valve (PRV), expansion vessel, temperature/pressure relief valve, and discharge pipe to be fitted to manufacturer's specification and Building Regs Part G.",
        "Discharge pipe to route to safe, visible drain location to BS EN 806; pipe material to withstand water at 95°C.",
        "Building Regulations Part G notification to be submitted to Building Control before installation; completion certificate to be issued on commissioning.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Building Regulations Part G / PSSR 2000 / Approved Document G",
    });
  }

  // ── Demolition ───────────────────────────────────────────────────────────────
  if (isDemolition) {
    ra({
      hazard: "Asbestos Containing Material (ACM) exposure",
      description: "Many pre-2000 buildings contain ACMs in floor tiles, insulation, ceiling tiles, pipe lagging, and roof sheets. Disturbing ACMs without control releases airborne asbestos fibres causing mesothelioma, lung cancer, and asbestosis — fatal diseases with no cure and a latency of 20–50 years.",
      who_at_risk: "Demolition operatives, all site personnel, future building occupants",
      likelihood_pre: 4, severity_pre: 5, risk_score_pre: 20, risk_level_pre: "High",
      control_measures: [
        "Type 3 (management) asbestos survey (CAR 2012 Regulation 5) to be completed by a UKAS-accredited analyst before any strip-out or demolition work commences; survey report on site at all times.",
        "ACM register to be compiled from survey findings and made available to all contractors; all ACMs to be clearly labelled and fenced off.",
        "Licensed asbestos removal required for all licensed ACMs (pipe lagging, sprayed coatings, AIB — except small scale, short duration); 14-day notification to HSE (Form F10) minimum before licensed works.",
        "PAPR TH3 RPE to be worn for licensed removal; FFP3 (P3 filter) for non-licensed notifiable work; RPE to be face-fit tested and records retained.",
        "Medical surveillance and personal health records (PHR) maintained for a minimum of 40 years for all operatives involved in licensed asbestos work.",
        "Waste transfer notes (consignment notes for licensed material) to be retained for 3 years; all ACM waste to be disposed of at a licensed waste carrier facility.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Control of Asbestos Regulations 2012 (CAR 2012) / COSHH 2002",
    });
    ra({
      hazard: "Uncontrolled structural collapse during demolition",
      description: "Demolition of structural elements without a safe, engineered sequence risks premature or uncontrolled collapse, which can be fatal to operatives and members of the public in the vicinity.",
      who_at_risk: "Demolition operatives, adjacent trades, members of the public",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "Structural engineer to prepare and approve the demolition sequence before works commence; sequence to be followed precisely — no deviation without engineer sign-off.",
        "Temporary propping and shoring to be designed by Structural/Temporary Works Engineer and installed before structural elements are removed.",
        "Works to be immediately suspended and engineer consulted if unexpected movement, cracking, or deflection is observed.",
        "Exclusion zone to be established equal to the full height of the structure on all sides; zone to be physically secured and signed.",
        "Sequential demolition only — no top-down working without specific engineer approval; debris to be progressively removed to prevent surcharge loading.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "CDM 2015 / BS 6187:2011 (Code of Practice for Full and Partial Demolition)",
    });
    ra({
      hazard: "Lead paint inhalation and ingestion",
      description: "Paint applied before 1960 commonly contains lead. Cutting, grinding, or blasting lead-painted surfaces generates lead dust and fume, which is absorbed through the respiratory tract and skin, causing lead poisoning with serious neurological, renal, and reproductive effects.",
      who_at_risk: "Demolition and strip-out operatives",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Lead paint survey to be completed before any strip-out or demolition of pre-1960 structures; results to be communicated to all operatives.",
        "P3 filter half-mask or powered air-purifying respirator (PAPR TH3) to be worn for all operations that generate lead dust or fume.",
        "Disposable coveralls (Type 5/6) and nitrile gloves to be worn; removed before leaving the work area and disposed of as controlled waste.",
        "No eating, drinking, or smoking in the work area; operatives to wash hands and face thoroughly before breaks.",
        "Blood-lead monitoring to be arranged for operatives with prolonged or intensive exposure; EH40 WEL 0.15 mg/m³ (8-hour TWA) not to be exceeded.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "COSHH Regulations 2002 / EH40 (Workplace Exposure Limits)",
    });
  }

  // ── Building & Structural ────────────────────────────────────────────────────
  if (isBuilding) {
    ra({
      hazard: "Respirable Crystalline Silica (RCS) dust inhalation",
      description: "Cutting, grinding, or breaking concrete, brick, block, or stone generates RCS. Cumulative exposure above the WEL of 0.1 mg/m³ (8-hour TWA) causes silicosis — an irreversible and potentially fatal lung disease — and increases lung cancer risk.",
      who_at_risk: "Bricklayers, blocklayers, operatives cutting masonry",
      likelihood_pre: 4, severity_pre: 4, risk_score_pre: 16, risk_level_pre: "High",
      control_measures: [
        "WEL of 0.1 mg/m³ not to be exceeded; RPE selection based on COSHH assessment — FFP3 disposable or half-mask with P3 filter as minimum for cutting operations.",
        "Wet cutting as primary control for all angle grinder and disc cutter operations; where wet cutting is not practicable, on-tool LEV extraction to be used.",
        "Score-and-snap technique to be used in preference to cutting where the material specification allows.",
        "No dry sweeping of dust — vacuum with H-class filter or wet sweeping only; isolate dust-generating operations from other workers where practicable.",
        "Health surveillance for regular brick/block cutters: baseline lung function test and annual review; operatives to report any breathlessness or persistent cough immediately.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "COSHH Regulations 2002 / EH40 WEL",
    });
    ra({
      hazard: "Manual handling injuries — dense masonry blocks and materials",
      description: "Dense concrete blocks (standard 7N/mm² block = 20–25kg), reinforcement bars, and stone elements subject operatives to repeated high-force manual handling, causing musculoskeletal injury to back, shoulders, and wrists.",
      who_at_risk: "Bricklayers, hod carriers, labourers",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "Individual manual handling limit of 25kg for a single lift; any item above 25kg to be handled mechanically (forklift, blocks grab, pallet truck) or as a team lift.",
        "All bricklayers and labourers to receive manual handling induction (MHOR 1992); task-specific MH assessment to be completed for high-frequency lifting tasks.",
        "Packs of blocks to be offloaded by forklift as close to point of use as possible; use of hod restricted to short-duration lifts only.",
        "Task rotation to be implemented where operatives are performing the same repetitive lifting task for more than 2 hours continuously.",
        "Block sizes specified to be 440×215×100mm or 440×215×140mm (standard) where possible to minimise individual block weights.",
      ],
      likelihood_post: 2, severity_post: 2, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Manual Handling Operations Regulations 1992 (MHOR)",
    });
    ra({
      hazard: "Hand-arm vibration (HAVS) from angle grinder and SDS hammer",
      description: "Repeated use of angle grinders (typically 8–12 m/s²) and SDS rotary hammer drills (6–12 m/s²) in masonry and concrete work exposes operatives to vibration levels significantly above the EAV of 2.5 m/s². Prolonged exposure without controls causes HAVS — irreversible damage to blood vessels, nerves, and joints in hands and wrists.",
      who_at_risk: "Bricklayers, concretors, operatives using power tools",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "HAV exposure calculation to be completed using manufacturer's vibration data (triax) for each tool; daily exposure time limited to stay below EAV (2.5 m/s²) where reasonably practicable, and below ELV (5 m/s²) at all times.",
        "Low-vibration tools to be selected where available; tool age and maintenance to be considered — worn tools vibrate significantly more.",
        "Task rotation to be implemented: no single operative to use vibratory tools for more than the calculated trigger time without a break; breaks to include warming hands.",
        "Anti-vibration gloves rated for the specific tool to be provided and used; operatives to keep hands warm during cold weather.",
        "Health surveillance (tier 2 HAVs questionnaire) for all operatives regularly using vibratory tools; any tingling, numbness, or whitening of fingers to be reported immediately and further use suspended pending medical review.",
      ],
      likelihood_post: 2, severity_post: 3, risk_score_post: 6, risk_level_post: "Low",
      legislation_ref: "Control of Vibration at Work Regulations 2005",
    });
  }

  // ── M&E ──────────────────────────────────────────────────────────────────────
  if (isME) {
    ra({
      hazard: "Refrigerant release (F-Gas) — environmental and health risk",
      description: "Uncontrolled release of refrigerant gases (R410A, R32, R134a etc.) during installation, commissioning, or decommissioning of refrigeration and air conditioning systems causes environmental harm (high GWP) and can displace oxygen in enclosed spaces, causing asphyxiation.",
      who_at_risk: "M&E engineers, commissioning operatives, occupants of plant rooms",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "All refrigerant handling to be carried out exclusively by operatives holding City & Guilds 2079 (or equivalent) F-Gas qualification; records of qualifications to be held on site.",
        "No deliberate venting of refrigerant to atmosphere under any circumstances; F-Gas Regulations 2015 compliance mandatory.",
        "Refrigerant leak check to be conducted after installation and documented; for systems with refrigerant charge >3kg, a leak-detection log to be maintained.",
        "F-Gas equipment register (plant ID, refrigerant type, quantity, check dates) to be established for each system and passed to building owner on handover.",
        "Plant rooms to be well ventilated; refrigerant gas detector to be installed in plant rooms with charges >300kg CO₂e.",
      ],
      likelihood_post: 1, severity_post: 3, risk_score_post: 3, risk_level_post: "Low",
      legislation_ref: "F-Gas Regulations 2015 (EU 517/2014 retained in UK law)",
    });
    ra({
      hazard: "Pressurised system failure during testing and commissioning",
      description: "Hydraulic pressure testing of pipework and systems to 1.5× maximum working pressure, or pre-commission charging of compressed systems, can cause joint failure or pipe burst if carried out incorrectly, resulting in high-velocity water/fluid release causing serious injury.",
      who_at_risk: "M&E engineers, commissioning personnel, adjacent trades",
      likelihood_pre: 2, severity_pre: 5, risk_score_pre: 10, risk_level_pre: "Medium",
      control_measures: [
        "Written Scheme of Examination (WSE) to be in place under PSSR 2000 for all pressurised systems exceeding 0.5 bar; WSE to be produced by a Competent Person before commissioning.",
        "Hydraulic test to be conducted at 1.5× MWP; test witnessed and certified by a Competent Person; all non-essential personnel to be excluded from the test area during pressurisation.",
        "Pressure to be raised in stages and held at each increment for visual inspection before continuing; any weeping joint to be depressurised, repaired, and retested before pressurising again.",
        "Written test certificate to be retained as part of the O&M manual; no system to be left charged and unattended until all joints have been visually confirmed at test pressure.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Pressure Systems Safety Regulations 2000 (PSSR 2000)",
    });
    ra({
      hazard: "Working at height — MEWP and mobile tower during M&E installation",
      description: "M&E installations (ductwork, cable trays, mechanical plant) frequently require working at height from mobile elevated work platforms (MEWPs) or mobile aluminium towers. MEWP tip-over or tower collapse from incorrect setup or ground conditions can be fatal.",
      who_at_risk: "M&E engineers, ductwork installers, cable installers",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "MEWP operators to hold current IPAF PAL card (3a for push-around, 3b for self-propelled or boom); PASMA card required for mobile aluminium towers.",
        "Pre-use ground survey: confirm ground surface is capable of supporting MEWP outrigger loads; do not use MEWP on ground that has been recently excavated or backfilled without engineer approval.",
        "All MEWP outriggers to be fully deployed on solid pads before any work begins; MEWP not to be moved with operatives in the platform unless the MEWP type specifically permits it.",
        "Fall arrest harness and short lanyard to be worn and clipped to designated anchor point within the MEWP platform at all times when the platform is elevated.",
        "Tool lanyards to be used for all tools used at height; unsecured tools and materials not permitted on the platform above other workers.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "Work at Height Regulations 2005 / PUWER 1998 / IPAF guidance",
    });
  }

  // ── Internal Fit-Out ─────────────────────────────────────────────────────────
  if (isFitout) {
    ra({
      hazard: "Fire compartmentation breach — life safety risk",
      description: "Incorrect installation of fire doors, improper fire-stopping around service penetrations, or incomplete intumescent sealing compromises the fire compartmentation strategy of the building, allowing fire and smoke to spread rapidly beyond the intended compartment boundary, endangering life.",
      who_at_risk: "Building occupants, fire service, future maintenance personnel",
      likelihood_pre: 3, severity_pre: 5, risk_score_pre: 15, risk_level_pre: "High",
      control_measures: [
        "All fire doors to be certified to BS EN 16034 and tested to BS 476 Part 22 (FD30 or FD60 as specified); door, frame, seals, hinges, closer, and hardware to form a certified system from a single approved supplier.",
        "Fire door installer to hold FIRAS or BM TRADA Q-Mark third-party installer certification; all fire doors to be installed per manufacturer's installation instructions.",
        "Intumescent seals, smoke seals, and fire-stopping materials at all service penetrations to be tested and certified to EN 1366; only third-party certified products to be used.",
        "Completed fire door and fire-stopping schedule (BSA golden thread records) to be produced and passed to client on handover; Building Regs Part B notification to Building Control before occupation.",
        "Completion certificate to be issued for each fire door installation; doors to be inspected for correct fitting, clearances, and self-closing function before final sign-off.",
      ],
      likelihood_post: 1, severity_post: 5, risk_score_post: 5, risk_level_post: "Low",
      legislation_ref: "Building Regulations Part B / BS EN 16034 / BS 476 Part 22",
    });
    ra({
      hazard: "Silica dust from plasterboard, screed, and dry lining cutting",
      description: "Machine cutting of plasterboard, cement board, and floor screed generates RCS at levels that can rapidly exceed the WEL of 0.1 mg/m³. Prolonged exposure causes silicosis and increases lung cancer risk.",
      who_at_risk: "Dry liners, plasterers, floor layers",
      likelihood_pre: 3, severity_pre: 4, risk_score_pre: 12, risk_level_pre: "Medium",
      control_measures: [
        "Score-and-snap technique to be used in preference to machine cutting for plasterboard wherever the cut allows; avoid power tool cutting unless edge quality requirements demand it.",
        "Where machine cutting is required, use on-tool LEV extraction; wet cutting as alternative for cement board and screed.",
        "FFP2 minimum RPE for all cutting of plasterboard or screed; FFP3 for cement board or stone floor tile cutting.",
        "No dry sweeping of dust; use industrial vacuum with H-class filter or damp mopping only.",
        "Health surveillance for dry liners and plasterers regularly generating dust; baseline and annual lung function tests.",
      ],
      likelihood_post: 1, severity_post: 4, risk_score_post: 4, risk_level_post: "Low",
      legislation_ref: "COSHH Regulations 2002 / EH40 WEL",
    });
    ra({
      hazard: "Manual handling — plasterboard panels and raised access flooring",
      description: "Full-size plasterboard sheets (2400×1200mm, 12.5mm) weigh approximately 25kg; thicker boards and cement boards weigh more. Raised access flooring panels and pedestals require repetitive bending, lifting, and carrying. Both tasks carry a significant risk of back injury, shoulder strain, and crush injuries from dropped panels.",
      who_at_risk: "Dry liners, floor layers, labourers",
      likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
      control_measures: [
        "Individual manual handling limit 25kg; full-size 12.5mm plasterboard sheets to be handled as a 2-person lift unless a panel carrier (suction-cup lifter) is used.",
        "Panel carriers and board lifters to be provided and used for all boards above 1200mm in any dimension; operatives trained in use of equipment before site mobilisation.",
        "2-person rule for all 2400×1200mm or larger boards: operatives to plan the lift path, communicate throughout, and not twist under load.",
        "Task rotation to limit each operative's repetitive panel lifting to no more than 2 hours continuously before a break or task change.",
        "MH assessment to be completed for the fit-out package; operatives briefed at induction.",
      ],
      likelihood_post: 2, severity_post: 3, risk_score_post: 6, risk_level_post: "Low",
      legislation_ref: "Manual Handling Operations Regulations 1992 (MHOR)",
    });
  }

  ra({
    hazard: "Noise-induced hearing loss from plant and equipment",
    description: "Plant and equipment used during these works will generate noise levels exceeding the Lower Exposure Action Value (LEAV) of 80 dB(A) and potentially the Upper Exposure Action Value (UEAV) of 85 dB(A). Prolonged unprotected exposure causes permanent noise-induced hearing loss.",
    who_at_risk: "Operatives, adjacent workers, members of the public",
    likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
    control_measures: [
      "Carry out noise assessment identifying noise levels from each item of plant; designate hearing protection zones with mandatory signage.",
      "Mandatory hearing protection (min SNR 28 ear defenders or Class 5 earplugs) to be worn by all operatives within the plant operating zone.",
      "Members of the public and adjacent workers to be informed of noise-generating activities in advance where practicable; erect acoustic hoarding where required.",
      "Quieter plant to be selected where practicable; plant maintenance (worn exhausts replaced) to minimise noise at source.",
      "Restrict noisy operations to agreed working hours to minimise impact on neighbouring properties.",
    ],
    likelihood_post: 2, severity_post: 2, risk_score_post: 4, risk_level_post: "Low",
    legislation_ref: "Noise at Work Regulations 2005",
  });

  ra({
    hazard: "Welfare and dehydration / heat stress (during summer works)",
    description: "Operatives carrying out physically demanding groundworks in warm conditions risk dehydration, heat exhaustion, or heat stroke. Inadequate welfare provision may also affect operative wellbeing and concentration, increasing accident risk.",
    who_at_risk: "Operatives",
    likelihood_pre: 2, severity_pre: 3, risk_score_pre: 6, risk_level_pre: "Low",
    control_measures: [
      "Adequate welfare facilities (drying room, WC, wash facilities) to be available on or adjacent to site at all times; as agreed with PC in Construction Phase Plan.",
      "Fresh drinking water available on site at all times; operatives encouraged to drink regularly.",
      "Rest breaks to be taken in shade where possible during hot weather.",
      "Monitor weather forecasts; implement revised working pattern during extreme heat (early morning start, mid-afternoon break).",
    ],
    likelihood_post: 1, severity_post: 3, risk_score_post: 3, risk_level_post: "Low",
    legislation_ref: "Health & Safety at Work Act 1974 / Welfare in Construction Regulations",
  });

  // ─── METHOD STATEMENT ────────────────────────────────────────────────────────
  const steps: MethodStep[] = [];
  let stepIdx = 1;
  const addStep = (title: string, description: string) =>
    steps.push({ step: stepIdx++, title, description });

  addStep(
    "Pre-start checks, RAMS briefing and toolbox talk",
    `Before works commence, the site supervisor (${input.supervisor}) will carry out a pre-start briefing with all operatives covering: the scope of works, identified hazards, control measures, emergency procedures, and welfare arrangements. All operatives will sign the RAMS briefing register. Any visitor or new starter will receive a site induction from the site supervisor prior to entering the works area. Plant operators to carry out pre-use inspections and record in plant pre-start inspection book.`
  );

  addStep(
    "Site set-up, exclusion zones and welfare",
    `Establish site compound and welfare facilities in agreed location per the PC's Construction Phase Plan. Erect Heras fencing or water-filled barriers to segregate the works area from public access. Install directional and hazard signage. Set up plant exclusion zones (minimum 3m from excavation edge). Ensure first aid kit, eye wash station, and fire extinguisher are in place before any works commence. Confirm emergency routes and muster points with the PC.`
  );

  if (isNearCarriageway) {
    addStep(
      "Traffic management implementation",
      "Implement the approved Traffic Management Plan before any works commence within or adjacent to the carriageway. Traffic Management Operative (TMO) to set up signing, lighting, and guarding in accordance with Chapter 8 and the approved TM drawing. Obtain Road Space Booking / Permit confirmation. Photograph TM in position for records. Inform PC and Highway Authority that TM is in place and works are commencing."
    );
  }

  addStep(
    "Buried services location — CAT scan and permit to dig",
    `Obtain statutory undertakers' records for the works area. Supervising operative to carry out full CAT and Genny sweep of the excavation footprint before any mechanical excavation commences; results to be sketched on site plan and signed. Issue Permit to Dig for each excavation, signed by site supervisor. Mark all known services on the ground surface using spray paint and pin flags. Hand dig trial holes to expose and confirm service position before any mechanical dig commences within 0.5m of a marked service.`
  );

  if (isExcavation) {
    addStep(
      `Excavate to formation level (${depth > 0 ? depth + "m" : "required"} depth)`,
      `360° excavator to commence excavation in 1m maximum stages, with the ground stability assessed after each stage by the site supervisor. Install trench support / battering in accordance with the method agreed during pre-start inspection. Spoil to be placed minimum 1m from excavation edge. De-watering pump to be deployed as required. Excavation supervisor to inspect the excavation at the start of each shift and following any rainfall or vibration event; record in excavation register. ${isConfinedSpace ? "Confined Space Entry Permit to be issued before any operative enters the excavation. Atmospheric testing (4-gas monitor) mandatory before entry and every 30 minutes during occupation." : ""}`
    );

    addStep(
      "Install drainage / works to specification",
      `Install drainage pipework, manholes, and associated works in accordance with the project drawings and specification. Ensure correct pipe bedding and haunching in accordance with bedding class specified. Manhole components to be lifted using excavator with appropriate lifting attachment (shackle, chain, spreader bar); LOLER pre-use check carried out. All joints to be made in accordance with manufacturer's instructions. Record invert levels and gradients as work progresses.`
    );

    addStep(
      "Testing and inspection",
      "Carry out drainage testing in accordance with WRc Manual (BS EN 1610) requirements: air test / water test as specified. Record test results on site test certificates. CCTV survey to be commissioned on completion of installation (where specified). Carry out level checks against design drawings and record. Notify PC / contract administrator of test completion and arrange inspection if required."
    );

    addStep(
      "Backfill and compaction",
      `Backfill excavation in 150mm compacted layers using selected fill or granular material as specified. Plate compactor or trench rammer to be used to achieve compaction; not to operate within 300mm of installed pipework. Compaction test results to be recorded where specified. Ensure imported fill material has valid waste transfer note (if required). Check for any heave or settlement during backfilling and report to supervisor.`
    );
  }

  if (gasPack) {
    for (const s of gasPack.method_steps) {
      addStep(s.title, s.description);
    }
  }

  addStep(
    "Reinstatement and site clearance",
    `Carry out surface reinstatement in accordance with the specification (tarmac, topsoil, concrete, block paving as applicable). Ensure all temporary works, barriers, signs, and spoil are removed from site. Site to be left clean and tidy on completion of works. Complete all handover documentation including as-built drawings, test certificates, and waste transfer notes. Notify PC of works completion and arrange final inspection.`
  );

  // ─── PLANT & EQUIPMENT ───────────────────────────────────────────────────────
  const plantAndEquipment: PlantEquipmentItem[] = plantList.map((item) => {
    const lower = item.toLowerCase();
    let requirement = "PUWER pre-use inspection required; maintenance records to be available on site.";
    if (/excavat|360|digger|jcb/i.test(lower)) {
      requirement = "CPCS A59 (360° excavator) ticket required. LOLER 6-monthly thorough examination certificate current. PUWER daily pre-use inspection. Working at Height controls in place for boom/arm maintenance.";
    } else if (/dumper|dumptruck/i.test(lower)) {
      requirement = "CPCS A09 (forward tip dumper) or NPORS equivalent required. PUWER pre-use inspection. Roll-Over Protection Structure (ROPS) fitted and serviceable.";
    } else if (/wacker|plate|compactor|vibrat/i.test(lower)) {
      requirement = "No formal ticket required. Operative to be trained and competent. PUWER weekly inspection. Anti-vibration handles and mounts to be checked before use.";
    } else if (/breaker|jackhammer|pneumat/i.test(lower)) {
      requirement = "No formal ticket required. Operative to be trained and competent. PUWER inspection before use. HAV trigger time to be monitored.";
    } else if (/crane|lift/i.test(lower)) {
      requirement = "CPCS A60 (slinging/signalling) or A61 (crane) ticket required. LOLER 6-monthly thorough examination. Lift Plan required for all crane lifts.";
    } else if (/generator|pump/i.test(lower)) {
      requirement = "PUWER inspection before deployment. PAT test current (if electric). Refuelling bund provided; no fuelling near open excavation.";
    }
    return { item, requirement };
  });

  if (plantAndEquipment.length === 0) {
    plantAndEquipment.push({ item: "360° excavator", requirement: "CPCS A59 ticket required. LOLER 6-monthly thorough examination certificate current. PUWER daily pre-use inspection." });
    plantAndEquipment.push({ item: "Vibratory plate compactor", requirement: "Trained operative. PUWER weekly inspection. Anti-vibration mounts checked before use." });
  }
  plantAndEquipment.push({ item: "4-gas atmospheric monitor (O2, LEL, CO, H2S)", requirement: "Calibration certificate current (max 6 months). Pre-use bump test carried out each shift. " + (isConfinedSpace ? "Mandatory for all confined space operations." : "Required before entering any excavation.") });
  plantAndEquipment.push({ item: "CAT (Cable Avoidance Tool) & Genny", requirement: "Calibration certificate current. Operative trained in use. Pre-use self-test carried out." });

  if (gasPack) {
    for (const p of gasPack.plant) {
      plantAndEquipment.push(p);
    }
  }

  // ─── PPE ─────────────────────────────────────────────────────────────────────
  const ppe: PPEItem[] = [
    { item: "Safety helmet (hard hat)", standard: "EN 397:2012+A1:2012 — Class E electrical protection", mandatory: true },
    { item: "Hi-visibility jacket / vest", standard: "EN ISO 20471:2013 — Class 3 (waistcoat + trousers) or Class 2 minimum for non-carriageway areas", mandatory: true },
    { item: "Safety boots (steel toe and midsole)", standard: "EN ISO 20345:2011 — S3 HRO rating minimum", mandatory: true },
    { item: "Protective gloves (general handling)", standard: "EN 388:2016 — cut level B minimum for general groundworks", mandatory: true },
    { item: "Ear defenders", standard: "EN 352-1:2002 — SNR minimum 28 dB; mandatory in hearing protection zone", mandatory: true },
    { item: "Safety glasses / goggles", standard: "EN 166:2002 — mandatory during breaking, cutting, and concrete works", mandatory: true },
    { item: "Dust mask (RPE)", standard: "EN 149:2001+A1:2009 — FFP3 disposable mask or higher for silica-generating activities", mandatory: hasConcrete || hasBreaking },
    { item: "Waterproof hi-vis jacket", standard: "EN ISO 20471:2013 Class 2 or 3 — mandatory during wet weather operations", mandatory: false },
  ];

  if (isConfinedSpace) {
    ppe.push({ item: "Confined space harness and lifeline", standard: "EN 361:2002 full body harness — mandatory for all confined space entry", mandatory: true });
    ppe.push({ item: "Self-contained breathing apparatus (SCBA)", standard: "EN 137:2006 — on standby for rescue purposes; not worn routinely unless atmospheric monitoring indicates hazard", mandatory: false });
  }
  if (isNearCarriageway) {
    ppe.push({ item: "Class 3 hi-visibility trousers", standard: "EN ISO 20471:2013 — mandatory for all works within and adjacent to the carriageway", mandatory: true });
  }

  // ─── COSHH ───────────────────────────────────────────────────────────────────
  const coshh: COSHHItem[] = [
    {
      substance: "Diesel exhaust fumes (from plant)",
      risk: "Carcinogenic particulates and NOx; respiratory irritation; increased long-term cancer risk.",
      control: "Position plant exhausts away from operatives and welfare areas; use low-emission plant where available; avoid prolonged idling; provide RPE if ventilation is inadequate in confined areas.",
      regulation: "COSHH 2002",
    },
    {
      substance: "Fuel and oil (plant refuelling)",
      risk: "Skin absorption; irritation; fire risk during refuelling.",
      control: "Refuel in designated area away from ignition sources and water courses; use bunded refuelling bowser; spill kit on site; no smoking in refuelling area.",
      regulation: "COSHH 2002",
    },
  ];

  if (hasConcrete || hasBreaking) {
    coshh.push({
      substance: "Respirable crystalline silica (RCS) dust",
      risk: "Silicosis (progressive, incurable scarring of lung tissue); lung cancer. WEL: 0.1 mg/m³ (8-hour TWA).",
      control: "Water suppression on breaking/cutting operations; on-tool extraction where applicable; FFP3 disposable RPE mandatory; health surveillance for regular exposures; avoid dry sweeping — vacuum or wet methods only.",
      regulation: "COSHH 2002",
    });
    coshh.push({
      substance: "Wet cement / concrete (chromate VI)",
      risk: "Cement dermatitis (allergic contact dermatitis); chemical burns from prolonged skin contact with wet cement. Risk of occupational asthma.",
      control: "Barrier cream applied to hands and wrists before working with wet cement; nitrile gloves mandatory; wash stations with clean water available at all times; change wet/cement-contaminated clothing immediately; no kneeling in wet concrete without knee pads.",
      regulation: "COSHH 2002",
    });
  }

  if (gasPack) {
    for (const c of gasPack.coshh) {
      coshh.push(c);
    }
  }

  // ─── HAVS ────────────────────────────────────────────────────────────────────
  const havsTools: HAVSTool[] = [];
  if (hasCompaction) {
    havsTools.push({
      tool: "Vibratory plate compactor (single plate)",
      vibration_level: "Approx. 5.0 m/s² (manufacturer data) — EAV reached at approx. 30 min; ELV at approx. 2 hours",
      daily_exposure_limit: "EAV 2.5 m/s² / ELV 5 m/s² (8-hr TWA)",
      control: "Limit continuous use to 30 min per operative; implement job rotation minimum every 30 min; provide anti-vibration gloves rated for this tool; daily HAV exposure log maintained by supervisor.",
    });
  }
  if (hasBreaking) {
    havsTools.push({
      tool: "Hydraulic / electric breaker",
      vibration_level: "Approx. 12.0 m/s² (manufacturer data) — EAV reached at approx. 8 min; ELV at approx. 30 min",
      daily_exposure_limit: "EAV 2.5 m/s² / ELV 5 m/s² (8-hr TWA)",
      control: "Strict rotation — maximum 8 min per operative before handover; halt if any tingling reported; anti-vibration gloves required; daily HAV exposure log maintained.",
    });
  }
  if (!hasCompaction && !hasBreaking) {
    havsTools.push({
      tool: "360° excavator joystick controls",
      vibration_level: "Approx. 0.5 m/s² (whole-body vibration) — HAVS risk low from cab controls",
      daily_exposure_limit: "EAV 2.5 m/s² / ELV 5 m/s² (8-hr TWA)",
      control: "Low risk from excavator joystick; ensure seat suspension is functional; anti-vibration cab mounts serviceable. Monitor if breaker attachment is fitted.",
    });
  }

  // ─── NOISE ───────────────────────────────────────────────────────────────────
  const noiseSources: NoiseSource[] = [
    {
      source: "360° excavator (working)",
      approximate_db: "Approx. 75–80 dB(A) at operator position; approx. 70 dB(A) at 5m",
      control: "Below UEAV at operator position; hearing protection recommended for prolonged proximity. Erect acoustic hoardings adjacent to noise-sensitive receptors where required.",
    },
  ];
  if (hasCompaction) {
    noiseSources.push({
      source: "Vibratory plate compactor",
      approximate_db: "Approx. 92–98 dB(A) at 1m",
      control: "Above UEAV (85 dB) — mandatory hearing protection zone declared; ear defenders (SNR 28+) mandatory for all operatives within 5m during operation. Restrict operation to agreed working hours.",
    });
  }
  if (hasBreaking) {
    noiseSources.push({
      source: "Hydraulic/pneumatic breaker",
      approximate_db: "Approx. 100–110 dB(A) at 1m",
      control: "Well above UEAV — mandatory hearing protection zone with 10m exclusion for non-essential personnel; ear defenders mandatory; restrict to agreed hours; notify neighbours in advance.",
    });
  }

  // ─── INDUSTRY METHOD STEPS ───────────────────────────────────────────────────
  if (isElectrical && !isExcavation) {
    addStep("Isolation and LOTO (Lock-Out Tag-Out)", `Before commencing any electrical work, ${input.supervisor} to confirm all circuits to be worked on are isolated at the distribution board and tested dead using an approved voltage indicator. Isolation to be locked off with a personal padlock; a 'Do Not Energise' label to be affixed. EICR record of isolation to be made before work commences. No live working without a specific Permit to Work signed by ${input.supervisor}.`);
    addStep("Cable installation and containment", "Install cable containment (trunking, conduit, cable tray) in accordance with the project drawings and BS 7671. Cables to be run, terminated, and labelled in accordance with the circuit schedule. Minimum bending radii to be maintained. All trunking joints and entries to be made off to manufacturer's instructions. Support fixings at correct centres per containment type.");
    addStep("Test, inspect and certify", "On completion of installation, carry out full inspection and testing in accordance with BS 7671 Part 6: continuity, insulation resistance, polarity, earth fault loop impedance, RCD operation, and prospective fault current. All test results to be recorded on an Electrical Installation Certificate (EIC) or Minor Works Certificate (MWC) as appropriate. Do not energise the installation without sign-off from a qualified test engineer.");
  }
  if (isScaffolding && !isExcavation) {
    addStep("Scaffold design check and pre-erection planning", `${input.supervisor} to review the project specification and confirm whether a standard scaffold compliant with NASC TG20:21 is applicable, or whether a bespoke design by a Temporary Works Engineer is required. Obtain all necessary permissions and establish unloading and erection zones. Brief all scaffold erectors on the design intent and site-specific constraints before erection commences.`);
    addStep("Scaffold erection", "Erect scaffold in accordance with the approved design/TG20 standard. All erectors to hold current CISRS card at appropriate level. Ground conditions to be assessed before base plates are positioned; sole boards to be used where ground is soft. All lifts to be fully boarded, braced, and tied before proceeding to next lift. Erect edge protection (double guardrail + toeboard) at every working platform.");
    addStep("Scaffold handover inspection", "On completion, carry out formal handover inspection using a scaffold inspection tag/form. Complete TG20/bespoke design compliance checklist. Hand over the scaffold to the Principal Contractor/client with a completed SG4:22 handover record. Scaffold inspection to be repeated after any alteration or adverse weather event (≥50 mph wind) and results recorded.");
  }
  if (isRoofing && !isExcavation) {
    addStep("Pre-work survey and edge protection installation", `${input.supervisor} to carry out a pre-work survey to identify fragile surfaces, rooflights, and roof drainage. Confirm the fragility classification of the roof surface (ACR[M]001). Install collective edge protection (barriers, safety nets — BS EN 1263-1, or FASET-inspected nets) before any operatives access the roof. All edge protection to be inspected and recorded on a scaffold tag before use.`);
    addStep("Safe access and roofing works", "Access the roof using the agreed access route (scaffold staircase, fixed ladder with hoops). Lay crawl boards over any fragile surfaces before operatives walk on them. Roofing works to proceed in accordance with the project specification. No operative to stand directly on fragile roof elements. Check weather forecast; cease works if wind speed exceeds 25 mph or surface is wet/icy.");
    addStep("Material handling and waste management", "Use mechanical lifting aids (scaffold hoists, crane) for materials above 25 kg where practicable. Do not overload roof or scaffold with materials — distribute loads across structural members. All waste, off-cuts, and old roofing materials to be removed promptly. Bagged and contained waste to be lowered using a rubbish chute or controlled lowering — no throwing debris from roof.");
  }

  // ─── SCOPE ───────────────────────────────────────────────────────────────────
  const industryLabel = input.industry_type ? ` (${input.industry_type})` : "";
  const scopeOfWorks = `${input.company_name} will carry out the following ${industryLabel} works at ${input.project_name} (${input.site_address}) as a subcontractor to the Principal Contractor, ${input.principal_contractor}. Works comprise: ${input.activity}. Works will be undertaken by ${input.operatives} under the direct supervision of ${input.supervisor}. Plant and equipment to be deployed: ${plantList.join(", ")}. Planned commencement date: ${input.start_date}. Estimated duration: ${input.duration}. All works will be executed in strict accordance with this Risk Assessment and Method Statement, the Principal Contractor's Construction Phase Plan, and the requirements of CDM Regulations 2015. This RAMS document must be submitted to and approved by the Principal Contractor before any works commence on site.`;

  return {
    document_ref: docRef,
    revision: input.revision || "Rev 0",
    revision_description: input.revision_description || "Initial issue",
    date: dateStr,
    _source: "template" as const,
    company: {
      name: input.company_name,
      address: input.company_address,
      reg: input.company_reg,
      phone: input.company_phone,
      email: input.company_email,
      logo: input.company_logo,
    },
    project: {
      name: input.project_name,
      site_address: input.site_address,
      principal_contractor: input.principal_contractor,
      supervisor: input.supervisor,
      start_date: input.start_date,
      duration: input.duration,
      po_reference: input.po_reference,
      working_hours: input.working_hours,
    },
    scope_of_works: scopeOfWorks,
    legislation,
    risk_assessment: risks,
    method_statement: {
      sequence_of_works: steps,
      plant_and_equipment: plantAndEquipment,
      ppe_requirements: ppe,
      supervision: `All works to be directly supervised by ${input.supervisor} (Site Supervisor) who must hold a valid SSSTS or SMSTS certificate and have demonstrable experience in the relevant trade. CSCS cards to be carried by all operatives. Plant operators to hold current CPCS/NPORS tickets appropriate to the machine operated. A copy of this RAMS, all plant pre-start inspection records, and relevant permits/registers to be maintained on site and available for inspection at all times.`,
      emergency_procedures: {
        first_aid: input.first_aider_name
          ? `First Aider on site: ${input.first_aider_name} — First Aid at Work certificate to be held on site. First aid kit location: to be confirmed on induction. RIDDOR reportable injuries to be reported to the HSE within required timescales and notified to ${input.principal_contractor} immediately.`
          : `Trained First Aider to be on site at all times during works (First Aid certificate current within 3 years). First aid kit to be accessible in site welfare. Location of first aid box to be communicated to all operatives during pre-start briefing. RIDDOR reportable injuries to be reported to the HSE within required timescales and notified to ${input.principal_contractor} immediately.`,
        emergency_contacts: `999 (Police/Fire/Ambulance). Site Supervisor: ${input.supervisor}. On-site emergency contact: ${input.emergency_contact}. PC Emergency Contact: To be confirmed by ${input.principal_contractor} before works commence.`,
        nearest_hospital: input.nearest_hospital || "To be confirmed by site supervisor before works commence — display on site noticeboard.",
        evacuation: `Follow ${input.principal_contractor}'s site emergency evacuation plan as communicated during site induction. Muster point to be confirmed at pre-start briefing. Operatives to be accounted for by ${input.supervisor} following any evacuation.`,
        ...(isExcavation && {
          excavation_collapse: "DO NOT attempt to dig out a trapped person with mechanical plant — risk of secondary collapse. Call 999 immediately. Clear non-essential personnel from the area. If safe to do so and without entering the excavation, try to establish verbal contact with the casualty. Await Fire and Rescue Service who have specialist confined space rescue capability. Do not enter the collapsed excavation under any circumstances.",
        }),
        ...(isConfinedSpace && {
          confined_space_rescue: `Non-entry rescue policy: retrieval of an incapacitated operative must be attempted using the tripod, harness, and lifeline BEFORE any attempt at entry rescue. If rescue cannot be accomplished without entry: call 999 immediately and await specialist confined space rescue team. Standby person MUST NOT enter the excavation without BA equipment and a second standby outside. Confined space rescue procedure to be briefed to all persons before works commence.`,
        }),
        gas_escape: gasPack
          ? gasPack.emergency_procedures.gas_escape
          : isPlumbing
            ? "If a gas escape is suspected: immediately evacuate the area. Do not operate electrical switches or create any ignition source. Call 999 and the National Gas Emergency Service (0800 111 999). Do not re-enter the building until declared safe by the gas emergency responder. Only Gas Safe registered engineers to investigate and make safe."
            : undefined,
      },
      environmental_controls: [
        "All waste materials to be segregated on site and disposed of with valid Waste Transfer Notes to a licensed facility.",
        "Fuel, oil, and any chemicals to be stored in a bunded area; refuelling bowser with drip tray to be used; spill kit (minimum 25L absorbent) on site at all times.",
        "Dust suppression measures to be applied during dry/windy conditions to minimise dust migration to neighbouring properties.",
        "Noise-generating operations to be restricted to the agreed working hours specified in the planning consent / Environmental Management Plan.",
        "Site compound and working areas to be cleaned up at end of each shift; no litter or waste to be left on site.",
        "Any unexpected contaminated material encountered during works to be reported to the PC and specialist consultant immediately; works to halt pending investigation.",
      ],
      coshh_substances: coshh,
      welfare_arrangements: input.welfare_arrangements || `Welfare facilities to be provided in accordance with CDM 2015 Schedule 2. Provision to include: toilet facilities (flushing WC or chemical toilet), washing facilities with hot and cold running water and soap, drinking water, rest area, and facilities for warming food. Location of all welfare facilities to be communicated during site induction. Welfare provision to be agreed with the Principal Contractor, ${input.principal_contractor}, before works commence.`,
    },
    havs_assessment: {
      applicable: hasCompaction || hasBreaking,
      tools: havsTools,
    },
    noise_assessment: {
      applicable: hasCompaction || hasBreaking || hasPlant,
      sources: noiseSources,
    },
    sign_off: {
      prepared_by: input.prepared_by || input.supervisor,
      position: input.prepared_by_position || "Site Supervisor / Health & Safety Coordinator",
      date_prepared: dateStr,
      review_date: `12 months from ${dateStr} or immediately following any incident, accident, or significant change in the scope of works`,
      approved_by: input.approved_by,
      approved_by_position: input.approved_by_position,
    },
  };
}
