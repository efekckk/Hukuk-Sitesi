"use client";

import { useState, useRef } from "react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useRouter } from "next/navigation";
import { Check, Loader2, FileText, Undo2 } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";

interface SiteSetting {
  id: string;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
  group: string | null;
}

interface AboutEditorClientProps {
  initialSettings: SiteSetting[];
}

export function AboutEditorClient({ initialSettings }: AboutEditorClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Build form state from settings keyed by setting key
  const getSettingValue = (key: string, lang: "tr" | "en") => {
    const setting = initialSettings.find((s) => s.key === key);
    if (!setting) return "";
    return lang === "tr" ? setting.valueTr || "" : setting.valueEn || "";
  };

  const [form, setForm] = useState({
    about_description_tr: getSettingValue("about_description", "tr"),
    about_description_en: getSettingValue("about_description", "en"),
  });
  const initialRef = useRef({
    about_description_tr: getSettingValue("about_description", "tr"),
    about_description_en: getSettingValue("about_description", "en"),
  });
  const isDirty = JSON.stringify(form) !== JSON.stringify(initialRef.current);
  useUnsavedChanges(isDirty);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Build array payload for batch update
      const payload: { id: string; valueTr: string; valueEn: string }[] = [];

      const descSetting = initialSettings.find((s) => s.key === "about_description");
      if (descSetting) {
        payload.push({
          id: descSetting.id,
          valueTr: form.about_description_tr,
          valueEn: form.about_description_en,
        });
      }

      if (payload.length === 0) {
        setError("Kaydedilecek ayar bulunamadı.");
        return;
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatası");
      }

      setSuccess("Ayarlar başarıyla kaydedildi.");
      initialRef.current = JSON.parse(JSON.stringify(form));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const previewContent = (
    <div className="space-y-6">
      {/* About preview card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Hakkımızda</h2>
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
          {form.about_description_tr || "Henüz bir açıklama girilmedi."}
        </p>
      </div>

      {form.about_description_en && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">About Us</h2>
          <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
            {form.about_description_en}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Hakkımızda Yönetimi
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Hakkımızda sayfasındaki açıklama metnini düzenleyin
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-600 dark:text-green-400">
          {success}
        </div>
      )}

      <PreviewWrapper preview={previewContent}>
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="space-y-6">
            {/* about_description */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Hakkımızda Açıklaması
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Açıklama (TR)
                  </label>
                  <textarea
                    value={form.about_description_tr}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, about_description_tr: e.target.value }));
                      setSuccess("");
                    }}
                    rows={6}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="Hakkımızda açıklama metni..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (EN)
                  </label>
                  <textarea
                    value={form.about_description_en}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, about_description_en: e.target.value }));
                      setSuccess("");
                    }}
                    rows={6}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="About description text..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <div className="mt-6 flex items-center gap-3">
            {isDirty && (
              <button
                onClick={() => { setForm(JSON.parse(JSON.stringify(initialRef.current))); setSuccess(""); setError(""); }}
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
