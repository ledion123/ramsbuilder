import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { RAMSDocument, RiskAssessmentItem } from "./types";

// ── Colour palette ───────────────────────────────────────────────
const ACCENT   = "#2563eb";   // blue-600
const ACCENT2  = "#1d4ed8";   // blue-700
const DARK     = "#0f172a";   // page bg / deepest navy
const CARD_BG  = "#0f2040";   // card background
const TEXT     = "#e2e8f0";   // body text
const MUTED    = "#94a3b8";   // subdued text
const MUTED2   = "#64748b";
const BORDER   = "#1e3a6e";   // border colour
const ROW_ALT  = "#152a52";   // alt row tint

const GREEN = "#16a34a";
const AMBER = "#d97706";
const RED   = "#dc2626";

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  // ── Cover page ──
  coverPage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    backgroundColor: DARK,
    padding: 0,
  },
  coverAccentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    backgroundColor: ACCENT,
  },
  coverContent: {
    flex: 1,
    paddingLeft: 44,
    paddingRight: 36,
    paddingTop: 44,
    paddingBottom: 0,
    flexDirection: "column",
  },
  coverTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  coverCompanyName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    marginBottom: 3,
  },
  coverCompanyMeta: {
    fontSize: 8.5,
    color: MUTED,
    lineHeight: 1.5,
  },
  coverLogoBox: {
    width: 90,
    height: 44,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  coverLogoLabel: {
    fontSize: 7,
    color: MUTED2,
    fontFamily: "Helvetica-Bold",
  },
  coverDivider: {
    height: 1,
    backgroundColor: BORDER,
    marginBottom: 48,
  },
  coverTitleArea: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  coverTitleLine1: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    lineHeight: 1.1,
  },
  coverTitleLine2: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  coverAccentUnderline: {
    height: 3,
    width: 60,
    backgroundColor: ACCENT,
    marginBottom: 20,
  },
  coverProjectName: {
    fontSize: 14,
    color: MUTED,
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  coverProjectSite: {
    fontSize: 10,
    color: MUTED2,
  },
  coverInfoStrip: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginTop: "auto",
  },
  coverInfoCol: {
    flex: 1,
  },
  coverInfoLabel: {
    fontSize: 6.5,
    color: MUTED,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coverInfoValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
  },
  coverConfidential: {
    position: "absolute",
    bottom: 14,
    right: 0,
    backgroundColor: ACCENT,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  coverConfidentialText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1,
  },

  // ── Content page ──
  contentPage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEXT,
    backgroundColor: "#ffffff",
    paddingTop: 54,
    paddingBottom: 44,
    paddingHorizontal: 36,
  },
  landscapePage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEXT,
    backgroundColor: "#ffffff",
    paddingTop: 54,
    paddingBottom: 44,
    paddingHorizontal: 28,
  },

  // ── Running header (fixed) ──
  runningHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    paddingHorizontal: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT,
  },
  rhLeft:   { flex: 1, fontSize: 7, color: MUTED },
  rhCentre: { flex: 1, textAlign: "center", fontSize: 7, fontFamily: "Helvetica-Bold", color: TEXT },
  rhRight:  { flex: 1, textAlign: "right", fontSize: 7, color: MUTED },

  // ── Footer (fixed) ──
  footer: {
    position: "absolute",
    bottom: 14,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 3,
  },
  footerText: { fontSize: 6.5, color: MUTED2 },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: TEXT,
    letterSpacing: 0.4,
  },

  // ── Tables ──
  table: { borderWidth: 0.5, borderColor: BORDER, marginBottom: 8 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f2040",
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderCell: { fontFamily: "Helvetica-Bold", color: "#ffffff", fontSize: 7.5 },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "#f0f4ff",
  },
  tableCell: { fontSize: 8, color: "#1e293b" },

  // ── Project info box ──
  projectBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    borderRadius: 2,
    padding: 10,
    marginBottom: 12,
  },
  projectGrid: { flexDirection: "row", flexWrap: "wrap" },
  projectField: { width: "50%", marginBottom: 6 },
  projectFieldFull: { width: "100%", marginBottom: 6 },
  fieldLabel: { fontSize: 7, color: MUTED2, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  fieldValue: { fontSize: 9, color: "#1e293b" },

  // ── Risk chips ──
  riskChip: {
    padding: "2 6",
    borderRadius: 10,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },

  // ── Method steps ──
  stepRow:    { flexDirection: "row", marginBottom: 8, gap: 8 },
  stepBadge:  { width: 22, height: 22, borderRadius: 11, backgroundColor: ACCENT, justifyContent: "center", alignItems: "center", flexShrink: 0 },
  stepNum:    { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  stepContent:{ flex: 1 },
  stepTitle:  { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 2 },
  stepDesc:   { fontSize: 8, color: "#475569", lineHeight: 1.4 },

  // ── Bullets ──
  bulletRow:  { flexDirection: "row", marginBottom: 3, gap: 4 },
  bulletDot:  { fontSize: 9, color: ACCENT, width: 8, flexShrink: 0 },
  bulletText: { fontSize: 8, color: "#1e293b", flex: 1, lineHeight: 1.4 },

  // ── Sign-off ──
  signOffNotice: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: AMBER,
    padding: 8,
    marginBottom: 10,
  },
  signOffNoticeText: { fontSize: 8, color: "#92400e", lineHeight: 1.4 },
  signOffGrid: { flexDirection: "row", gap: 12 },
  signOffBox:  { flex: 1, borderWidth: 0.5, borderColor: "#cbd5e1", padding: 10 },
  signOffBoxTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: ACCENT, marginBottom: 8 },
  signOffLabel:{ fontSize: 7, color: MUTED2, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  signOffValue:{ fontSize: 9, color: "#1e293b", marginBottom: 8 },
  signOffSigBox: { height: 48, borderWidth: 0.5, borderColor: "#cbd5e1", marginTop: 4, justifyContent: "flex-end", padding: 3 },
  signOffSigLabel: { fontSize: 6.5, color: MUTED2 },
});

// ── Helper functions ─────────────────────────────────────────────

function riskColor(score: number): string {
  if (score <= 6) return GREEN;
  if (score <= 14) return AMBER;
  return RED;
}

// ── Shared components ────────────────────────────────────────────

function RunningHeader({ company, docRef, revision, date }: { company: string; docRef: string; revision: string; date: string }) {
  return (
    <View fixed style={s.runningHeader}>
      <Text style={s.rhLeft}>{company}</Text>
      <Text style={s.rhCentre}>{docRef}</Text>
      <Text style={s.rhRight}>{revision} | {date}</Text>
    </View>
  );
}

function PageFooter({ docRef, date }: { docRef: string; date: string }) {
  return (
    <View fixed style={s.footer}>
      <Text style={s.footerText}>CONFIDENTIAL | For authorised recipients only | {docRef}</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
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

function RiskChip({ score, level }: { score: number; level: string }) {
  return (
    <View style={[s.riskChip, { backgroundColor: riskColor(score) }]}>
      <Text>{score} {level}</Text>
    </View>
  );
}

// ── 5×5 Risk Matrix ──────────────────────────────────────────────

function RiskMatrix() {
  const likelihoods = [1, 2, 3, 4, 5];
  const severities  = [5, 4, 3, 2, 1];
  const cellSize = 24;
  const labelWidth = 40;

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#1e293b", marginBottom: 4 }}>
        5×5 RISK MATRIX (Likelihood × Severity)
      </Text>
      {/* Header row */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: labelWidth + 12 }} />
        {likelihoods.map((l) => (
          <View key={l} style={{ width: cellSize, alignItems: "center" }}>
            <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: MUTED2 }}>L={l}</Text>
          </View>
        ))}
        <Text style={{ fontSize: 6.5, color: MUTED2, marginLeft: 6 }}>← Likelihood</Text>
      </View>
      {/* Matrix rows */}
      {severities.map((sev) => (
        <View key={sev} style={{ flexDirection: "row", alignItems: "center", marginBottom: 1 }}>
          <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: MUTED2, width: labelWidth, textAlign: "right", paddingRight: 4 }}>
            S={sev}
          </Text>
          <View style={{ width: 12 }} />
          {likelihoods.map((l) => {
            const score = l * sev;
            const bg = score <= 6 ? GREEN : score <= 14 ? AMBER : RED;
            return (
              <View key={l} style={{ width: cellSize, height: cellSize - 4, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginRight: 1 }}>
                <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>{score}</Text>
              </View>
            );
          })}
        </View>
      ))}
      {/* Legend */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 5 }}>
        {[
          { color: GREEN, label: "Low (1–6)" },
          { color: AMBER, label: "Medium (7–14)" },
          { color: RED,   label: "High (15–25)" },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 10, height: 10, backgroundColor: item.color }} />
            <Text style={{ fontSize: 7, color: "#475569" }}>{item.label}</Text>
          </View>
        ))}
        <Text style={{ fontSize: 7, color: MUTED2, marginLeft: "auto" }}>Risk Score = Likelihood × Severity</Text>
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
        <Text style={[s.tableCell, { fontFamily: "Helvetica-Bold" }]}>{item.hazard}</Text>
      </View>
      <View style={{ width: "20%" }}>
        <Text style={s.tableCell}>{item.description}</Text>
      </View>
      <Text style={[s.tableCell, { width: "8%" }]}>{item.who_at_risk}</Text>
      <View style={{ width: "9%", alignItems: "center" }}>
        <RiskChip score={item.risk_score_pre} level={item.risk_level_pre} />
      </View>
      <View style={{ width: "28%" }}>
        {item.control_measures.map((cm, i) => <Bullet key={i} text={cm} />)}
      </View>
      <View style={{ width: "9%", alignItems: "center" }}>
        <RiskChip score={item.risk_score_post} level={item.risk_level_post} />
      </View>
      <Text style={[s.tableCell, { width: "9%" }]}>{item.legislation_ref}</Text>
    </View>
  );
}

// ── Sign-off block ───────────────────────────────────────────────

function SignOffSection({ data }: { data: RAMSDocument }) {
  return (
    <View>
      <View style={s.signOffNotice}>
        <Text style={s.signOffNoticeText}>
          ⚠ SUBMISSION NOTICE: This document must be submitted to and approved by {data.project.principal_contractor} before any works commence on site. Works must not start until written approval is received from the Principal Contractor.
        </Text>
      </View>
      <View style={s.signOffGrid}>
        {/* Left: Subcontractor */}
        <View style={s.signOffBox}>
          <Text style={s.signOffBoxTitle}>PREPARED BY (SUBCONTRACTOR)</Text>
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
        {/* Right: Principal Contractor */}
        <View style={s.signOffBox}>
          <Text style={s.signOffBoxTitle}>REVIEWED &amp; APPROVED (PRINCIPAL CONTRACTOR)</Text>
          <Text style={s.signOffLabel}>NAME</Text>
          <View style={{ height: 14, borderBottomWidth: 0.5, borderBottomColor: "#cbd5e1", marginBottom: 8 }} />
          <Text style={s.signOffLabel}>POSITION</Text>
          <View style={{ height: 14, borderBottomWidth: 0.5, borderBottomColor: "#cbd5e1", marginBottom: 8 }} />
          <Text style={s.signOffLabel}>DATE</Text>
          <View style={{ height: 14, borderBottomWidth: 0.5, borderBottomColor: "#cbd5e1", marginBottom: 8 }} />
          <Text style={s.signOffLabel}>SIGNATURE</Text>
          <View style={s.signOffSigBox}>
            <Text style={s.signOffSigLabel}>Sign here</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 7, color: MUTED2, marginTop: 8, textAlign: "center" }}>
        Review Date: {data.sign_off.review_date}
      </Text>
    </View>
  );
}

// ── Main PDF document ────────────────────────────────────────────

function RAMSPdfDoc({ data }: { data: RAMSDocument }) {
  const rh = { company: data.company.name, docRef: data.document_ref, revision: data.revision, date: data.date };

  return (
    <Document title={`${data.document_ref} — RAMS`} author={data.company.name}>

      {/* ── Cover Page ── */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverAccentBar} />
        <View style={s.coverContent}>
          {/* Top: company + logo */}
          <View style={s.coverTop}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={s.coverCompanyName}>{data.company.name}</Text>
              {data.company.reg && (
                <Text style={s.coverCompanyMeta}>Reg. No. {data.company.reg}</Text>
              )}
              <Text style={s.coverCompanyMeta}>{data.company.address}</Text>
              {data.company.phone && (
                <Text style={s.coverCompanyMeta}>Tel: {data.company.phone}</Text>
              )}
              {data.company.email && (
                <Text style={s.coverCompanyMeta}>{data.company.email}</Text>
              )}
            </View>
            <View style={s.coverLogoBox}>
              <Text style={s.coverLogoLabel}>COMPANY</Text>
              <Text style={s.coverLogoLabel}>LOGO</Text>
            </View>
          </View>

          <View style={s.coverDivider} />

          {/* Centre: document title */}
          <View style={s.coverTitleArea}>
            <Text style={s.coverTitleLine1}>RISK ASSESSMENT &amp;</Text>
            <Text style={s.coverTitleLine2}>METHOD STATEMENT</Text>
            <View style={s.coverAccentUnderline} />
            <Text style={s.coverProjectName}>{data.project.name}</Text>
            <Text style={s.coverProjectSite}>{data.project.site_address}</Text>
          </View>

          {/* Bottom info strip */}
          <View style={s.coverInfoStrip}>
            {[
              { label: "DOCUMENT REF", value: data.document_ref },
              { label: "REVISION",     value: data.revision },
              { label: "DATE",         value: data.date },
              { label: "PRINCIPAL CONTRACTOR", value: data.project.principal_contractor },
            ].map((item) => (
              <View key={item.label} style={s.coverInfoCol}>
                <Text style={s.coverInfoLabel}>{item.label}</Text>
                <Text style={s.coverInfoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* CONFIDENTIAL badge */}
        <View style={s.coverConfidential}>
          <Text style={s.coverConfidentialText}>CONFIDENTIAL</Text>
        </View>
      </Page>

      {/* ── Page 1: Project Info + Scope + Legislation ── */}
      <Page size="A4" style={s.contentPage}>
        <RunningHeader {...rh} />
        <PageFooter docRef={data.document_ref} date={data.date} />

        <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1e293b", textAlign: "center", marginBottom: 4 }}>
          RISK ASSESSMENT &amp; METHOD STATEMENT
        </Text>
        <Text style={{ fontSize: 9.5, color: MUTED2, textAlign: "center", marginBottom: 14 }}>
          CDM 2015 Compliant | Submitted to Principal Contractor for Approval
        </Text>

        <View style={s.projectBox}>
          <View style={s.projectGrid}>
            <Field label="Project Name"          value={data.project.name} />
            <Field label="Principal Contractor"  value={data.project.principal_contractor} />
            <Field label="Site Address"          value={data.project.site_address} full />
            <Field label="Site Supervisor"       value={data.project.supervisor} />
            <Field label="Start Date"            value={data.project.start_date} />
            <Field label="Planned Duration"      value={data.project.duration} />
          </View>
        </View>

        <SectionHeader title="Scope of Works" />
        <Text style={{ fontSize: 9, lineHeight: 1.55, color: "#1e293b" }}>{data.scope_of_works}</Text>

        <SectionHeader title="Applicable Legislation" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Regulation</Text>
            <Text style={[s.tableHeaderCell, { width: "65%" }]}>Relevance to These Works</Text>
          </View>
          {data.legislation.map((leg, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontFamily: "Helvetica-Bold" }]}>{leg.regulation}</Text>
              <Text style={[s.tableCell, { width: "65%" }]}>{leg.relevance}</Text>
            </View>
          ))}
        </View>
      </Page>

      {/* ── Page 2: Risk Assessment ── */}
      <Page size="A4" orientation="landscape" style={s.landscapePage}>
        <RunningHeader {...rh} />
        <PageFooter docRef={data.document_ref} date={data.date} />

        <SectionHeader title="Risk Assessment — 5×5 Matrix" />
        <RiskMatrix />

        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "5%" }]}>Ref</Text>
            <Text style={[s.tableHeaderCell, { width: "12%" }]}>Hazard</Text>
            <Text style={[s.tableHeaderCell, { width: "20%" }]}>Description</Text>
            <Text style={[s.tableHeaderCell, { width: "8%" }]}>Who at Risk</Text>
            <Text style={[s.tableHeaderCell, { width: "9%" }]}>Pre-Control</Text>
            <Text style={[s.tableHeaderCell, { width: "28%" }]}>Control Measures</Text>
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
        <PageFooter docRef={data.document_ref} date={data.date} />

        <SectionHeader title="Sequence of Works" />
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

        <SectionHeader title="Supervision Arrangements" />
        <Text style={{ fontSize: 9, lineHeight: 1.5, color: "#1e293b" }}>{data.method_statement.supervision}</Text>

        <SectionHeader title="Emergency Procedures" />
        <View style={s.projectBox}>
          {[
            { label: "First Aid", value: data.method_statement.emergency_procedures.first_aid },
            { label: "Emergency Contacts", value: data.method_statement.emergency_procedures.emergency_contacts },
            { label: "Nearest Hospital", value: data.method_statement.emergency_procedures.nearest_hospital },
            { label: "Evacuation Procedure", value: data.method_statement.emergency_procedures.evacuation },
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
        <PageFooter docRef={data.document_ref} date={data.date} />

        <SectionHeader title="Plant &amp; Equipment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Item</Text>
            <Text style={[s.tableHeaderCell, { width: "65%" }]}>Competency / Inspection Requirement</Text>
          </View>
          {data.method_statement.plant_and_equipment.map((p, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontFamily: "Helvetica-Bold" }]}>{p.item}</Text>
              <Text style={[s.tableCell, { width: "65%" }]}>{p.requirement}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="PPE Requirements" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "30%" }]}>PPE Item</Text>
            <Text style={[s.tableHeaderCell, { width: "50%" }]}>Standard / Specification</Text>
            <Text style={[s.tableHeaderCell, { width: "20%" }]}>Mandatory?</Text>
          </View>
          {data.method_statement.ppe_requirements.map((p, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "30%", fontFamily: "Helvetica-Bold" }]}>{p.item}</Text>
              <Text style={[s.tableCell, { width: "50%" }]}>{p.standard}</Text>
              <View style={{ width: "20%", alignItems: "flex-start" }}>
                <View style={[s.riskChip, { backgroundColor: p.mandatory ? GREEN : "#94a3b8", width: 50 }]}>
                  <Text>{p.mandatory ? "YES" : "Req'd"}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="COSHH Assessment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "22%" }]}>Substance</Text>
            <Text style={[s.tableHeaderCell, { width: "28%" }]}>Health Risk</Text>
            <Text style={[s.tableHeaderCell, { width: "42%" }]}>Control Measures</Text>
            <Text style={[s.tableHeaderCell, { width: "8%" }]}>Reg.</Text>
          </View>
          {data.method_statement.coshh_substances.map((c, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "22%", fontFamily: "Helvetica-Bold" }]}>{c.substance}</Text>
              <Text style={[s.tableCell, { width: "28%" }]}>{c.risk}</Text>
              <Text style={[s.tableCell, { width: "42%" }]}>{c.control}</Text>
              <Text style={[s.tableCell, { width: "8%", fontSize: 7 }]}>{c.regulation}</Text>
            </View>
          ))}
        </View>

        {data.havs_assessment.applicable && (
          <>
            <SectionHeader title="HAVS Assessment" />
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderCell, { width: "30%" }]}>Tool / Equipment</Text>
                <Text style={[s.tableHeaderCell, { width: "30%" }]}>Vibration Level</Text>
                <Text style={[s.tableHeaderCell, { width: "20%" }]}>Exposure Limits</Text>
                <Text style={[s.tableHeaderCell, { width: "20%" }]}>Control</Text>
              </View>
              {data.havs_assessment.tools.map((h, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { width: "30%", fontFamily: "Helvetica-Bold" }]}>{h.tool}</Text>
                  <Text style={[s.tableCell, { width: "30%" }]}>{h.vibration_level}</Text>
                  <Text style={[s.tableCell, { width: "20%" }]}>{h.daily_exposure_limit}</Text>
                  <Text style={[s.tableCell, { width: "20%" }]}>{h.control}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <SectionHeader title="Noise Assessment" />
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, { width: "35%" }]}>Noise Source</Text>
            <Text style={[s.tableHeaderCell, { width: "25%" }]}>Approx. Level dB(A)</Text>
            <Text style={[s.tableHeaderCell, { width: "40%" }]}>Control Measures</Text>
          </View>
          {data.noise_assessment.sources.map((n, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={[s.tableCell, { width: "35%", fontFamily: "Helvetica-Bold" }]}>{n.source}</Text>
              <Text style={[s.tableCell, { width: "25%" }]}>{n.approximate_db}</Text>
              <Text style={[s.tableCell, { width: "40%" }]}>{n.control}</Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Environmental Controls" />
        {data.method_statement.environmental_controls.map((ec, i) => (
          <Bullet key={i} text={ec} />
        ))}

        <SectionHeader title="Document Sign-Off" />
        <SignOffSection data={data} />
      </Page>
    </Document>
  );
}

export async function generatePDF(data: RAMSDocument): Promise<Buffer> {
  return renderToBuffer(<RAMSPdfDoc data={data} />) as Promise<Buffer>;
}
