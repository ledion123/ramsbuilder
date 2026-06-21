import { NextResponse } from "next/server";
import { REGULATIONS, govukUrl, govukDataUrl } from "@/lib/regulations";

export const maxDuration = 30;

export interface RegStatus {
  id: string;
  name: string;
  shortCode: string;
  govukUrl: string;
  lastVerified: string;
  govukModified: string | null;
  status: "current" | "review" | "error";
  errorDetail?: string;
}

async function checkOne(entry: typeof REGULATIONS[number]): Promise<RegStatus> {
  const base: Omit<RegStatus, "govukModified" | "status" | "errorDetail"> = {
    id: entry.id,
    name: entry.name,
    shortCode: entry.shortCode,
    govukUrl: govukUrl(entry),
    lastVerified: entry.lastVerified,
  };

  try {
    const res = await fetch(govukDataUrl(entry), {
      signal: AbortSignal.timeout(12000),
      headers: { Accept: "application/xml, text/xml" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { ...base, govukModified: null, status: "error", errorDetail: `HTTP ${res.status}` };
    }

    const xml = await res.text();

    // legislation.gov.uk XML (Akoma Ntoso) uses Dublin Core <dc:modified>
    const match =
      xml.match(/<dc:modified>(\d{4}-\d{2}-\d{2})<\/dc:modified>/) ||
      xml.match(/name="modified"[^>]*date="(\d{4}-\d{2}-\d{2})"/) ||
      xml.match(/FRBRdate[^>]+date="(\d{4}-\d{2}-\d{2})"[^>]+name="revised"/);

    if (!match) {
      return { ...base, govukModified: null, status: "error", errorDetail: "modified date not found in XML" };
    }

    const govukModified = match[1];
    const status = govukModified > entry.lastVerified ? "review" : "current";
    return { ...base, govukModified, status };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return { ...base, govukModified: null, status: "error", errorDetail: msg };
  }
}

export async function GET() {
  const results = await Promise.all(REGULATIONS.map(checkOne));

  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
