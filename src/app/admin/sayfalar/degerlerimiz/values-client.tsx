"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  Heart,
  Award,
  BookOpen,
  Shield,
  Briefcase,
  Scale,
  Users,
  Star,
  Target,
  Lightbulb,
} from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  BookOpen,
  Heart,
  Shield,
  Briefcase,
  Scale,
  Users,
  Star,
  Target,
  Lightbulb,
};

const iconOptions = [
  { value: "Award", label: "Award" },
  { value: "BookOpen", label: "BookOpen" },
  { value: "Heart", label: "Heart" },
  { value: "Shield", label: "Shield" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "Scale", label: "Scale" },
  { value: "Users", label: "Users" },
  { value: "Star", label: "Star" },
  { value: "Target", label: "Target" },
  { value: "Lightbulb", label: "Lightbulb" },
];

interface ValueItem {
  id: string;
  titleTr: string;
  titleEn: string | null;
  descriptionTr: string;
  descriptionEn: string | null;
  icon: string;
  order: number;
}

interface ValuesClientProps {
  initialItems: ValueItem[];
}

const emptyForm = {
  titleTr: "",
  titleEn: "",
  descriptionTr: "",
  descriptionEn: "",
  icon: "Award",
  order: 0,
};

export function ValuesClient({ initialItems }: ValuesClientProps) {
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

  const startEdit = (item: ValueItem) => {
    setEditingId(item.id);
    setShowAdd(true);
    setForm({
      titleTr: item.titleTr,
      titleEn: item.titleEn || "",
      descriptionTr: item.descriptionTr,
      descriptionEn: item.descriptionEn || "",
      icon: item.icon,
      order: item.order,
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
    if (!form.titleTr.trim() || !form.descriptionTr.trim()) {
      setError("Başlık ve açıklama (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/values", {
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
    if (!confirm("Bu değeri silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/values?id=${id}`, { method: "DELETE" });
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

  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  const previewContent = (
    <div className="bg-background py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {initialItems.map((item) => (
          <div
            key={item.id}
            className="bg-card p-8 rounded-2xl text-center border border-border hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-5">
              {renderIcon(item.icon, "w-8 h-8 text-secondary")}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">
              {item.titleTr}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.descriptionTr}
            </p>
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
          Değerlerimiz Yönetimi
        </h1>
        <button
          onClick={startAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Değer
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
            {editingId ? "Değer Düzenle" : "Yeni Değer"}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlık (TR) *
                </label>
                <input
                  type="text"
                  value={form.titleTr}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, titleTr: e.target.value }));
                    setFormTouched(true);
                  }}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Değer başlığı..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlık (EN)
                </label>
                <input
                  type="text"
                  value={form.titleEn}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, titleEn: e.target.value }));
                    setFormTouched(true);
                  }}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Value title..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Açıklama (TR) *
                </label>
                <textarea
                  value={form.descriptionTr}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, descriptionTr: e.target.value }));
                    setFormTouched(true);
                  }}
                  rows={3}
                  className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                  placeholder="Değer açıklaması..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Açıklama (EN)
                </label>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, descriptionEn: e.target.value }));
                    setFormTouched(true);
                  }}
                  rows={3}
                  className="flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
                  placeholder="Value description..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  İkon
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={form.icon}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, icon: e.target.value }));
                      setFormTouched(true);
                    }}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {renderIcon(form.icon, "h-5 w-5 text-blue-600")}
                  </div>
                </div>
              </div>
              <div className="w-32">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sıra
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => {
                    setForm((p) => ({
                      ...p,
                      order: parseInt(e.target.value) || 0,
                    }));
                    setFormTouched(true);
                  }}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
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

      {/* Values Table with Preview */}
      <PreviewWrapper preview={previewContent} title="Değerlerimiz Önizleme">
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          {initialItems.length === 0 && !showAdd ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <Award className="h-7 w-7 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Henüz değer bulunmuyor. İlk değeri ekleyin!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      Sıra
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      İkon
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      Başlık (TR)
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      Başlık (EN)
                    </th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {item.order}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                          {renderIcon(
                            item.icon,
                            "h-4 w-4 text-blue-600 dark:text-blue-400"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.titleTr}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {item.descriptionTr}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {item.titleEn || "-"}
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
      </PreviewWrapper>
    </div>
  );
}
