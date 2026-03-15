"use client";

import { useState, useRef } from "react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useRouter } from "next/navigation";
import { Check, Loader2, Phone, Undo2 } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";

interface SiteSetting {
  id: string;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
  group: string | null;
}

interface CtaEditorClientProps {
  initialSettings: SiteSetting[];
}

const fieldLabels: Record<string, { label: string; placeholderTr: string; placeholderEn: string }> = {
  cta_title: {
    label: "Başlık",
    placeholderTr: "CTA başlığı (TR)...",
    placeholderEn: "CTA title (EN)...",
  },
  cta_subtitle: {
    label: "Alt Başlık",
    placeholderTr: "CTA alt başlığı (TR)...",
    placeholderEn: "CTA subtitle (EN)...",
  },
  cta_button_text: {
    label: "Buton Metni",
    placeholderTr: "Buton metni (TR)...",
    placeholderEn: "Button text (EN)...",
  },
  cta_phone_text: {
    label: "Telefon Butonu Metni",
    placeholderTr: "Telefon buton metni (TR)...",
    placeholderEn: "Phone button text (EN)...",
  },
};

const fieldOrder = ["cta_title", "cta_subtitle", "cta_button_text", "cta_phone_text"];

function getVal(
  settings: Record<string, { valueTr: string; valueEn: string }>,
  key: string,
  lang: "valueTr" | "valueEn"
): string {
  return settings[key]?.[lang] || "";
}

export function CtaEditorClient({ initialSettings }: CtaEditorClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Build a map of key -> { id, valueTr, valueEn }
  const buildFormState = () => {
    const map: Record<string, { id: string; valueTr: string; valueEn: string }> = {};
    for (const s of initialSettings) {
      map[s.key] = {
        id: s.id,
        valueTr: s.valueTr || "",
        valueEn: s.valueEn || "",
      };
    }
    return map;
  };

  const [form, setForm] = useState(buildFormState);
  const initialRef = useRef(buildFormState());
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
  useUnsavedChanges(isDirty);

  const phoneRaw = form["phone_raw"]?.valueTr || "";

  const updateField = (key: string, lang: "valueTr" | "valueEn", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value },
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = Object.entries(form).map(([, val]) => ({
        id: val.id,
        valueTr: val.valueTr,
        valueEn: val.valueEn,
      }));

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
      initialRef.current = JSON.parse(JSON.stringify(form));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const preview = (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#0a0a0a] to-[#262626] rounded-2xl p-10 md:p-16 text-center border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {getVal(form, "cta_title", "valueTr") || "CTA Başlık"}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            {getVal(form, "cta_subtitle", "valueTr") || "CTA alt başlık"}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-medium h-12 px-8 text-base rounded-lg">
              {getVal(form, "cta_button_text", "valueTr") || "Buton"}
            </span>
            <span className="inline-flex items-center justify-center gap-2 border-2 border-secondary text-secondary font-medium h-12 px-8 text-base rounded-lg">
              <Phone className="w-5 h-5" />
              {getVal(form, "cta_phone_text", "valueTr") || "Ara"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">CTA Bloğu Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ana sayfadaki CTA (Call to Action) bölümünü düzenleyin
        </p>
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

      <PreviewWrapper preview={preview} title="CTA Önizleme">
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="space-y-6">
            {fieldOrder.map((key) => {
              const meta = fieldLabels[key];
              if (!meta || !form[key]) return null;

              return (
                <div key={key}>
                  <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {meta.label}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        Türkçe
                      </label>
                      <input
                        type="text"
                        value={form[key].valueTr}
                        onChange={(e) => updateField(key, "valueTr", e.target.value)}
                        className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder={meta.placeholderTr}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                        English
                      </label>
                      <input
                        type="text"
                        value={form[key].valueEn}
                        onChange={(e) => updateField(key, "valueEn", e.target.value)}
                        className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                        placeholder={meta.placeholderEn}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Phone Raw (read-only display) */}
            {form["phone_raw"] && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Telefon Numarası
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Telefon numarasını &quot;Site Ayarları &gt; İletişim&quot; bölümünden değiştirebilirsiniz.
                </p>
                <div className="flex h-10 w-full max-w-sm items-center rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
                  {phoneRaw}
                </div>
              </div>
            )}
          </div>

          {/* Save / Cancel Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            {isDirty && (
              <button
                onClick={() => { setForm(JSON.parse(JSON.stringify(initialRef.current))); setSuccess(false); setError(""); }}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Undo2 className="h-4 w-4" />
                Değişiklikleri İptal Et
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Kaydet
            </button>
          </div>
        </div>
      </PreviewWrapper>
    </div>
  );
}
