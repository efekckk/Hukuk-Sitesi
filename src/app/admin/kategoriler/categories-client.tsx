"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  nameTr: string;
  nameEn: string | null;
  order: number;
  _count: { posts: number };
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nameTr: "",
    nameEn: "",
    slug: "",
    order: 0,
  });

  const resetForm = () => {
    setForm({ nameTr: "", nameEn: "", slug: "", order: 0 });
    setEditingId(null);
    setShowAdd(false);
    setError("");
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setShowAdd(false);
    setForm({
      nameTr: cat.nameTr,
      nameEn: cat.nameEn || "",
      slug: cat.slug,
      order: cat.order,
    });
    setError("");
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ nameTr: "", nameEn: "", slug: "", order: categories.length + 1 });
    setError("");
  };

  const handleSave = async () => {
    if (!form.nameTr.trim()) {
      setError("Kategori adı (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/categories", {
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
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kategoriler</h1>
        <button
          onClick={startAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Kategori
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="mb-6 rounded-lg bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Yeni Kategori</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Ad (TR) *</label>
              <input
                type="text"
                value={form.nameTr}
                onChange={(e) => setForm((p) => ({ ...p, nameTr: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Kategori adı"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Ad (EN)</label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm font-mono shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Otomatik oluşturulur"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sıra</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        {initialCategories.length === 0 && !showAdd ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            Henüz kategori bulunmuyor. İlk kategoriyi oluşturun!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Sıra</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad (TR)</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad (EN)</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Slug</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Yazı</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {initialCategories.map((cat) =>
                  editingId === cat.id ? (
                    <tr key={cat.id} className="border-b border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20">
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          value={form.order}
                          onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                          className="h-8 w-16 rounded border border-gray-200 dark:border-gray-700 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.nameTr}
                          onChange={(e) => setForm((p) => ({ ...p, nameTr: e.target.value }))}
                          className="h-8 w-full rounded border border-gray-200 dark:border-gray-700 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.nameEn}
                          onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                          className="h-8 w-full rounded border border-gray-200 dark:border-gray-700 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                          className="h-8 w-full rounded border border-gray-200 dark:border-gray-700 px-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{cat._count.posts}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={resetForm}
                            className="rounded p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={cat.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.order}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{cat.nameTr}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.nameEn || "-"}</td>
                      <td className="px-6 py-4">
                        <code className="rounded bg-gray-50 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {cat.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat._count.posts}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(cat)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            title="Düzenle"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
