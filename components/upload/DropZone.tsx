"use client";

import React, { useCallback, useRef, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseGSCFile } from "@/lib/parser";
import type { GSCRow } from "@/lib/types";

interface DropZoneProps {
  onData: (rows: GSCRow[]) => void;
}

export default function DropZone({ onData }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Sadece .csv dosyaları desteklenmektedir.");
        return;
      }
      setError(null);
      setLoading(true);
      const result = await parseGSCFile(file);
      setLoading(false);
      if (result.errors.length > 0) {
        setError(result.errors[0]);
        return;
      }
      onData(result.rows);
    },
    [onData]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-8 py-14 cursor-pointer transition-all duration-200",
          dragging
            ? "border-[#2563EB] bg-[#EFF6FF]"
            : "border-[#E7EAF1] bg-white hover:border-[#2563EB] hover:bg-[#F7F8FC]"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={onInputChange}
        />

        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
          dragging ? "bg-[#DBEAFE]" : "bg-[#F7F8FC]"
        )}>
          {loading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E7EAF1] border-t-[#2563EB]" />
          ) : (
            <Upload className={cn("h-6 w-6", dragging ? "text-[#2563EB]" : "text-[#5C667A]")} />
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-[#18212F]">
            {loading ? "Dosya analiz ediliyor…" : "CSV dosyasını buraya sürükleyin"}
          </p>
          <p className="mt-1 text-xs text-[#5C667A]">
            veya seçmek için tıklayın · Google Search Console export
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-[#E7EAF1] bg-[#F7F8FC] px-3 py-1.5">
          <FileText className="h-3.5 w-3.5 text-[#5C667A]" />
          <span className="text-xs text-[#5C667A]">Query + Page bazında export edilmiş CSV</span>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error}</p>
        </div>
      )}
    </div>
  );
}
