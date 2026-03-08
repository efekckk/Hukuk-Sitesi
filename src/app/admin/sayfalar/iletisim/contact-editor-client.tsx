"use client";

import { useState, useRef } from "react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useRouter } from "next/navigation";
import { Save, Loader2, MapPin, Phone, Mail, Clock, Undo2 } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";

interface Setting {
  id: string;
  key: string;
  valueTr: string | null;
  valueEn: string | null;
  group: string | null;
}

interface ContactEditorClientProps {
  initialSettings: Setting[];
}

type FieldConfig = {
  key: string;
  label: string;
  placeholder: string;
  placeholderEn?: string;
  hasTr: boolean;
  hasEn: boolean;
  multiline?: boolean;
};

const FIELD_CONFIG: FieldConfig[] = [
  {
    key: "address",
    label: "Adres",
    placeholder: "Ofis adresi...",
    placeholderEn: "Office address...",
    hasTr: true,
    hasEn: true,
  },
  {
    key: "phone",
    label: "Telefon (Goruntulenecek)",
    placeholder: "+90 212 123 45 67",
    hasTr: true,
    hasEn: false,
  },
  {
    key: "phone_raw",
    label: "Telefon (Ham / href icin)",
    placeholder: "+902121234567",
    hasTr: true,
    hasEn: false,
  },
  {
    key: "email",
    label: "E-posta",
    placeholder: "info@hukukburosu.com",
    hasTr: true,
    hasEn: false,
  },
  {
    key: "working_hours",
    label: "Calisma Saatleri",
    placeholder: "Pazartesi - Cuma: 09:00 - 18:00",
    placeholderEn: "Monday - Friday: 09:00 - 18:00",
    hasTr: true,
    hasEn: true,
  },
  {
    key: "working_hours_saturday",
    label: "Cumartesi Saatleri",
    placeholder: "Cumartesi: Randevu ile",
    placeholderEn: "Saturday: By Appointment",
    hasTr: true,
    hasEn: true,
  },
  {
    key: "maps_embed_url",
    label: "Google Maps Embed URL",
    placeholder: "https://www.google.com/maps/embed?pb=...",
    hasTr: true,
    hasEn: false,
    multiline: true,
  },
  {
    key: "whatsapp",
    label: "WhatsApp Numarasi",
    placeholder: "+905551234567",
    hasTr: true,
    hasEn: false,
  },
];

function getVal(settings: Record<string, { valueTr: string; valueEn: string }>, key: string, lang: "valueTr" | "valueEn") {
  return settings[key]?.[lang] || "";
}

export function ContactEditorClient({ initialSettings }: ContactEditorClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Build a map: key -> { id, valueTr, valueEn }
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

  const updateField = (key: string, lang: "valueTr" | "valueEn", value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }));
    setSuccess("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

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
        throw new Error(data.error || "Kaydetme hatasi");
      }

      setSuccess("Iletisim bilgileri basariyla kaydedildi.");
      initialRef.current = JSON.parse(JSON.stringify(form));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400";

  const textareaClass =
    "flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none";

  const preview = (
    <div className="space-y-6 p-4">
      {/* Address */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">Adres</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getVal(form, "address", "valueTr") || "Adres girilmedi"}
          </p>
          {getVal(form, "address", "valueEn") && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 italic">
              EN: {getVal(form, "address", "valueEn")}
            </p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">Telefon</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getVal(form, "phone", "valueTr") || "Telefon girilmedi"}
          </p>
          {getVal(form, "whatsapp", "valueTr") && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              WhatsApp: {getVal(form, "whatsapp", "valueTr")}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">E-posta</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getVal(form, "email", "valueTr") || "E-posta girilmedi"}
          </p>
        </div>
      </div>

      {/* Working Hours */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">Calisma Saatleri</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getVal(form, "working_hours", "valueTr") || "Saat girilmedi"}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getVal(form, "working_hours_saturday", "valueTr")}
          </p>
        </div>
      </div>

      {/* Map preview */}
      {getVal(form, "maps_embed_url", "valueTr") && (
        <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <iframe
            src={getVal(form, "maps_embed_url", "valueTr")}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Iletisim Bilgileri Yonetimi
        </h1>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              onClick={() => { setForm(JSON.parse(JSON.stringify(initialRef.current))); setSuccess(""); setError(""); }}
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
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
          {success}
        </div>
      )}

      <PreviewWrapper preview={preview} title="Iletisim Sayfasi Onizleme">
        <div className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="space-y-6">
            {FIELD_CONFIG.map((field) => {
              // Skip if the key doesn't exist in settings
              if (!form[field.key]) return null;

              return (
                <div key={field.key} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    {field.label}
                  </h3>

                  {field.hasTr && field.hasEn ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Turkce
                        </label>
                        {field.multiline ? (
                          <textarea
                            value={form[field.key]?.valueTr || ""}
                            onChange={(e) => updateField(field.key, "valueTr", e.target.value)}
                            rows={3}
                            className={textareaClass}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <input
                            type="text"
                            value={form[field.key]?.valueTr || ""}
                            onChange={(e) => updateField(field.key, "valueTr", e.target.value)}
                            className={inputClass}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          English
                        </label>
                        {field.multiline ? (
                          <textarea
                            value={form[field.key]?.valueEn || ""}
                            onChange={(e) => updateField(field.key, "valueEn", e.target.value)}
                            rows={3}
                            className={textareaClass}
                            placeholder={field.placeholderEn || field.placeholder}
                          />
                        ) : (
                          <input
                            type="text"
                            value={form[field.key]?.valueEn || ""}
                            onChange={(e) => updateField(field.key, "valueEn", e.target.value)}
                            className={inputClass}
                            placeholder={field.placeholderEn || field.placeholder}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-lg">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Deger
                      </label>
                      {field.multiline ? (
                        <textarea
                          value={form[field.key]?.valueTr || ""}
                          onChange={(e) => updateField(field.key, "valueTr", e.target.value)}
                          rows={3}
                          className={textareaClass}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          value={form[field.key]?.valueTr || ""}
                          onChange={(e) => updateField(field.key, "valueTr", e.target.value)}
                          className={inputClass}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  )}

                  {/* Separator */}
                  <div className="border-b border-gray-100 dark:border-gray-800" />
                </div>
              );
            })}
          </div>
        </div>
      </PreviewWrapper>
    </div>
  );
}
