"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Eye, EyeOff } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface PageData {
  id: string;
  slug: string;
  titleTr: string;
  titleEn: string | null;
  contentTr: string;
  contentEn: string | null;
}

interface KvkkEditorClientProps {
  initialPage: PageData | null;
}

export function KvkkEditorClient({ initialPage }: KvkkEditorClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"tr" | "en">("tr");
  const [showPreview, setShowPreview] = useState(false);

  const [titleTr, setTitleTr] = useState(
    initialPage?.titleTr || "KVKK Aydınlatma Metni"
  );
  const [titleEn, setTitleEn] = useState(initialPage?.titleEn || "");
  const [contentTr, setContentTr] = useState(initialPage?.contentTr || "");
  const [contentEn, setContentEn] = useState(initialPage?.contentEn || "");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!titleTr.trim()) {
        throw new Error("Başlık (TR) zorunludur.");
      }
      if (!contentTr.trim()) {
        throw new Error("İçerik (TR) zorunludur.");
      }

      const res = await fetch("/api/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "kvkk",
          titleTr: titleTr.trim(),
          titleEn: titleEn.trim() || null,
          contentTr: contentTr,
          contentEn: contentEn || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatası");
      }

      setSuccess("KVKK sayfası başarıyla kaydedildi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const currentContent = activeTab === "tr" ? contentTr : contentEn;

  const tabClass = (tab: "tr" | "en") =>
    "px-4 py-2 text-sm font-medium border-b-2 transition-colors " +
    (activeTab === tab
      ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600");

  const inputClass =
    "flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          KVKK Aydınlatma Metni
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          KVKK aydınlatma metni sayfasının içeriğini düzenleyin
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

      <div className="rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="space-y-6">
          {/* Title Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Başlık (TR)
              </label>
              <input
                type="text"
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                className={inputClass}
                placeholder="KVKK Aydınlatma Metni"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title (EN)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className={inputClass}
                placeholder="KVKK Privacy Notice"
              />
            </div>
          </div>

          {/* Language Tabs */}
          <div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab("tr")}
                className={tabClass("tr")}
              >
                Türkçe
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("en")}
                className={tabClass("en")}
              >
                English
              </button>
            </div>

            {/* Textarea */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeTab === "tr" ? "İçerik (HTML)" : "Content (HTML)"}
              </label>
              <textarea
                value={activeTab === "tr" ? contentTr : contentEn}
                onChange={(e) => {
                  if (activeTab === "tr") {
                    setContentTr(e.target.value);
                  } else {
                    setContentEn(e.target.value);
                  }
                }}
                rows={20}
                className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-y"
                placeholder={
                  activeTab === "tr"
                    ? "<h2>KVKK Aydınlatma Metni</h2>\n<p>Kişisel verilerinizin korunması...</p>"
                    : "<h2>KVKK Privacy Notice</h2>\n<p>Protection of your personal data...</p>"
                }
              />
            </div>

            {/* Preview Toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showPreview
                  ? activeTab === "tr"
                    ? "Önizlemeyi Gizle"
                    : "Hide Preview"
                  : activeTab === "tr"
                    ? "Önizleme"
                    : "Preview"}
              </button>
            </div>

            {/* HTML Preview */}
            {showPreview && (
              <div className="mt-3 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
                <div
                  className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-ul:pl-6 prose-li:my-1"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      currentContent ||
                      "<p class='text-gray-400'>Henüz içerik girilmedi.</p>"
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
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
    </div>
  );
}
