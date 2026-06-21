import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI extraction requires an API key. Add ANTHROPIC_API_KEY to .env.local." },
      { status: 400 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // Size check
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File exceeds the 10 MB limit (${(file.size / 1_000_000).toFixed(1)} MB received).` },
      { status: 400 }
    );
  }

  // Type check
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
      { status: 400 }
    );
  }

  try {
    const { extractTextFromFile } = await import("@/lib/extractTextFromFile");
    const { extractRAMSInputFromText } = await import("@/lib/extractRAMSInputFromText");

    const text = await extractTextFromFile(file);

    if (!text.trim()) {
      return NextResponse.json(
        { data: {}, warnings: ["The document appears to be empty or could not be read."] },
        { status: 200 }
      );
    }

    const { data, warnings } = await extractRAMSInputFromText(text);
    return NextResponse.json({ data, warnings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
