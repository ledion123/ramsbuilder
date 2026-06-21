// @ts-ignore — pdf-parse has no @types package; types are inferred at runtime
import pdf from "pdf-parse";
import mammoth from "mammoth";

const MAX_CHARS = 12_000;

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  let text: string;

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const result = await pdf(buffer);
    text = result.text;
  } else if (
    name.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (name.endsWith(".txt") || file.type === "text/plain") {
    text = buffer.toString("utf-8");
  } else {
    throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
  }

  return text.slice(0, MAX_CHARS);
}
