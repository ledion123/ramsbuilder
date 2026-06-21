import { NextRequest, NextResponse } from "next/server";
import type { RAMSDocument } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const data: RAMSDocument = await req.json();
    const { generatePDF } = await import("@/lib/exportPDF");
    const buffer = await generatePDF(data);

    const safeName = data.document_ref.replace(/[^A-Z0-9-]/gi, "-");

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("PDF export error:", err);
    return NextResponse.json({ error: "PDF generation failed." }, { status: 500 });
  }
}
