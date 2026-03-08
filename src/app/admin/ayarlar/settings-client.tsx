"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X, Loader2, Settings } from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
  group: string | null;
}

interface SettingsClientProps {
  grouped: Record<string, SiteSetting[]>;
}

const groupLabels: Record<string, string> = {
  general: "Genel",
  contact: "İletişim",
  social: "Sosyal Medya",
  seo: "SEO",
  appearance: "Görünüm",
};

export function SettingsClient({ grouped }: SettingsClientProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ valueTr: "", valueEn: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const startEdit = (setting: SiteSetting) => {
    setEditingId(setting.id);
    setForm({ valueTr: setting.valueTr || "", valueEn: setting.valueEn || "" });
    setError("");
  };

  const cancel = () => {
    setEditingId(null);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...form }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatası");
      }

      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
            <Settings className="h-7 w-7 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Henüz ayar bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600">{error}</div>
      )}

      {Object.entries(grouped).map(([group, groupSettings]) => (
        <div key={group} className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {groupLabels[group] || group}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {groupSettings.map((setting) =>
              editingId === setting.id ? (
                <div key={setting.id} className="bg-blue-50/50 dark:bg-blue-900/20 px-6 py-4">
                  <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {setting.key}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Değer (TR)
                      </label>
                      <input
                        type="text"
                        value={form.valueTr}
                        onChange={(e) => setForm((p) => ({ ...p, valueTr: e.target.value }))}
                        className="flex h-9 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Değer (EN)
                      </label>
                      <input
                        type="text"
                        value={form.valueEn}
                        onChange={(e) => setForm((p) => ({ ...p, valueEn: e.target.value }))}
                        className="flex h-9 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Kaydet
                      </button>
                      <button
                        onClick={cancel}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 dark:border-gray-700 px-3 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <X className="h-3.5 w-3.5" />
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={setting.id}
                  className="flex items-start justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {setting.key}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">TR:</span>{" "}
                      {setting.valueTr
                        ? setting.valueTr.length > 100
                          ? setting.valueTr.slice(0, 100) + "..."
                          : setting.valueTr
                        : "-"}
                    </p>
                    {setting.valueEn && (
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">EN:</span>{" "}
                        {setting.valueEn.length > 100
                          ? setting.valueEn.slice(0, 100) + "..."
                          : setting.valueEn}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(setting)}
                    className="shrink-0 rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
