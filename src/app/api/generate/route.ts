import { NextRequest, NextResponse } from "next/server";
import type { RAMSInput } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const input: RAMSInput = await req.json();

    const useAI = !!process.env.ANTHROPIC_API_KEY;

    let ramsDoc;
    if (useAI) {
      const { generateFromClaude } = await import("@/lib/generateFromClaude");
      ramsDoc = await generateFromClaude(input);
    } else {
      const { generateFromTemplate } = await import("@/lib/generateFromTemplate");
      ramsDoc = generateFromTemplate(input);
    }

    return NextResponse.json({ ...ramsDoc, _source: useAI ? "ai" : "template" });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate RAMS document. Please check your input and try again." },
      { status: 500 }
    );
  }
}
