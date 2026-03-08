"use client";

import { useState, useRef } from "react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useRouter } from "next/navigation";
import { Loader2, Check, BarChart3, Undo2 } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";

interface Setting {
  id: string;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
  group: string;
}

interface StatsEditorClientProps {
  initialSettings: Setting[];
}

interface StatGroup {
  prefix: string;
  title: string;
  valueId: string;
  suffixId: string;
  labelId: string;
  value: string;
  suffix: string;
  labelTr: string;
  labelEn: string;
}

const STAT_GROUPS = [
  { prefix: "stat_experience", title: "Deneyim" },
  { prefix: "stat_cases", title: "Davalar" },
  { prefix: "stat_clients", title: "Müvekkiller" },
];

function buildStatGroups(settings: Setting[]): StatGroup[] {
  const map = new Map<string, Setting>();
  for (const s of settings) {
    map.set(s.key, s);
  }

  return STAT_GROUPS.map(({ prefix, title }) => {
    const valueSetting = map.get(`${prefix}_value`);
    const suffixSetting = map.get(`${prefix}_suffix`);
    const labelSetting = map.get(`${prefix}_label`);

    return {
      prefix,
      title,
      valueId: valueSetting?.id || "",
      suffixId: suffixSetting?.id || "",
      labelId: labelSetting?.id || "",
      value: valueSetting?.valueTr || "",
      suffix: suffixSetting?.valueTr || "",
      labelTr: labelSetting?.valueTr || "",
      labelEn: labelSetting?.valueEn || "",
    };
  });
}

export function StatsEditorClient({ initialSettings }: StatsEditorClientProps) {
  const router = useRouter();
  const [stats, setStats] = useState<StatGroup[]>(() => buildStatGroups(initialSettings));
  const initialRef = useRef<StatGroup[]>(buildStatGroups(initialSettings));
  const isDirty = JSON.stringify(stats) !== JSON.stringify(initialRef.current);
  useUnsavedChanges(isDirty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateStat = (index: number, field: keyof StatGroup, value: string) => {
    setStats((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = stats.flatMap((stat) => [
        { id: stat.valueId, valueTr: stat.value, valueEn: stat.value },
        { id: stat.suffixId, valueTr: stat.suffix, valueEn: stat.suffix },
        { id: stat.labelId, valueTr: stat.labelTr, valueEn: stat.labelEn },
      ]).filter((item) => item.id);

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatası");
      }

      setSuccess(true);
      initialRef.current = JSON.parse(JSON.stringify(stats));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const previewContent = (
    <div className="bg-gray-900 py-12 px-6">
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.prefix} className="text-center">
            <div className="text-3xl font-bold text-white">
              {stat.value}
              <span className="text-blue-400">{stat.suffix}</span>
            </div>
            <div className="mt-2 text-sm text-gray-400">{stat.labelTr}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          İstatistikler Yönetimi
        </h1>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              onClick={() => { setStats(JSON.parse(JSON.stringify(initialRef.current))); setSuccess(false); setError(""); }}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <Undo2 className="h-4 w-4" />
              İptal Et
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Kaydet
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-600 dark:text-green-400">
          Ayarlar başarıyla kaydedildi.
        </div>
      )}

      <PreviewWrapper preview={previewContent} title="İstatistikler Önizleme">
        <div className="space-y-6">
          {stats.map((stat, index) => (
            <div
              key={stat.prefix}
              className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {stat.title}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Değer
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Örn: 20, 5000"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sonek
                    </label>
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => updateStat(index, "suffix", e.target.value)}
                      className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Örn: +, %"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Etiket (TR)
                    </label>
                    <input
                      type="text"
                      value={stat.labelTr}
                      onChange={(e) => updateStat(index, "labelTr", e.target.value)}
                      className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Yıllık Deneyim"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Etiket (EN)
                    </label>
                    <input
                      type="text"
                      value={stat.labelEn}
                      onChange={(e) => updateStat(index, "labelEn", e.target.value)}
                      className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Years of Experience"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PreviewWrapper>
    </div>
  );
}
