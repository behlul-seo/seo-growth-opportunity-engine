export interface GSCRow {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface ParseResult {
  rows: GSCRow[];
  errors: string[];
  totalRows: number;
}
