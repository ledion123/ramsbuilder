/**
 * Standalone script: generate a roofing RAMS and write PDF to scripts/test-roofing-rams.pdf
 * Uses Helvetica (built-in to react-pdf) to avoid network font fetches.
 * Usage: npx tsx scripts/gen-pdf.ts
 */
import fs from "fs";
import path from "path";
import React from "react";
import {
  Document, Page, View, Text, StyleSheet, renderToBuffer,
} from "@react-pdf/renderer";
import { generateFromTemplate } from "../src/lib/generateFromTemplate";
import type { RAMSDocument, RiskAssessmentItem } from "../src/lib/types";

// ── Input ────────────────────────────────────────────────────────────────────
const input = {
  company_name: "Test Groundworks Ltd",
  company_address: "1 Civils Way, Birmingham, B2 2BB",
  company_reg: "87654321",
  company_phone: "0121 111 2222",
  company_email: "info@testgroundworks.co.uk",
  project_name: "New Housing Development — Drainage & Substructure",
  site_address: "Plot 1–40, Greenfield Road, Coventry, CV3 3AB",
  principal_contractor: "Main Build Ltd",
  activity: "Excavation and installation of foul and surface water drainage (PVC-u and concrete pipes), precast manhole chambers, SUDS soakaways, and strip/pad foundations. Works include deep trench excavation to 1.8m, confined space entry to manholes, compaction of backfill with wacker plate, and concrete foundation pours.",
  plant_and_equipment: [
    { item: "8T Excavator (CPCS)" },
    { item: "2T Site Dumper (CPCS)" },
    { item: "Wacker Plate Compactor" },
    { item: "Concrete mixer / ready mix pump" },
  ],
  operatives: "6",
  supervisor: "Dave Jones",
  first_aider_name: "Sarah Taylor",
  welfare_arrangements: "Welfare unit on site — WC, wash facilities, drying room, and canteen.",
  start_date: "2026-08-04",
  duration: "10 weeks",
  nearest_hospital: "University Hospital Coventry, Clifford Bridge Rd, CV2 2DX",
  emergency_contact: "Dave Jones — 07711 222333",
  prepared_by: "Dave Jones",
  prepared_by_position: "Site Manager",
  revision: "A",
  selected_trades: [
    "General Excavation (open cut)",
    "Deep Excavation (>1.2m — confined space rules apply)",
    "Trench Excavation for Services",
    "Foul Water Drainage Installation",
    "Surface Water Drainage Installation",
    "Precast Manhole Chamber Installation",
    "Pipe Laying (clay, PVC, concrete, HDPE)",
    "Confined Space Entry — Manholes & Chambers",
    "Wacker Plate / Vibrating Compactor Operations",
    "Strip Foundations",
  ],
  industry_type: "groundworks",
};

// ── Simple PDF layout (Helvetica, no network fetch) ──────────────────────────
const NAVY = "#1a2e4a";
const HIGH = "#fef2f2";
const MED  = "#fffbeb";
const LOW  = "#f0fdf4";

const s = StyleSheet.create({
  page:    { fontFamily: "Helvetica", fontSize: 8, padding: 32, backgroundColor: "#ffffff", color: "#1e293b" },
  header:  { backgroundColor: NAVY, padding: 14, marginBottom: 16, borderRadius: 4 },
  hTitle:  { color: "#ffffff", fontSize: 14, fontFamily: "Helvetica-Bold" },
  hSub:    { color: "#94a3b8", fontSize: 8, marginTop: 2 },
  meta:    { flexDirection: "row", gap: 20, marginBottom: 16, backgroundColor: "#f8fafc", padding: 10, borderRadius: 4 },
  metaItem:{ flex: 1 },
  metaLabel:{ color: "#64748b", fontSize: 7, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  metaVal: { color: "#1e293b", fontSize: 8 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingBottom: 4 },
  tableHead:{ flexDirection: "row", backgroundColor: NAVY, borderRadius: 2, marginBottom: 2 },
  thRef:   { width: 42, padding: 5, color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  thHazard:{ flex: 2, padding: 5, color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  thWho:   { flex: 1.2, padding: 5, color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  thScore: { width: 60, padding: 5, color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold", textAlign: "center" },
  thCtrl:  { flex: 2.5, padding: 5, color: "#ffffff", fontSize: 7, fontFamily: "Helvetica-Bold" },
  row:     { flexDirection: "row", marginBottom: 2, borderRadius: 2 },
  tdRef:   { width: 42, padding: 5, fontSize: 7, fontFamily: "Helvetica-Bold", color: NAVY },
  tdHazard:{ flex: 2, padding: 5, fontSize: 7, fontFamily: "Helvetica-Bold" },
  tdWho:   { flex: 1.2, padding: 5, fontSize: 7, color: "#475569" },
  tdScore: { width: 60, padding: 5, fontSize: 7, textAlign: "center", fontFamily: "Helvetica-Bold" },
  tdCtrl:  { flex: 2.5, padding: 5, fontSize: 7, color: "#475569" },
  bullet:  { marginBottom: 1 },
  footer:  { position: "absolute", bottom: 18, left: 32, right: 32, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 5 },
  footerTxt:{ fontSize: 6, color: "#94a3b8" },
  trades:  { backgroundColor: "#f1f5f9", padding: 10, borderRadius: 4, marginBottom: 16 },
  tradeTitle:{ fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 4 },
  tradeItem: { fontSize: 7, color: "#475569", marginBottom: 1 },
});

function riskColor(level: string) {
  if (level === "High")   return HIGH;
  if (level === "Medium") return MED;
  return LOW;
}
function riskText(level: string) {
  if (level === "High")   return "#b91c1c";
  if (level === "Medium") return "#92400e";
  return "#166534";
}

function RamsDoc({ data, trades }: { data: RAMSDocument; trades: string[] }) {
  const d = data;
  return (
    React.createElement(Document, { title: d.document_ref },
      React.createElement(Page, { size: "A4", orientation: "landscape", style: s.page },
        // Header
        React.createElement(View, { style: s.header },
          React.createElement(Text, { style: s.hTitle }, "RISK ASSESSMENT & METHOD STATEMENT"),
          React.createElement(Text, { style: s.hSub }, `${d.company.name}  •  ${d.project.name}  •  ${d.document_ref}  Rev ${d.revision}`)
        ),
        // Meta
        React.createElement(View, { style: s.meta },
          React.createElement(View, { style: s.metaItem },
            React.createElement(Text, { style: s.metaLabel }, "PROJECT"),
            React.createElement(Text, { style: s.metaVal }, d.project.name)
          ),
          React.createElement(View, { style: s.metaItem },
            React.createElement(Text, { style: s.metaLabel }, "SITE"),
            React.createElement(Text, { style: s.metaVal }, d.project.site_address)
          ),
          React.createElement(View, { style: s.metaItem },
            React.createElement(Text, { style: s.metaLabel }, "PRINCIPAL CONTRACTOR"),
            React.createElement(Text, { style: s.metaVal }, d.project.principal_contractor)
          ),
          React.createElement(View, { style: s.metaItem },
            React.createElement(Text, { style: s.metaLabel }, "PREPARED BY"),
            React.createElement(Text, { style: s.metaVal }, `${d.sign_off.prepared_by} — ${d.sign_off.position}`)
          ),
          React.createElement(View, { style: s.metaItem },
            React.createElement(Text, { style: s.metaLabel }, "START DATE"),
            React.createElement(Text, { style: s.metaVal }, d.project.start_date)
          ),
        ),
        // Trades selected
        React.createElement(View, { style: s.trades },
          React.createElement(Text, { style: s.tradeTitle }, `SELECTED TRADES (${trades.length})`),
          ...trades.map((t: string, i: number) =>
            React.createElement(Text, { key: i, style: s.tradeItem }, `• ${t}`)
          )
        ),
        // RA table
        React.createElement(Text, { style: s.sectionTitle }, `RISK ASSESSMENT — ${d.risk_assessment.length} ROWS`),
        React.createElement(View, { style: s.tableHead },
          React.createElement(Text, { style: s.thRef }, "Ref"),
          React.createElement(Text, { style: s.thHazard }, "Hazard"),
          React.createElement(Text, { style: s.thWho }, "Who at Risk"),
          React.createElement(Text, { style: s.thScore }, "Pre-Score"),
          React.createElement(Text, { style: s.thCtrl }, "Key Controls"),
          React.createElement(Text, { style: s.thScore }, "Post-Score"),
        ),
        ...d.risk_assessment.map((r: RiskAssessmentItem) =>
          React.createElement(View, { key: r.ref, style: [s.row, { backgroundColor: riskColor(r.risk_level_pre) }] },
            React.createElement(Text, { style: s.tdRef }, r.ref),
            React.createElement(View, { style: { flex: 2, padding: 5 } },
              React.createElement(Text, { style: { fontSize: 7, fontFamily: "Helvetica-Bold", marginBottom: 2 } }, r.hazard),
              React.createElement(Text, { style: { fontSize: 6, color: "#64748b" } }, r.description.slice(0, 120) + (r.description.length > 120 ? "…" : "")),
            ),
            React.createElement(Text, { style: s.tdWho }, r.who_at_risk),
            React.createElement(View, { style: { width: 60, padding: 5, alignItems: "center" } },
              React.createElement(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: riskText(r.risk_level_pre) } }, String(r.risk_score_pre)),
              React.createElement(Text, { style: { fontSize: 6, color: riskText(r.risk_level_pre) } }, r.risk_level_pre.toUpperCase()),
            ),
            React.createElement(View, { style: { flex: 2.5, padding: 5 } },
              ...r.control_measures.slice(0, 3).map((c: string, i: number) =>
                React.createElement(Text, { key: i, style: s.bullet }, `• ${c.slice(0, 100)}${c.length > 100 ? "…" : ""}`)
              ),
              r.control_measures.length > 3
                ? React.createElement(Text, { style: { fontSize: 6, color: "#94a3b8" } }, `+ ${r.control_measures.length - 3} more controls`)
                : null,
            ),
            React.createElement(View, { style: { width: 60, padding: 5, alignItems: "center" } },
              React.createElement(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: riskText(r.risk_level_post) } }, String(r.risk_score_post)),
              React.createElement(Text, { style: { fontSize: 6, color: riskText(r.risk_level_post) } }, r.risk_level_post.toUpperCase()),
            ),
          )
        ),
        // Footer
        React.createElement(View, { style: s.footer, fixed: true },
          React.createElement(Text, { style: s.footerTxt }, `${d.document_ref} Rev ${d.revision} — ${d.company.name}`),
          React.createElement(Text, { style: s.footerTxt, render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Page ${pageNumber} of ${totalPages}` }),
        ),
      )
    )
  );
}

async function main() {
  console.log("Generating RAMS data (roofing)...");
  const data = generateFromTemplate(input);

  console.log(`\n✓ Risk assessment rows: ${data.risk_assessment.length}`);
  data.risk_assessment.forEach((r) => {
    const arrow = `${r.risk_level_pre} → ${r.risk_level_post}`;
    console.log(`  ${r.ref}  ${r.hazard.padEnd(55)} [${arrow}]`);
  });

  console.log("\nRendering PDF...");
  const buf = await renderToBuffer(React.createElement(RamsDoc, { data, trades: input.selected_trades }));

  const outPath = path.join(process.cwd(), "scripts", "test-roofing-rams.pdf");
  fs.writeFileSync(outPath, buf);
  console.log(`\n✓ PDF written: ${outPath} (${(buf.length / 1024).toFixed(1)} KB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
