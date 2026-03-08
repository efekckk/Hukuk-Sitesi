"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2, Quote } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

interface Testimonial {
  id: string;
  nameTr: string;
  nameEn: string | null;
  roleTr: string;
  roleEn: string | null;
  textTr: string;
  textEn: string | null;
  order: number;
  isActive: boolean;
}

interface TestimonialsClientProps {
  initialItems: Testimonial[];
}

const emptyForm = {
  nameTr: "",
  nameEn: "",
  roleTr: "",
  roleEn: "",
  textTr: "",
  textEn: "",
  order: 0,
  isActive: true,
};

export function TestimonialsClient({ initialItems }: TestimonialsClientProps) {
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

  const startEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setShowAdd(true);
    setForm({
      nameTr: item.nameTr,
      nameEn: item.nameEn || "",
      roleTr: item.roleTr,
      roleEn: item.roleEn || "",
      textTr: item.textTr,
      textEn: item.textEn || "",
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
    if (!form.nameTr.trim() || !form.roleTr.trim() || !form.textTr.trim()) {
      setError("Ad, rol ve metin (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kaydetme hatası");
      }

      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu referansı silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Silme hatası");
      }
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const previewContent = (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Müvekkil Görüşleri
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Müvekkillerimizin deneyimleri
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialItems
            .filter((item) => item.isActive)
            .map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl p-6 hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 relative"
              >
                <Quote className="w-10 h-10 text-secondary/30 mb-4" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                  &ldquo;{item.textTr}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{item.nameTr}</p>
                  <p className="text-sm text-muted-foreground">{item.roleTr}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );

  return (
    <PreviewWrapper preview={previewContent} title="Referanslar Önizleme">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Referanslar Yönetimi</h1>
          <button
            onClick={startAdd}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Yeni Referans
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAdd && (
          <div className="mb-6 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {editingId ? "Referans Düzenle" : "Yeni Referans"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ad (TR) *</label>
                  <input
                    type="text"
                    value={form.nameTr}
                    onChange={(e) => { setForm((p) => ({ ...p, nameTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Ad Soyad..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ad (EN)</label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => { setForm((p) => ({ ...p, nameEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Full Name..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Rol (TR) *</label>
                  <input
                    type="text"
                    value={form.roleTr}
                    onChange={(e) => { setForm((p) => ({ ...p, roleTr: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Rol / Unvan..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Rol (EN)</label>
                  <input
                    type="text"
                    value={form.roleEn}
                    onChange={(e) => { setForm((p) => ({ ...p, roleEn: e.target.value })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder="Role / Title..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Metin (TR) *</label>
                  <textarea
                    value={form.textTr}
                    onChange={(e) => { setForm((p) => ({ ...p, textTr: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="Referans metni..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Metin (EN)</label>
                  <textarea
                    value={form.textEn}
                    onChange={(e) => { setForm((p) => ({ ...p, textEn: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                    placeholder="Testimonial text..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-32">
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sıra</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => { setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 })); setFormTouched(true); }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => { setForm((p) => ({ ...p, isActive: e.target.checked })); setFormTouched(true); }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                İptal
              </button>
            </div>
          </div>
        )}

        {/* Testimonials Table */}
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          {initialItems.length === 0 && !showAdd ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <Quote className="h-7 w-7 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Henüz referans bulunmuyor. İlk referansı ekleyin!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Sıra</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad (TR)</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Rol (TR)</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {initialItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.order}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.nameTr}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.textTr}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {item.roleTr}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.isActive
                              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {item.isActive ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="Düzenle"
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
    </PreviewWrapper>
  );
}
