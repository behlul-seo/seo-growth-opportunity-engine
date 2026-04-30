"use client";

import React, { useState } from "react";
import { BarChart2, Zap, FileSearch, AlertTriangle, Link2, TrendingUp } from "lucide-react";
import DropZone from "@/components/upload/DropZone";
import type { GSCRow } from "@/lib/types";

const FEATURES = [
  { icon: Zap, label: "Quick Wins", desc: "Çok görünür, az tıklanan sorgular", color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]" },
  { icon: FileSearch, label: "Missing Pages", desc: "İçerik olmayan talep noktaları", color: "text-[#14B8A6]", bg: "bg-[#CCFBF1]" },
  { icon: AlertTriangle, label: "Cannibalization", desc: "Aynı sorgu için yarışan sayfalar", color: "text-[#EF4444]", bg: "bg-[#FEE2E2]" },
  { icon: Link2, label: "Internal Links", desc: "Güçlendirilecek sayfa fırsatları", color: "text-[#7C3AED]", bg: "bg-[#EDE9FE]" },
  { icon: TrendingUp, label: "Gelir Potansiyeli", desc: "CTR artışının tahmini değeri", color: "text-[#22C55E]", bg: "bg-[#DCFCE7]" },
  { icon: BarChart2, label: "SEO Özeti", desc: "Danışman dilinde bulgular", color: "text-[#2563EB]", bg: "bg-[#DBEAFE]" },
];

export default function HomePage() {
  const [rows, setRows] = useState<GSCRow[] | null>(null);

  if (rows) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#18212F]">SEO Opportunity Engine</h1>
              <p className="text-sm text-[#5C667A]">{rows.length.toLocaleString("tr-TR")} sorgu-sayfa çifti yüklendi</p>
            </div>
            <button
              onClick={() => setRows(null)}
              className="rounded-lg border border-[#E7EAF1] bg-white px-4 py-2 text-sm text-[#5C667A] hover:bg-[#F7F8FC] transition-colors"
            >
              Yeni dosya yükle
            </button>
          </div>

          <div className="rounded-xl border border-[#E7EAF1] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCFCE7] mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-[#22C55E]" />
            </div>
            <h2 className="text-base font-semibold text-[#18212F]">Veri başarıyla yüklendi</h2>
            <p className="mt-1 text-sm text-[#5C667A]">Analiz modülleri yakında burada olacak.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E7EAF1] bg-white px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-xs font-medium text-[#5C667A]">SEO Opportunity Engine</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#18212F]">
            Google Search Console verinizi
            <br />
            <span className="text-[#2563EB]">büyüme fırsatına</span> dönüştürün
          </h1>
          <p className="mt-4 text-base text-[#5C667A] max-w-lg mx-auto">
            GSC export dosyanızı yükleyin. Quick win sorgulardan cannibalization risklerine kadar
            senior SEO danışmanı kalitesinde analiz alın.
          </p>
        </div>

        <div className="mb-10">
          <DropZone onData={setRows} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, desc, color, bg }) => (
            <div
              key={label}
              className="flex items-start gap-3 rounded-xl border border-[#E7EAF1] bg-white p-4"
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#18212F]">{label}</p>
                <p className="text-xs text-[#5C667A]">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-[#5C667A]">
          Verileriniz tarayıcınızda işlenir · Hiçbir şey sunucuya gönderilmez
        </p>
      </div>
    </main>
  );
}
