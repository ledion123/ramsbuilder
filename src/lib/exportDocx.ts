import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  Packer,
  ShadingType,
  convertInchesToTwip,
  PageOrientation,
  SectionType,
  TableLayoutType,
} from "docx";
import type { RAMSDocument, RiskAssessmentItem } from "./types";

const ACCENT = "2563EB";
const DARK = "1E293B";
const MID = "0F2040";
const LIGHT = "F8FAFC";
const GREEN = "16A34A";
const AMBER = "D97706";
const RED = "DC2626";

function riskColor(score: number): string {
  if (score <= 6) return GREEN;
  if (score <= 14) return AMBER;
  return RED;
}

function noBorder() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };
}

function thinBorder() {
  const b = { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" };
  return { top: b, bottom: b, left: b, right: b };
}

function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
    },
    run: { color: DARK, bold: true },
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        color: "FFFFFF",
        size: 20,
      }),
    ],
    spacing: { before: 200, after: 80 },
    shading: { type: ShadingType.SOLID, color: MID, fill: MID },
    indent: { left: convertInchesToTwip(0.1), right: convertInchesToTwip(0.1) },
  });
}

function para(text: string, opts: { bold?: boolean; italic?: boolean; size?: number; color?: string } = {}): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: opts.bold,
        italics: opts.italic,
        size: opts.size ?? 18,
        color: opts.color ?? DARK,
      }),
    ],
    spacing: { after: 60 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 18, color: DARK })],
    spacing: { after: 40 },
  });
}

function labelValue(label: string, value: string): Paragraph[] {
  return [
    new Paragraph({
      children: [new TextRun({ text: label, bold: true, size: 16, color: "64748B" })],
      spacing: { after: 20 },
    }),
    new Paragraph({
      children: [new TextRun({ text: value, size: 18, color: DARK })],
      spacing: { after: 80 },
    }),
  ];
}

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 16 })],
      }),
    ],
    shading: { type: ShadingType.SOLID, color: MID, fill: MID },
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: thinBorder(),
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  });
}

function dataCell(text: string, width: number, opts: { bold?: boolean; shading?: string } = {}): TableCell {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 16, bold: opts.bold, color: DARK })] })],
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: opts.shading ? { type: ShadingType.SOLID, color: opts.shading, fill: opts.shading } : undefined,
    borders: thinBorder(),
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
  });
}

function riskCell(score: number, level: string, width: number): TableCell {
  const color = riskColor(score);
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `${score} ${level}`, bold: true, size: 14, color: "FFFFFF" })],
      }),
    ],
    shading: { type: ShadingType.SOLID, color, fill: color },
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: thinBorder(),
    margins: { top: 40, bottom: 40, left: 60, right: 60 },
  });
}

function numCell(value: number, width: number): TableCell {
  // Subtle shading: green ≤2, amber ≤3, red ≥4
  const color = value <= 2 ? "DCFCE7" : value <= 3 ? "FEF9C3" : "FEE2E2";
  return new TableCell({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: String(value), bold: true, size: 16, color: DARK })],
      }),
    ],
    shading: { type: ShadingType.SOLID, color, fill: color },
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: thinBorder(),
    margins: { top: 60, bottom: 60, left: 40, right: 40 },
  });
}

function makeRiskTable(risks: RiskAssessmentItem[]): Table {
  const headers = new TableRow({
    tableHeader: true,
    children: [
      headerCell("#", 4),
      headerCell("Hazard", 13),
      headerCell("Who at Risk", 9),
      headerCell("L", 5),
      headerCell("S", 5),
      headerCell("Score", 7),
      headerCell("Control Measures", 50),
      headerCell("Residual", 7),
    ],
  });

  const rows = risks.map(
    (item, i) =>
      new TableRow({
        children: [
          dataCell(item.ref, 4, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          dataCell(item.hazard, 13, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          dataCell(item.who_at_risk, 9, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          numCell(item.likelihood_pre, 5),
          numCell(item.severity_pre, 5),
          riskCell(item.risk_score_pre, item.risk_level_pre, 7),
          new TableCell({
            children: item.control_measures.map((cm) => bullet(cm)),
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: thinBorder(),
            shading: i % 2 === 0 ? undefined : { type: ShadingType.SOLID, color: "F8FAFC", fill: "F8FAFC" },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
          }),
          riskCell(item.risk_score_post, item.risk_level_post, 7),
        ],
      })
  );

  return new Table({
    rows: [headers, ...rows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
  });
}

export async function generateDocx(data: RAMSDocument): Promise<Buffer> {
  const doc = new Document({
    sections: [
      // ── Section 1: Portrait — Cover + Scope + Method Statement ──
      {
        properties: { page: { size: { orientation: PageOrientation.PORTRAIT } } },
        children: [
          // Cover
          new Paragraph({
            children: [new TextRun({ text: data.company.name, bold: true, size: 36, color: DARK })],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [new TextRun({ text: data.company.address, size: 16, color: "64748B" })],
            spacing: { after: 20 },
          }),
          ...(data.company.reg ? [new Paragraph({ children: [new TextRun({ text: `Reg. No. ${data.company.reg}`, size: 15, color: "64748B" })], spacing: { after: 20 } })] : []),
          ...(data.company.phone ? [new Paragraph({ children: [new TextRun({ text: `Tel: ${data.company.phone}`, size: 15, color: "64748B" })], spacing: { after: 20 } })] : []),
          ...(data.company.email ? [new Paragraph({ children: [new TextRun({ text: data.company.email, size: 15, color: "64748B" })], spacing: { after: 200 } })] : [new Paragraph({ spacing: { after: 200 } })]),
          new Paragraph({
            children: [new TextRun({ text: "RISK ASSESSMENT & METHOD STATEMENT", bold: true, size: 48, color: DARK })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "CDM 2015 Compliant | Submitted to Principal Contractor for Approval", size: 20, color: "64748B" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
          }),
          new Table({
            rows: [
              new TableRow({ children: [dataCell("Document Reference:", 25, { bold: true }), dataCell(data.document_ref, 25), dataCell("Revision:", 25, { bold: true }), dataCell(data.revision, 25)] }),
              new TableRow({ children: [dataCell("Project Name:", 25, { bold: true }), dataCell(data.project.name, 25), dataCell("Date:", 25, { bold: true }), dataCell(data.date, 25)] }),
              new TableRow({ children: [dataCell("Principal Contractor:", 25, { bold: true }), dataCell(data.project.principal_contractor, 25), dataCell("Site Supervisor:", 25, { bold: true }), dataCell(data.project.supervisor, 25)] }),
              new TableRow({ children: [dataCell("Site Address:", 25, { bold: true }), dataCell(data.project.site_address, 25), dataCell("Start Date:", 25, { bold: true }), dataCell(data.project.start_date, 25)] }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h2("Scope of Works"),
          para(data.scope_of_works),

          h2("PART 2 — Method Statement"),
          h1("1. Sequence of Works"),
          ...data.method_statement.sequence_of_works.flatMap((step) => [
            new Paragraph({
              children: [
                new TextRun({ text: `Step ${step.step}: `, bold: true, size: 18, color: ACCENT }),
                new TextRun({ text: step.title, bold: true, size: 18, color: DARK }),
              ],
              spacing: { before: 120, after: 40 },
            }),
            para(step.description),
          ]),

          h1("2. Plant & Equipment"),
          new Table({
            rows: [
              new TableRow({ tableHeader: true, children: [headerCell("Item", 40), headerCell("PUWER / LOLER Compliance Requirement", 60)] }),
              ...data.method_statement.plant_and_equipment.map((p, i) =>
                new TableRow({ children: [dataCell(p.item, 40, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }), dataCell(p.requirement, 60, { shading: i % 2 === 0 ? undefined : "F8FAFC" })] })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h1("3. PPE Requirements"),
          new Table({
            rows: [
              new TableRow({ tableHeader: true, children: [headerCell("PPE Item", 40), headerCell("Standard / Specification", 45), headerCell("Mandatory?", 15)] }),
              ...data.method_statement.ppe_requirements.map(
                (p, i) =>
                  new TableRow({
                    children: [
                      dataCell(p.item, 40, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(p.standard, 45, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      new TableCell({
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: p.mandatory ? "YES" : "Req'd", bold: true, size: 14, color: "FFFFFF" })] })],
                        shading: { type: ShadingType.SOLID, color: p.mandatory ? GREEN : "94A3B8", fill: p.mandatory ? GREEN : "94A3B8" },
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        borders: thinBorder(),
                        margins: { top: 60, bottom: 60, left: 60, right: 60 },
                      }),
                    ],
                  })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h1("4. Supervision Arrangements"),
          para(data.method_statement.supervision),

          h1("5. Emergency Arrangements"),
          ...labelValue("First Aid", data.method_statement.emergency_procedures.first_aid),
          ...labelValue("Emergency Contacts", data.method_statement.emergency_procedures.emergency_contacts),
          ...labelValue("Nearest A&E", data.method_statement.emergency_procedures.nearest_hospital),
          ...labelValue("Muster / Evacuation", data.method_statement.emergency_procedures.evacuation),
          ...(data.method_statement.emergency_procedures.excavation_collapse ? labelValue("Excavation Collapse", data.method_statement.emergency_procedures.excavation_collapse) : []),
          ...(data.method_statement.emergency_procedures.confined_space_rescue ? labelValue("Confined Space Rescue", data.method_statement.emergency_procedures.confined_space_rescue) : []),
          ...(data.method_statement.emergency_procedures.gas_escape ? labelValue("Gas Escape", data.method_statement.emergency_procedures.gas_escape) : []),
          ...(data.method_statement.emergency_procedures.ohl_contact ? labelValue("OHL Contact", data.method_statement.emergency_procedures.ohl_contact) : []),

          h1("6. Environmental Considerations"),
          ...data.method_statement.environmental_controls.map((ec) => bullet(ec)),
        ],
      },

      // ── Section 2: Landscape — Risk Assessment ──
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: { orientation: PageOrientation.LANDSCAPE } },
        },
        children: [
          h2("PART 1 — Risk Assessment"),
          new Paragraph({
            children: [
              new TextRun({ text: "Persons at Risk: ", bold: true, size: 16, color: DARK }),
              new TextRun({ text: Array.from(new Set(data.risk_assessment.map(r => r.who_at_risk))).join(" · "), size: 16, color: DARK }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Risk Score = L × S  |  ", size: 16, color: "64748B" }),
              new TextRun({ text: "LOW 1–6  ", size: 16, bold: true, color: GREEN }),
              new TextRun({ text: "MEDIUM 7–14  ", size: 16, bold: true, color: AMBER }),
              new TextRun({ text: "HIGH 15–25", size: 16, bold: true, color: RED }),
            ],
            spacing: { after: 120 },
          }),
          makeRiskTable(data.risk_assessment),
        ],
      },

      // ── Section 3: Portrait — Sign-Off + Briefing Record ──
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: { orientation: PageOrientation.PORTRAIT } },
        },
        children: [
          h2("Sign-Off & Briefing Record"),
          new Table({
            rows: [
              new TableRow({ tableHeader: true, children: [headerCell("Role", 25), headerCell("Name", 25), headerCell("Date", 25), headerCell("Signature", 25)] }),
              new TableRow({ children: [dataCell("Prepared by (Subcontractor)", 25, { bold: true }), dataCell(data.sign_off.prepared_by || "—", 25), dataCell(data.sign_off.date_prepared, 25), dataCell("_______________________", 25)] }),
              new TableRow({ children: [dataCell("Position", 25, { bold: true }), dataCell(data.sign_off.position || "—", 25), dataCell("Review Date", 25, { bold: true }), dataCell(data.sign_off.review_date, 25)] }),
              new TableRow({ children: [dataCell("Approved by (PC)", 25, { bold: true }), dataCell("", 25), dataCell("", 25), dataCell("_______________________", 25)] }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          new Paragraph({ spacing: { before: 240 } }),
          h2("Worker Briefing Record"),
          new Paragraph({
            children: [new TextRun({ text: "All operatives must sign below to confirm they have been briefed on and understand the contents of this RAMS before works commence.", size: 16, color: "64748B", italics: true })],
            spacing: { after: 120 },
          }),
          new Table({
            rows: [
              new TableRow({ tableHeader: true, children: [headerCell("No.", 5), headerCell("Name (print)", 25), headerCell("Company", 25), headerCell("Date", 15), headerCell("Signature", 30)] }),
              ...Array.from({ length: 20 }, (_, i) =>
                new TableRow({
                  children: [
                    dataCell(String(i + 1), 5),
                    dataCell("", 25),
                    dataCell("", 25),
                    dataCell("", 15),
                    dataCell("", 30),
                  ],
                })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc) as Promise<Buffer>;
}
