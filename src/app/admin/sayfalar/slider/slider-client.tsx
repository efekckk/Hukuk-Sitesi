"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2, Layers } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

interface HeroSlide {
  id: string;
  taglineTr: string;
  taglineEn: string | null;
  titleTr: string;
  titleEn: string | null;
  subtitleTr: string;
  subtitleEn: string | null;
  ctaTextTr: string;
  ctaTextEn: string | null;
  ctaLink: string;
  secondaryCtaTextTr: string | null;
  secondaryCtaTextEn: string | null;
  secondaryCtaLink: string | null;
  secondaryCtaIsExternal: boolean;
  order: number;
  isActive: boolean;
}

interface SliderClientProps {
  initialItems: HeroSlide[];
}

const emptyForm = {
  taglineTr: "",
  taglineEn: "",
  titleTr: "",
  titleEn: "",
  subtitleTr: "",
  subtitleEn: "",
  ctaTextTr: "",
  ctaTextEn: "",
  ctaLink: "",
  secondaryCtaTextTr: "",
  secondaryCtaTextEn: "",
  secondaryCtaLink: "",
  secondaryCtaIsExternal: false,
  order: 0,
  isActive: true,
};

export function SliderClient({ initialItems }: SliderClientProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formTouched, setFormTouched] = useState(false);

  useUnsavedChanges(showAdd && formTouched);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowAdd(false);
    setError("");
    setFormTouched(false);
  };

  const startEdit = (item: HeroSlide) => {
    setEditingId(item.id);
    setShowAdd(true);
    setForm({
      taglineTr: item.taglineTr,
      taglineEn: item.taglineEn || "",
      titleTr: item.titleTr,
      titleEn: item.titleEn || "",
      subtitleTr: item.subtitleTr,
      subtitleEn: item.subtitleEn || "",
      ctaTextTr: item.ctaTextTr,
      ctaTextEn: item.ctaTextEn || "",
      ctaLink: item.ctaLink,
      secondaryCtaTextTr: item.secondaryCtaTextTr || "",
      secondaryCtaTextEn: item.secondaryCtaTextEn || "",
      secondaryCtaLink: item.secondaryCtaLink || "",
      secondaryCtaIsExternal: item.secondaryCtaIsExternal,
      order: item.order,
      isActive: item.isActive,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ ...emptyForm, order: initialItems.length + 1 });
    setError("");
  };

  const handleSave = async () => {
    if (!form.taglineTr.trim() || !form.titleTr.trim() || !form.subtitleTr.trim() || !form.ctaTextTr.trim() || !form.ctaLink.trim()) {
      setError("Tagline, ba\u015Fl\u0131k, alt ba\u015Fl\u0131k, CTA metni ve CTA link (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/hero-slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatas\u0131");
      }

      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olu\u015Ftu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu slide'\u0131 silmek istedi\u011Finize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/hero-slides?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Silme hatas\u0131");
      }
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata olu\u015Ftu");
    } finally {
      setSaving(false);
    }
  };

  const preview = (
    <section className="relative bg-[#0a0a0a] py-24 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <p className="uppercase tracking-[0.2em] text-secondary text-sm font-medium mb-4">
          {form.taglineTr || "HUKUK B\u00dcROSU"}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {form.titleTr || "Slide Ba\u015Fl\u0131\u011F\u0131"}
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {form.subtitleTr || "Slide alt ba\u015Fl\u0131\u011F\u0131 buraya gelecek..."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-medium h-12 px-8 text-base rounded-lg">
            {form.ctaTextTr || "Buton"}
          </span>
          {(form.secondaryCtaTextTr || form.secondaryCtaLink) && (
            <span className="inline-flex items-center justify-center gap-2 border-2 border-secondary text-secondary font-medium h-12 px-8 text-base rounded-lg">
              {form.secondaryCtaTextTr || "\u0130kinci Buton"}
            </span>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Slider Y\u00F6netimi</h1>
        <button
          onClick={startAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Slide
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAdd && (
        <PreviewWrapper preview={preview} title="Slider \u00D6nizleme">
          <div className="mb-6 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingId ? "Slide D\u00FCzenle" : "Yeni Slide"}
            </h2>

            <div className="space-y-4">
              {/* Tagline TR / EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tagline (TR) *</label>
                  <input
                    type="text"
                    value={form.taglineTr}
                    onChange={(e) => { setForm((p) => ({ ...p, taglineTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="HUKUK B\u00dcROSU"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tagline (EN)</label>
                  <input
                    type="text"
                    value={form.taglineEn}
                    onChange={(e) => { setForm((p) => ({ ...p, taglineEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="LAW FIRM"
                  />
                </div>
              </div>

              {/* Title TR / EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ba\u015Fl\u0131k (TR) *</label>
                  <input
                    type="text"
                    value={form.titleTr}
                    onChange={(e) => { setForm((p) => ({ ...p, titleTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Slide ba\u015Fl\u0131\u011F\u0131..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ba\u015Fl\u0131k (EN)</label>
                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(e) => { setForm((p) => ({ ...p, titleEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Slide title..."
                  />
                </div>
              </div>

              {/* Subtitle TR / EN (textarea) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alt Ba\u015Fl\u0131k (TR) *</label>
                  <textarea
                    value={form.subtitleTr}
                    onChange={(e) => { setForm((p) => ({ ...p, subtitleTr: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="Slide alt ba\u015Fl\u0131\u011F\u0131..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alt Ba\u015Fl\u0131k (EN)</label>
                  <textarea
                    value={form.subtitleEn}
                    onChange={(e) => { setForm((p) => ({ ...p, subtitleEn: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="Slide subtitle..."
                  />
                </div>
              </div>

              {/* CTA Text TR / EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">CTA Buton Metni (TR) *</label>
                  <input
                    type="text"
                    value={form.ctaTextTr}
                    onChange={(e) => { setForm((p) => ({ ...p, ctaTextTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Hemen Ba\u015Fvurun"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">CTA Buton Metni (EN)</label>
                  <input
                    type="text"
                    value={form.ctaTextEn}
                    onChange={(e) => { setForm((p) => ({ ...p, ctaTextEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Apply Now"
                  />
                </div>
              </div>

              {/* CTA Link */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">CTA Link *</label>
                <input
                  type="text"
                  value={form.ctaLink}
                  onChange={(e) => { setForm((p) => ({ ...p, ctaLink: e.target.value })); setFormTouched(true); }}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="/iletisim"
                />
              </div>

              {/* Secondary CTA Text TR / EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">\u0130kinci Buton Metni (TR)</label>
                  <input
                    type="text"
                    value={form.secondaryCtaTextTr}
                    onChange={(e) => { setForm((p) => ({ ...p, secondaryCtaTextTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Bizi Aray\u0131n"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">\u0130kinci Buton Metni (EN)</label>
                  <input
                    type="text"
                    value={form.secondaryCtaTextEn}
                    onChange={(e) => { setForm((p) => ({ ...p, secondaryCtaTextEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Call Us"
                  />
                </div>
              </div>

              {/* Secondary CTA Link */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">\u0130kinci Buton Link</label>
                <input
                  type="text"
                  value={form.secondaryCtaLink}
                  onChange={(e) => { setForm((p) => ({ ...p, secondaryCtaLink: e.target.value })); setFormTouched(true); }}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="tel:+902121234567"
                />
              </div>

              {/* Secondary CTA External + Order + IsActive */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="secondaryCtaIsExternal"
                    checked={form.secondaryCtaIsExternal}
                    onChange={(e) => { setForm((p) => ({ ...p, secondaryCtaIsExternal: e.target.checked })); setFormTouched(true); }}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="secondaryCtaIsExternal" className="text-sm text-gray-700 dark:text-gray-300">
                    Harici link (tel:, https:// gibi)
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">S\u0131ra</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => { setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => { setForm((p) => ({ ...p, isActive: e.target.checked })); setFormTouched(true); }}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Aktif
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Kaydet
              </button>
              <button
                onClick={resetForm}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                \u0130ptal
              </button>
            </div>
          </div>
        </PreviewWrapper>
      )}

      {/* Slides Table */}
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        {initialItems.length === 0 && !showAdd ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
              <Layers className="h-7 w-7 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Hen\u00FCz slide bulunmuyor. \u0130lk slide&apos;\u0131 ekleyin!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">S\u0131ra</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ba\u015Fl\u0131k (TR)</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">CTA Link</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">\u0130\u015Flemler</th>
                </tr>
              </thead>
              <tbody>
                {initialItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.order}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.titleTr}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.taglineTr}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {item.ctaLink}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          title="D\u00FCzenle"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
