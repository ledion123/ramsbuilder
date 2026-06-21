import { NextRequest, NextResponse } from "next/server";
import type { RAMSDocument } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const data: RAMSDocument = await req.json();
    const { generateDocx } = await import("@/lib/exportDocx");
    const buffer = await generateDocx(data);

    const safeName = data.document_ref.replace(/[^A-Z0-9-]/gi, "-");

    const uint8 = new Uint8Array(buffer);
    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${safeName}.docx"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("DOCX export error:", err);
    return NextResponse.json({ error: "Word document generation failed." }, { status: 500 });
  }
}
