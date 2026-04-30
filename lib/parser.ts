import Papa from "papaparse";
import { z } from "zod";
import type { GSCRow, ParseResult } from "./types";

const GSCRowSchema = z.object({
  query: z.string().min(1),
  page: z.string().url(),
  clicks: z.coerce.number().nonnegative(),
  impressions: z.coerce.number().nonnegative(),
  ctr: z.coerce.number(),
  position: z.coerce.number().positive(),
});

const COLUMN_ALIASES: Record<string, string> = {
  query: "query",
  queries: "query",
  sorgu: "query",
  "top queries": "query",
  page: "page",
  pages: "page",
  "landing page": "page",
  url: "page",
  clicks: "clicks",
  tıklamalar: "clicks",
  impressions: "impressions",
  gösterimler: "impressions",
  ctr: "ctr",
  position: "position",
  pozisyon: "position",
  "average position": "position",
  "ortalama konum": "position",
};

function normalizeHeaders(raw: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const col of raw) {
    const key = col.trim().toLowerCase();
    const canonical = COLUMN_ALIASES[key];
    if (canonical) map[canonical] = col;
  }
  return map;
}

function normalizeCTR(val: unknown): number {
  if (typeof val === "number") return val > 1 ? val / 100 : val;
  if (typeof val === "string") {
    const cleaned = val.replace("%", "").replace(",", ".").trim();
    const n = parseFloat(cleaned);
    if (isNaN(n)) return 0;
    return n > 1 ? n / 100 : n;
  }
  return 0;
}

export function parseGSCFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawHeaders = Object.keys((results.data[0] as object) ?? {});
        const headerMap = normalizeHeaders(rawHeaders);

        const requiredFields = ["query", "page", "clicks", "impressions", "ctr", "position"];
        const missingFields = requiredFields.filter((f) => !headerMap[f]);

        if (missingFields.length > 0) {
          resolve({
            rows: [],
            errors: [`Eksik sütunlar: ${missingFields.join(", ")}. GSC'den "Query + Page" bazında export ettiğinizden emin olun.`],
            totalRows: 0,
          });
          return;
        }

        const rows: GSCRow[] = [];
        const errors: string[] = [];

        for (const raw of results.data as Record<string, unknown>[]) {
          const normalized = {
            query: String(raw[headerMap.query] ?? "").trim(),
            page: String(raw[headerMap.page] ?? "").trim(),
            clicks: raw[headerMap.clicks],
            impressions: raw[headerMap.impressions],
            ctr: normalizeCTR(raw[headerMap.ctr]),
            position: raw[headerMap.position],
          };

          const parsed = GSCRowSchema.safeParse(normalized);
          if (parsed.success) {
            rows.push(parsed.data);
          }
        }

        if (rows.length === 0) {
          errors.push("Geçerli satır bulunamadı. Dosya formatını kontrol edin.");
        }

        resolve({ rows, errors, totalRows: results.data.length });
      },
      error: (err) => {
        resolve({ rows: [], errors: [err.message], totalRows: 0 });
      },
    });
  });
}
