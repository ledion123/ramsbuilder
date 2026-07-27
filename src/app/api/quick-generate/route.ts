import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "AI generation requires an API key. Add OPENROUTER_API_KEY to .env.local." },
      { status: 400 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const pastedText = (form.get("text") as string | null) ?? "";
  const file = form.get("file");

  let fileText = "";
  if (file instanceof File) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File exceeds the 10 MB limit (${(file.size / 1_000_000).toFixed(1)} MB received).` },
        { status: 400 }
      );
    }
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }
    const { extractTextFromFile } = await import("@/lib/extractTextFromFile");
    fileText = await extractTextFromFile(file);
  }

  const combinedText = [pastedText.trim(), fileText.trim()].filter(Boolean).join("\n\n");

  if (!combinedText) {
    return NextResponse.json(
      { error: "Please paste a description or upload a scope document." },
      { status: 400 }
    );
  }

  try {
    const { extractRAMSInputFromText } = await import("@/lib/extractRAMSInputFromText");
    const { fillRequiredDefaults } = await import("@/lib/fillRequiredDefaults");
    const { generateFromClaude } = await import("@/lib/generateFromClaude");

    const { data: partial } = await extractRAMSInputFromText(combinedText);
    const input = fillRequiredDefaults(partial);
    const document = await generateFromClaude(input);

    return NextResponse.json({ document, input });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
