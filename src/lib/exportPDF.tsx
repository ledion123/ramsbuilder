import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { RAMSDocument, RiskAssessmentItem } from "./types";

// ── Register Roboto (falls back to Helvetica if offline) ─────────
Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc-.ttf", fontWeight: 700 },
  ],
});

// ── Colour palette (light professional theme) ────────────────────
const NAVY        = "#1a2e4a";   // header bands, footer bands, logo bg
const BRAND       = "#2563eb";   // blue-600 — section left border, step badges
const PAGE_BG     = "#ffffff";
const BODY_TEXT   = "#1e293b";
const MUTED       = "#64748b";
const HEADER_BG   = "#f1f5f9";   // running header background
const ROW_ALT     = "#f8fafc";
const TABLE_BORDER = "#cbd5e1";
const GREEN = "#16a34a";
const AMBER = "#d97706";
const RED   = "#dc2626";

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({

  // ── Cover page ──────────────────────────────────────────────────
  coverPage: {
    fontFamily: "Roboto",
    fontSize: 9,
    backgroundColor: PAGE_BG,
    padding: 0,
    flexDirection: "column",
  },
  coverTopBand: {
    backgroundColor: NAVY,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    justifyContent: "space-between",
    flexShrink: 0,
  },
  coverLogoArea: {
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  coverLogoImage: {
    height: 36,
    maxWidth: 130,
    objectFit: "contain",
  },
  coverLogoFallback: {
    fontSize: 14,
    fontWeight: 700,
    color: "#ffffff",
    maxWidth: 160,
  },
  coverBandTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: 0.8,
    textAlign: "right",
    maxWidth: 200,
    lineHeight: 1.35,
  },
  coverBody: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 36,
    paddingBottom: 0,
    flexDirection: "column",
  },
  coverProjectName: {
    fontSize: 26,
    fontWeight: 700,
    color: NAVY,
    lineHeight: 1.1,
    marginBottom: 6,
  },
  coverProjectSite: {
    fontSize: 11,
    color: MUTED,
    marginBottom: 20,
  },
  coverDivider: {
    height: 1,
    backgroundColor: TABLE_BORDER,
    marginBottom: 20,
  },
  coverInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  coverInfoCol: {
    width: "50%",
    marginBottom: 12,
    paddingRight: 12,
  },
  coverInfoLabel: {
    fontSize: 6.5,
    color: MUTED,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  coverInfoValue: {
    fontSize: 9.5,
    fontWeight: 700,
    color: BODY_TEXT,
  },
  // Revision history on cover
  coverRevTable: {
    borderWidth: 0.5,
    borderColor: TABLE_BORDER,
    marginBottom: 0,
  },
  coverRevHeader: {
    flexDirection: "row",
    backgroundColor: NAVY,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  coverRevHeaderCell: {
    fontWeight: 700,
    color: "#ffffff",
    fontSize: 7.5,
  },
  coverRevRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: TABLE_BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  coverRevCell: {
    fontSize: 8,
    color: BODY_TEXT,
  },
  coverBottomBand: {
    backgroundColor: NAVY,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 24,
    marginTop: "auto",
    flexShrink: 0,
  },
  coverBottomText: {
    fontSize: 7.5,
    color: "rgba(255,255,255,0.7)",
  },

  // ── Content pages ───────────────────────────────────────────────
  contentPage: {
    fontFamily: "Roboto",
    fontSize: 9,
    color: BODY_TEXT,
    backgroundColor: PAGE_BG,
    paddingTop: 54,
    paddingBottom: 44,
    paddingHorizontal: 36,
  },
  landscapePage: {
    fontFamily: "Roboto",
    fontSize: 9,
    color: BODY_TEXT,
    backgroundColor: PAGE_BG,
    paddingTop: 54,
    paddingBottom: 44,
    paddingHorizontal: 28,
  },

  // ── Running header (light) ──────────────────────────────────────
  runningHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: HEADER_BG,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: NAVY,
  },
  rhLeft:   { flex: 1, fontSize: 7, color: MUTED },
  rhCentre: { flex: 1, textAlign: "center", fontSize: 7, fontWeight: 700, color: BODY_TEXT, letterSpacing: 0.3 },
  rhRight:  { flex: 1, textAlign: "right", fontSize: 7, color: MUTED },

  // ── Footer ─────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 14,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: TABLE_BORDER,
    paddingTop: 3,
  },
  footerText: { fontSize: 6.5, color: MUTED },

  // ── Section headers ─────────────────────────────────────────────
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ROW_ALT,
    borderLeftWidth: 3,
    borderLeftColor: BRAND,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: BODY_TEXT,
    letterSpacing: 0.3,
  },

  // ── Tables ─────────────────────────────────────────────────────
  table: { borderWidth: 0.5, borderColor: TABLE_BORDER, marginBottom: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: NAVY,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderCell: { fontWeight: 700, color: "#ffffff", fontSize: 7.5 },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: TABLE_BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: PAGE_BG,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: TABLE_BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: ROW_ALT,
  },
  tableCell: { fontSize: 8, color: BODY_TEXT },

  // ── Project info box ────────────────────────────────────────────
  projectBox: {
    backgroundColor: ROW_ALT,
    borderWidth: 0.5,
    borderColor: TABLE_BORDER,
    borderRadius: 2,
    padding: 10,
    marginBottom: 12,
  },
  projectGrid: { flexDirection: "row", flexWrap: "wrap" },
  projectField:     { width: "50%", marginBottom: 6 },
  projectFieldFull: { width: "100%", marginBottom: 6 },
  fieldLabel: { fontSize: 7, color: MUTED, fontWeight: 700, marginBottom: 1, letterSpacing: 0.3 },
  fieldValue: { fontSize: 9, color: BODY_TEXT },

  // ── Risk score full-cell ────────────────────────────────────────
  riskCell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 7.5,
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
    borderRadius: 2,
  },

  // ── Method steps ───────────────────────────────────────────────
  stepRow:     { flexDirection: "row", marginBottom: 8, gap: 8 },
  stepBadge:   { width: 22, height: 22, borderRadius: 11, backgroundColor: BRAND, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  stepNum:     { fontSize: 9, fontWeight: 700, color: "#ffffff" },
  stepContent: { flex: 1 },
  stepTitle:   { fontSize: 9, fontWeight: 700, color: BODY_TEXT, marginBottom: 2 },
  stepDesc:    { fontSize: 8, color: MUTED, lineHeight: 1.4 },

  // ── Bullets ────────────────────────────────────────────────────
  bulletRow:  { flexDirection: "row", marginBottom: 3, gap: 4 },
  bulletDot:  { fontSize: 9, color: BRAND, width: 8, flexShrink: 0 },
  bulletText: { fontSize: 8, color: BODY_TEXT, flex: 1, lineHeight: 1.4 },

  // ── Sign-off ───────────────────────────────────────────────────
  signOffDeclaration: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: AMBER,
    padding: 8,
    marginBottom: 10,
  },
  signOffDeclarationText: { fontSize: 8, color: "#92400e", lineHeight: 1.4 },
  signOffGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  signOffBox:  { flex: 1, borderWidth: 0.5, borderColor: TABLE_BORDER, padding: 10 },
  signOffBoxTitle: { fontSize: 7.5, fontWeight: 700, color: BRAND, marginBottom: 8, letterSpacing: 0.3 },
  signOffLabel: { fontSize: 7, color: MUTED, fontWeight: 700, marginBottom: 2 },
  signOffValue: { fontSize: 9, color: BODY_TEXT, marginBottom: 8 },
  signOffSigBox: {
    height: 72,
    borderWidth: 0.5,
    borderColor: TABLE_BORDER,
    marginTop: 4,
    justifyContent: "flex-end",
    padding: 3,
  },
  signOffSigLabel: { fontSize: 6.5, color: MUTED },
});

// ── Helpers ──────────────────────────────────────────────────────

function riskColor(score: number): string {
  if (score <= 6) return GREEN;
  if (score <= 14) return AMBER;
  return RED;
}

function riskLabel(score: number): string {
  if (score <= 6) return "LOW";
  if (score <= 14) return "MED";
  return "HIGH";
}

// ── Shared components ────────────────────────────────────────────

function RunningHeader({ company, docRef, revision }: { company: string; docRef: string; revision: string }) {
  return (
    <View fixed style={s.runningHeader}>
      <Text style={s.rhLeft}>{company}</Text>
      <Text style={s.rhCentre}>RISK ASSESSMENT & METHOD STATEMENT</Text>
      <Text style={s.rhRight}>{docRef} | {revision}</Text>
    </View>
  );
}

function PageFooter({ company }: { company: string }) {
  return (
    <View fixed style={s.footer}>
      <Text style={s.footerText}>{company}</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      <Text style={s.footerText}>Printed copies are uncontrolled — see document control for latest revision.</Text>
    </View>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{num}. {title.toUpperCase()}</Text>
    </View>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={full ? s.projectFieldFull : s.projectField}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Text style={s.fieldValue}>{value || "—"}</Text>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bulletRow}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

function RiskScore({ score }: { score: number }) {
  return (
    <View style={[s.riskCell, { backgroundColor: riskColor(score) }]}>
      <Text>{score} ({riskLabel(score)})</Text>
    </View>
  );
}

// ── Risk Matrix (descriptive labels) ────────────────────────────

const LIKELIHOOD_LABELS = ["Rare (1)", "Unlikely (2)", "Possible (3)", "Likely (4)", "Almost Certain (5)"];
const SEVERITY_LABELS   = ["Catastrophic (5)", "Major (4)", "Moderate (3)", "Minor (2)", "Negligible (1)"];
const SEVERITY_VALUES   = [5, 4, 3, 2, 1];

function RiskMatrix() {
  const cellW = 54;
  const labelW = 82;

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 7.5, fontWeight: 700, color: BODY_TEXT, marginBottom: 6 }}>
        5×5 RISK MATRIX — Risk Score = Likelihood × Severity
      </Text>

      {/* Likelihood column headers */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: labelW + 6 }} />
        {LIKELIHOOD_LABELS.map((lbl) => (
          <View key={lbl} style={{ width: cellW, alignItems: "center", paddingBottom: 3 }}>
            <Text style={{ fontSize: 6, fontWeight: 700, color: MUTED, textAlign: "center" }}>{lbl}</Text>
          </View>
        ))}
      </View>

      {/* Matrix rows with severity labels */}
      {SEVERITY_LABELS.map((sevLbl, si) => {
        const sev = SEVERITY_VALUES[si];
        return (
          <View key={sevLbl} style={{ flexDirection: "row", alignItems: "center", marginBottom: 1 }}>
            <Text style={{ fontSize: 6, fontWeight: 700, color: MUTED, width: labelW, textAlign: "right", paddingRight: 6 }}>
              {sevLbl}
            </Text>
            <View style={{ width: 6 }} />
            {[1, 2, 3, 4, 5].map((l) => {
              const score = l * sev;
              const bg = score <= 6 ? GREEN : score <= 14 ? AMBER : RED;
              return (
                <View key={l} style={{ width: cellW, height: 18, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginRight: 1 }}>
                  <Text style={{ fontSize: 7, fontWeight: 700, color: "#ffffff" }}>{score}</Text>
                </View>
              );
            })}
          </View>
        );
      })}

      {/* Legend */}
      <View style={{ flexDirection: "row", gap: 14, marginTop: 7, paddingLeft: labelW + 6 }}>
        {[
          { color: GREEN, label: "Low (1–6) — Acceptable" },
          { color: AMBER, label: "Medium (7–14) — Review controls" },
          { color: RED,   label: "High (15–25) — STOP WORK" },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 10, height: 10, backgroundColor: item.color }} />
            <Text style={{ fontSize: 7, color: MUTED }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Risk assessment table row ────────────────────────────────────

function RiskAssessmentRow({ item, idx }: { item: RiskAssessmentItem; idx: number }) {
  return (
    <View style={idx % 2 === 0 ? s.tableRow : s.tableRowAlt} wrap={false}>
      <Text style={[s.tableCell, { width: "5%" }]}>{item.ref}</Text>
      <View style={{ width: "12%" }}>
        <Text style={[s.tableCell, { fontWeight: 700 }]}>{item.hazard}</Text>
      </View>
      <View style={{ width: "18%" }}>
        <Text style={s.tableCell}>{item.description}</Text>
      </View>
      <Text style={[s.tableCell, { width: "8%" }]}>{item.who_at_risk}</Text>
      <View style={{ width: "9%", alignItems: "center", justifyContent: "flex-start", paddingTop: 1 }}>
        <RiskScore score={item.risk_score_pre} />
      </View>
      <View style={{ width: "30%" }}>
        {item.control_measures.map((cm, i) => <Bullet key={i} text={cm} />)}
      </View>
      <View style={{ width: "9%", alignItems: "center", justifyContent: "flex-start", paddingTop: 1 }}>
        <RiskScore score={item.risk_score_post} />
      </View>
      <Text style={[s.tableCell, { width: "9%", fontSize: 7 }]}>{item.legislation_ref}</Text>
    </View>
  );
}

// ── Worker Briefing Record ───────────────────────────────────────

function WorkerBriefingRecord() {
  const ROWS = 20;
  return (
    <View style={{ marginTop: 16 }}>
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>WORKER BRIEFING RECORD</Text>
      </View>
      <Text style={{ fontSize: 8, color: MUTED, marginBottom: 8 }}>
        All operatives must sign below to confirm they have been briefed on and understood the contents of this RAMS prior to works commencing.
      </Text>
      <View style={s.table}>
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, { width: "6%" }]}>No.</Text>
          <Text style={[s.tableHeaderCell, { width: "24%" }]}>Name (print)</Text>
          <Text style={[s.tableHeaderCell, { width: "22%" }]}>Company</Text>
          <Text style={[s.tableHeaderCell, { width: "14%" }]}>Date</Text>
          <Text style={[s.tableHeaderCell, { width: "34%" }]}>Signature</Text>
        </View>
        {Array.from({ length: ROWS }, (_, i) => (
          <View key={i} style={[i % 2 === 0 ? s.tableRow : s.tableRowAlt, { height: 18 }]}>
            <Text style={[s.tableCell, { width: "6%" }]}>{i + 1}</Text>
            <View style={{ width: "24%", borderRightWidth: 0.5, borderRightColor: TABLE_BORDER }} />
            <View style={{ width: "22%", borderRightWidth: 0.5, borderRightColor: TABLE_BORDER }} />
            <View style={{ width: "14%", borderRightWidth: 0.5, borderRightColor: TABLE_BORDER }} />
            <View style={{ width: "34%" }} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Sign-off block ───────────────────────────────────────────────

function SignOffSection({ data }: { data: RAMSDocument }) {
  return (
    <View>
      <View style={s.signOffDeclaration}>
        <Text style={s.signOffDeclarationText}>
          SUBMISSION NOTICE: This document must be submitted to and approved by {data.project.principal_contractor} before any works commence on site.
          Works must not start until written approval is received from the Principal Contractor.{"\n"}
          I confirm I have reviewed this RAMS and it is fit for purpose for the stated scope of works.
        </Text>
      </View>
      <View style={s.signOffGrid}>
        {/* Prepared By */}
        <View style={s.signOffBox}>
          <Text style={s.signOffBoxTitle}>PREPARED BY</Text>
          <Text style={s.signOffLabel}>NAME</Text>
          <Text style={s.signOffValue}>{data.sign_off.prepared_by || "—"}</Text>
          <Text style={s.signOffLabel}>POSITION</Text>
          <Text style={s.signOffValue}>{data.sign_off.position || "—"}</Text>
          <Text style={s.signOffLabel}>DATE</Text>
          <Text style={s.signOffValue}>{data.sign_off.date_prepared}</Text>
          <Text style={s.signOffLabel}>SIGNATURE</Text>
          <View style={s.signOffSigBox}>
            <Text style={s.signOffSigLabel}>Sign here</Text>
          </View>
        </View>
        {/* Checked By */}
        <View style={s.signOffBox}>
          <Text style={s.signOffBoxTitle}>CHECKED BY</Text>
          <Text style={s.signOffLabel}>NAME</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>POSITION</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>DATE</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>SIGNATURE</Text>
          <View style={s.signOffSigBox}>
            <Text style={s.signOffSigLabel}>Sign here</Text>
          </View>
        </View>
        {/* Approved By (PC) */}
        <View style={s.signOffBox}>
          <Text style={s.signOffBoxTitle}>APPROVED BY (PC)</Text>
          <Text style={s.signOffLabel}>NAME</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>POSITION</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>DATE</Text>
          <View style={{ height: 16, borderBottomWidth: 0.5, borderBottomColor: TABLE_BORDER, marginBottom: 8 }} />
          <Text style={s.signOffLabel}>SIGNATURE</Text>
          <View style={s.signOffSigBox}>
            <Text style={s.signOffSigLabel}>Sign here</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 7, color: MUTED, marginTop: 4, textAlign: "center" }}>
        Review Date: {data.sign_off.review_date}
      </Text>
    </View>
  );
}

// ── Main PDF document ────────────────────────────────────────────

function RAMSPdfDoc({ data }: { data: RAMSDocument }) {
  const rh = { company: data.company.name, docRef: data.document_ref, revision: data.revision };
  const footer = { company: data.company.name };

  return (
    <Document title={`${data.document_ref} — RAMS`} author={data.company.name}>

      {/* ── Cover Page ── */}
      <Page size="A4" style={s.coverPage}>

        {/* Top navy band: logo LEFT + title RIGHT */}
        <View style={s.coverTopBand}>
          <View style={s.coverLogoArea}>
            {data.company.logo
              ? <Image src={data.company.logo} style={s.coverLogoImage} />
              : <Text style={s.coverLogoFallback}>{data.company.name}</Text>
            }
          </View>
          <Text style={s.coverBandTitle}>{"RISK ASSESSMENT &\nMETHOD STATEMENT"}</Text>
        </View>

        {/* White body */}
        <View style={s.coverBody}>
          <Text style={s.coverProjectName}>{data.project.name}</Text>
          <Text style={s.coverProjectSite}>{data.project.site_address}</Text>
          <View style={s.coverDivider} />

          {/* Project info grid */}
          <View style={s.coverInfoGrid}>
            {[
              { label: "Principal Contractor", value: data.project.principal_contractor },
              { label: "Site Supervisor",      value: data.project.supervisor },
              { label: "Start Date",           value: data.project.start_date },
              { label: "Planned Duration",     value: data.project.duration },
              { label: "Document Reference",   value: data.document_ref },
              { label: "Revision",             value: data.revision },
              { label: "Date",                 value: data.date },
              { label: "Status",               value: "Issued for Approval" },
            ].map((item) => (
              <View key={item.label} style={s.coverInfoCol}>
                <Text style={s.coverInfoLabel}>{item.label}</Text>
                <Text style={s.coverInfoValue}>{item.value || "—"}</Text>
              </View>
            ))}
          </View>

          {/* Revision history table */}
          <View style={s.coverRevTable}>
            <View style={s.coverRevHeader}>
              <Text style={[s.coverRevHeaderCell, { width: "10%" }]}>Rev</Text>
              <Text style={[s.coverRevHeaderCell, { width: "18%" }]}>Date</Text>
              <Text style={[s.coverRevHeaderCell, { width: "42%" }]}>Description</Text>
              <Text style={[s.coverRevHeaderCell, { width: "15%" }]}>Prepared By</Text>
              <Text style={[s.coverRevHeaderCell, { width: "15%" }]}>Approved By</Text>
            </View>
            <View style={s.coverRevRow}>
              <Text style={[s.coverRevCell, { width: "10%" }]}>{data.revision}</Text>
              <Text style={[s.coverRevCell, { width: "18%" }]}>{data.date}</Text>
              <Text style={[s.coverRevCell, { width: "42%" }]}>
                {(data as { revision_description?: string }).revision_description || "Initial issue"}
              </Text>
              <Text style={[s.coverRevCell, { width: "15%" }]}>{data.sign_off.prepared_by || "—"}</Text>
              <Text style={[s.coverRevCell, { width: "15%" }]}>—</Text>
            </View>
          </View>
        </View>

        {/* Bottom navy band: company contact */}
        <View style={s.coverBottomBand}>
          <Text style={s.coverBottomText}>{data.company.address}</Text>
          {data.company.phone && <Text style={s.coverBottomText}>Tel: {data.company.phone}</Text>}
          {data.company.email && <Text style={s.coverBottomText}>{data.company.email}</Text>}
          {data.company.reg   && <Text style={s.coverBottomText}>Reg. No. {data.company.reg}</Text>}
        </View>
      </Page>

      {/* ── Page 1: Project Info + Scope + Legislation ── */}
      <Page size="A4" style={s.contentPage}>
        <RunningHeader {...rh} />
        <PageFooter {...footer} />

        <Text style={{ fontSize: 17, fontWeight: 700, color: NAVY, textAlign: "center", marginBottom: 3 }}>
          RISK ASSESSMENT & METHOD STATEMENT
        </Text>
        <Text style={{ fontSize: 9, color: MUTED, textAlign: "center", marginBottom: 14 }}>
          CDM 2015 Compliant | Submitted to Principal Contractor for Approval
        </Text>

        <View style={s.projectBox}>
          <View style={s.projectGrid}>
            <Field label="Project Name"         value={data.project.name} />
            <Field label="Principal Contractor" value={data.project.principal_contractor} />
            <Field label="Site Address"         value={data.project.site_address} full />
            <Field label="Site Supervisor"      value={data.project.supervisor} />
            <Field label="Start Date"           value={data.project.start_date} />
            <Field label="Planned Duration"     value={data.project.duration} />
          </View>
        </View>

        <SectionHeader num="1" title="Scope of Works" />
        <Text style={{ fontSize: 9, lineHeight: 1.55, color: BODY_TEXT }}>{data.scope_of_works}</Text>

        <SectionHeader num="2" title="Applicable Legislation" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Regulation</Text>
            <Text style={[s.tableHeaderCell, { width: "65%" }]}>Relevance to These Works</Text>
          </View>
          {data.legislation.map((leg, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontWeight: 700 }]}>{leg.regulation}</Text>
              <Text style={[s.tableCell, { width: "65%" }]}>{leg.relevance}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ── Page 2: Risk Assessment ── */}
      <Page size="A4" orientation="landscape" style={s.landscapePage}>
        <RunningHeader {...rh} />
        <PageFooter {...footer} />

        <SectionHeader num="3" title="Risk Assessment — 5×5 Matrix" />
        <RiskMatrix />

        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "5%" }]}>Ref</Text>
            <Text style={[s.tableHeaderCell, { width: "12%" }]}>Hazard</Text>
            <Text style={[s.tableHeaderCell, { width: "18%" }]}>Description</Text>
            <Text style={[s.tableHeaderCell, { width: "8%" }]}>Who at Risk</Text>
            <Text style={[s.tableHeaderCell, { width: "9%" }]}>Pre-Control</Text>
            <Text style={[s.tableHeaderCell, { width: "30%" }]}>Control Measures</Text>
            <Text style={[s.tableHeaderCell, { width: "9%" }]}>Post-Control</Text>
            <Text style={[s.tableHeaderCell, { width: "9%" }]}>Legislation</Text>
          </View>
          {data.risk_assessment.map((item, i) => (
            <RiskAssessmentRow key={item.ref} item={item} idx={i} />
          ))}
        </View>
      </Page>

      {/* ── Page 3: Method Statement ── */}
      <Page size="A4" style={s.contentPage}>
        <RunningHeader {...rh} />
        <PageFooter {...footer} />

        <SectionHeader num="4" title="Sequence of Works" />
        {data.method_statement.sequence_of_works.map((step) => (
          <View key={step.step} style={s.stepRow} wrap={false}>
            <View style={s.stepBadge}>
              <Text style={s.stepNum}>{step.step}</Text>
            </View>
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.description}</Text>
            </View>
          </View>
        ))}

        <SectionHeader num="5" title="Supervision Arrangements" />
        <Text style={{ fontSize: 9, lineHeight: 1.5, color: BODY_TEXT }}>{data.method_statement.supervision}</Text>

        <SectionHeader num="6" title="Emergency Procedures" />
        <View style={s.projectBox}>
          {[
            { label: "First Aid",             value: data.method_statement.emergency_procedures.first_aid },
            { label: "Emergency Contacts",    value: data.method_statement.emergency_procedures.emergency_contacts },
            { label: "Nearest Hospital",      value: data.method_statement.emergency_procedures.nearest_hospital },
            { label: "Evacuation Procedure",  value: data.method_statement.emergency_procedures.evacuation },
            ...(data.method_statement.emergency_procedures.excavation_collapse
              ? [{ label: "Excavation Collapse Procedure", value: data.method_statement.emergency_procedures.excavation_collapse }]
              : []),
            ...(data.method_statement.emergency_procedures.confined_space_rescue
              ? [{ label: "Confined Space Rescue", value: data.method_statement.emergency_procedures.confined_space_rescue }]
              : []),
            ...(data.method_statement.emergency_procedures.gas_escape
              ? [{ label: "Gas Escape Procedure", value: data.method_statement.emergency_procedures.gas_escape }]
              : []),
            ...(data.method_statement.emergency_procedures.ohl_contact
              ? [{ label: "Overhead Powerline Contact", value: data.method_statement.emergency_procedures.ohl_contact }]
              : []),
          ].map((item) => (
            <View key={item.label} style={{ marginBottom: 7 }}>
              <Text style={s.fieldLabel}>{item.label.toUpperCase()}</Text>
              <Text style={[s.fieldValue, { lineHeight: 1.45 }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ── Page 4: Supporting Assessments + Sign-Off ── */}
      <Page size="A4" style={s.contentPage}>
        <RunningHeader {...rh} />
        <PageFooter {...footer} />

        <SectionHeader num="7" title="Plant & Equipment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Item</Text>
            <Text style={[s.tableHeaderCell, { width: "65%" }]}>Competency / Inspection Requirement</Text>
          </View>
          {data.method_statement.plant_and_equipment.map((p, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontWeight: 700 }]}>{p.item}</Text>
              <Text style={[s.tableCell, { width: "65%" }]}>{p.requirement}</Text>
            </View>
          ))}
        </View>

        <SectionHeader num="8" title="PPE Requirements" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "30%" }]}>PPE Item</Text>
            <Text style={[s.tableHeaderCell, { width: "50%" }]}>Standard / Specification</Text>
            <Text style={[s.tableHeaderCell, { width: "20%" }]}>Mandatory?</Text>
          </View>
          {data.method_statement.ppe_requirements.map((p, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "30%", fontWeight: 700 }]}>{p.item}</Text>
              <Text style={[s.tableCell, { width: "50%" }]}>{p.standard}</Text>
              <View style={{ width: "20%", alignItems: "flex-start" }}>
                <View style={[s.riskCell, { backgroundColor: p.mandatory ? GREEN : "#94a3b8", width: 50 }]}>
                  <Text>{p.mandatory ? "YES" : "Req'd"}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader num="9" title="COSHH Assessment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "22%" }]}>Substance</Text>
            <Text style={[s.tableHeaderCell, { width: "28%" }]}>Health Risk</Text>
            <Text style={[s.tableHeaderCell, { width: "42%" }]}>Control Measures</Text>
            <Text style={[s.tableHeaderCell, { width: "8%" }]}>Reg.</Text>
          </View>
          {data.method_statement.coshh_substances.map((c, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "22%", fontWeight: 700 }]}>{c.substance}</Text>
              <Text style={[s.tableCell, { width: "28%" }]}>{c.risk}</Text>
              <Text style={[s.tableCell, { width: "42%" }]}>{c.control}</Text>
              <Text style={[s.tableCell, { width: "8%", fontSize: 7 }]}>{c.regulation}</Text>
            </View>
          ))}
        </View>

        {data.havs_assessment.applicable && (
          <>
            <SectionHeader num="10" title="HAVS Assessment" />
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderCell, { width: "30%" }]}>Tool / Equipment</Text>
                <Text style={[s.tableHeaderCell, { width: "30%" }]}>Vibration Level</Text>
                <Text style={[s.tableHeaderCell, { width: "20%" }]}>Exposure Limits</Text>
                <Text style={[s.tableHeaderCell, { width: "20%" }]}>Control</Text>
              </View>
              {data.havs_assessment.tools.map((h, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "30%", fontWeight: 700 }]}>{h.tool}</Text>
                  <Text style={[s.tableCell, { width: "30%" }]}>{h.vibration_level}</Text>
                  <Text style={[s.tableCell, { width: "20%" }]}>{h.daily_exposure_limit}</Text>
                  <Text style={[s.tableCell, { width: "20%" }]}>{h.control}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <SectionHeader num={data.havs_assessment.applicable ? "11" : "10"} title="Noise Assessment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Noise Source</Text>
            <Text style={[s.tableHeaderCell, { width: "25%" }]}>Approx. Level dB(A)</Text>
            <Text style={[s.tableHeaderCell, { width: "40%" }]}>Control Measures</Text>
          </View>
          {data.noise_assessment.sources.map((n, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontWeight: 700 }]}>{n.source}</Text>
              <Text style={[s.tableCell, { width: "25%" }]}>{n.approximate_db}</Text>
              <Text style={[s.tableCell, { width: "40%" }]}>{n.control}</Text>
            </View>
          ))}
        </View>

        <SectionHeader num={data.havs_assessment.applicable ? "12" : "11"} title="Environmental Controls" />
        {data.method_statement.environmental_controls.map((ec, i) => (
          <Bullet key={i} text={ec} />
        ))}

        <SectionHeader num={data.havs_assessment.applicable ? "13" : "12"} title="Document Sign-Off" />
        <SignOffSection data={data} />
      </Page>

      {/* ── Page 5: Worker Briefing Record ── */}
      <Page size="A4" style={s.contentPage}>
        <RunningHeader {...rh} />
        <PageFooter {...footer} />
        <WorkerBriefingRecord />
      </Page>

    </Document>
  );
}

export async function generatePDF(data: RAMSDocument): Promise<Buffer> {
  return renderToBuffer(<RAMSPdfDoc data={data} />) as Promise<Buffer>;
}
