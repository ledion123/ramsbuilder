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

function makeRiskTable(risks: RiskAssessmentItem[]): Table {
  const headers = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Ref", 5),
      headerCell("Hazard", 12),
      headerCell("Description", 18),
      headerCell("Who at Risk", 8),
      headerCell("Pre-Control Risk", 9),
      headerCell("Control Measures", 28),
      headerCell("Post-Control Risk", 9),
      headerCell("Legislation", 11),
    ],
  });

  const rows = risks.map(
    (item, i) =>
      new TableRow({
        children: [
          dataCell(item.ref, 5, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          dataCell(item.hazard, 12, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          dataCell(item.description, 18, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          dataCell(item.who_at_risk, 8, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
          riskCell(item.risk_score_pre, item.risk_level_pre, 9),
          new TableCell({
            children: item.control_measures.map((cm) => bullet(cm)),
            width: { size: 28, type: WidthType.PERCENTAGE },
            borders: thinBorder(),
            shading: i % 2 === 0 ? undefined : { type: ShadingType.SOLID, color: "F8FAFC", fill: "F8FAFC" },
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
          }),
          riskCell(item.risk_score_post, item.risk_level_post, 9),
          dataCell(item.legislation_ref, 11, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
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
      // ── Section 1: Portrait — Cover, Scope, Legislation, Method ──
      {
        properties: { page: { size: { orientation: PageOrientation.PORTRAIT } } },
        children: [
          // Cover
          new Paragraph({
            children: [
              new TextRun({ text: data.company.name, bold: true, size: 36, color: DARK }),
            ],
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
            children: [
              new TextRun({ text: "RISK ASSESSMENT & METHOD STATEMENT", bold: true, size: 48, color: DARK }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: "CDM 2015 Compliant | Submitted to Principal Contractor for Approval", size: 20, color: "64748B" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
          }),
          // Project details table
          new Table({
            rows: [
              new TableRow({
                children: [
                  dataCell("Document Reference:", 25, { bold: true }),
                  dataCell(data.document_ref, 25),
                  dataCell("Revision:", 25, { bold: true }),
                  dataCell(data.revision, 25),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Project Name:", 25, { bold: true }),
                  dataCell(data.project.name, 25),
                  dataCell("Date:", 25, { bold: true }),
                  dataCell(data.date, 25),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Site Address:", 25, { bold: true }),
                  dataCell(data.project.site_address, 75, {}),
                ],
                // @ts-expect-error columnSpan not in type defs for this docx version
                columnSpan: undefined,
              }),
              new TableRow({
                children: [
                  dataCell("Principal Contractor:", 25, { bold: true }),
                  dataCell(data.project.principal_contractor, 25),
                  dataCell("Site Supervisor:", 25, { bold: true }),
                  dataCell(data.project.supervisor, 25),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Planned Start Date:", 25, { bold: true }),
                  dataCell(data.project.start_date, 25),
                  dataCell("Duration:", 25, { bold: true }),
                  dataCell(data.project.duration, 25),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h2("Scope of Works"),
          para(data.scope_of_works),

          h2("Applicable Legislation"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("Regulation", 35), headerCell("Relevance to These Works", 65)],
              }),
              ...data.legislation.map(
                (leg, i) =>
                  new TableRow({
                    children: [
                      dataCell(leg.regulation, 35, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(leg.relevance, 65, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                    ],
                  })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h2("Sequence of Works — Method Statement"),
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

          h2("Supervision Arrangements"),
          para(data.method_statement.supervision),

          h2("Emergency Procedures"),
          ...labelValue("First Aid", data.method_statement.emergency_procedures.first_aid),
          ...labelValue("Emergency Contacts", data.method_statement.emergency_procedures.emergency_contacts),
          ...labelValue("Nearest Hospital", data.method_statement.emergency_procedures.nearest_hospital),
          ...labelValue("Evacuation Procedure", data.method_statement.emergency_procedures.evacuation),
          ...(data.method_statement.emergency_procedures.excavation_collapse
            ? labelValue("Excavation Collapse Procedure", data.method_statement.emergency_procedures.excavation_collapse)
            : []),
          ...(data.method_statement.emergency_procedures.confined_space_rescue
            ? labelValue("Confined Space Rescue", data.method_statement.emergency_procedures.confined_space_rescue)
            : []),
          ...(data.method_statement.emergency_procedures.gas_escape
            ? labelValue("Gas Escape Procedure", data.method_statement.emergency_procedures.gas_escape)
            : []),

          h2("Environmental Controls"),
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
          h2("Risk Assessment — 5×5 Matrix"),
          new Paragraph({
            children: [
              new TextRun({ text: "Risk Score = Likelihood × Severity  |  ", size: 16, color: "64748B" }),
              new TextRun({ text: "LOW: 1–6  ", size: 16, bold: true, color: GREEN }),
              new TextRun({ text: "MEDIUM: 7–14  ", size: 16, bold: true, color: AMBER }),
              new TextRun({ text: "HIGH: 15–25", size: 16, bold: true, color: RED }),
            ],
            spacing: { after: 120 },
          }),
          makeRiskTable(data.risk_assessment),
        ],
      },

      // ── Section 3: Portrait — Plant, PPE, COSHH, HAVS, Noise, Sign-off ──
      {
        properties: {
          type: SectionType.NEXT_PAGE,
          page: { size: { orientation: PageOrientation.PORTRAIT } },
        },
        children: [
          h2("Plant & Equipment"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("Item", 40), headerCell("Competency / Inspection Requirement", 60)],
              }),
              ...data.method_statement.plant_and_equipment.map(
                (p, i) =>
                  new TableRow({
                    children: [
                      dataCell(p.item, 40, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(p.requirement, 60, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                    ],
                  })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h2("PPE Requirements"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("PPE Item", 35), headerCell("Standard / Specification", 50), headerCell("Mandatory?", 15)],
              }),
              ...data.method_statement.ppe_requirements.map(
                (p, i) =>
                  new TableRow({
                    children: [
                      dataCell(p.item, 35, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(p.standard, 50, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: p.mandatory ? "YES" : "Where applicable", bold: true, size: 14, color: "FFFFFF" })],
                          }),
                        ],
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

          h2("COSHH Assessment"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("Substance", 22), headerCell("Health Risk", 28), headerCell("Control Measures", 42), headerCell("Reg.", 8)],
              }),
              ...data.method_statement.coshh_substances.map(
                (c, i) =>
                  new TableRow({
                    children: [
                      dataCell(c.substance, 22, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(c.risk, 28, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(c.control, 42, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(c.regulation, 8, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                    ],
                  })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          ...(data.havs_assessment.applicable
            ? [
                h2("HAVS Assessment"),
                new Table({
                  rows: [
                    new TableRow({
                      tableHeader: true,
                      children: [headerCell("Tool", 30), headerCell("Vibration Level", 30), headerCell("Exposure Limits", 20), headerCell("Control", 20)],
                    }),
                    ...data.havs_assessment.tools.map(
                      (h, i) =>
                        new TableRow({
                          children: [
                            dataCell(h.tool, 30, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                            dataCell(h.vibration_level, 30, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                            dataCell(h.daily_exposure_limit, 20, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                            dataCell(h.control, 20, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                          ],
                        })
                    ),
                  ],
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
              ]
            : []),

          h2("Noise Assessment"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("Noise Source", 35), headerCell("Approx. Level dB(A)", 25), headerCell("Control Measures", 40)],
              }),
              ...data.noise_assessment.sources.map(
                (n, i) =>
                  new TableRow({
                    children: [
                      dataCell(n.source, 35, { bold: true, shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(n.approximate_db, 25, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                      dataCell(n.control, 40, { shading: i % 2 === 0 ? undefined : "F8FAFC" }),
                    ],
                  })
              ),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          h2("Document Sign-Off"),
          new Table({
            rows: [
              new TableRow({
                tableHeader: true,
                children: [headerCell("Role", 25), headerCell("Name", 25), headerCell("Date", 25), headerCell("Signature", 25)],
              }),
              new TableRow({
                children: [
                  dataCell("Prepared by (Subcontractor)", 25, { bold: true }),
                  dataCell(data.sign_off.prepared_by, 25),
                  dataCell(data.sign_off.date_prepared, 25),
                  dataCell("_______________________", 25),
                ],
              }),
              new TableRow({
                children: [
                  dataCell("Reviewed & Approved (Principal Contractor)", 25, { bold: true }),
                  dataCell("", 25),
                  dataCell("", 25),
                  dataCell("_______________________", 25),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),

          new Paragraph({ spacing: { before: 120 } }),
          para(`Review Date: ${data.sign_off.review_date}`, { italic: true, color: "64748B", size: 16 }),
          para("This document must be reviewed annually or immediately following any incident, accident, or change in the scope of works.", { italic: true, color: "94A3B8", size: 14 }),
        ],
      },
    ],
  });

  return Packer.toBuffer(doc) as Promise<Buffer>;
}
