"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Tag } from "lucide-react";

interface TagItem {
  id: string;
  slug: string;
  nameTr: string;
  nameEn: string | null;
  postCount: number;
}

interface TagsClientProps {
  tags: TagItem[];
}

interface EditingState {
  id: string;
  nameTr: string;
  nameEn: string;
  slug: string;
}

export function TagsClient({ tags }: TagsClientProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTag, setNewTag] = useState({ nameTr: "", nameEn: "", slug: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newTag.nameTr.trim()) { setError("Ad (TR) zorunludur"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata");
      setCreating(false);
      setNewTag({ nameTr: "", nameEn: "", slug: "" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing || !editing.nameTr.trim()) { setError("Ad (TR) zorunludur"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata");
      setEditing(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string, postCount: number) => {
    const msg = postCount > 0
      ? `"${name}" etiketi ${postCount} yazıda kullanılıyor. Yine de silmek istiyor musunuz?`
      : `"${name}" etiketini silmek istediğinizden emin misiniz?`;
    if (!window.confirm(msg)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Silinemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Add New Button */}
      {!creating && (
        <button
          type="button"
          onClick={() => { setCreating(true); setError(null); }}
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Etiket
        </button>
      )}

      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad (TR)</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad (EN)</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Slug</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Yazı</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {/* Create Row */}
            {creating && (
              <tr className="border-b border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                <td className="px-4 py-3">
                  <input
                    autoFocus
                    type="text"
                    value={newTag.nameTr}
                    onChange={(e) => setNewTag((p) => ({ ...p, nameTr: e.target.value }))}
                    placeholder="Ad (TR) *"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newTag.nameEn}
                    onChange={(e) => setNewTag((p) => ({ ...p, nameEn: e.target.value }))}
                    placeholder="Ad (EN)"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newTag.slug}
                    onChange={(e) => setNewTag((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="slug (boş bırakılırsa otomatik)"
                    className="w-full px-3 py-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-gray-400">—</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCreate}
                      disabled={loading}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Check className="h-3 w-3" />
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCreating(false); setNewTag({ nameTr: "", nameEn: "", slug: "" }); setError(null); }}
                      className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {tags.length === 0 && !creating ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Henüz etiket yok. İlk etiketi oluşturun.
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  {editing?.id === tag.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          autoFocus
                          type="text"
                          value={editing.nameTr}
                          onChange={(e) => setEditing((p) => p ? { ...p, nameTr: e.target.value } : p)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editing.nameEn}
                          onChange={(e) => setEditing((p) => p ? { ...p, nameEn: e.target.value } : p)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editing.slug}
                          onChange={(e) => setEditing((p) => p ? { ...p, slug: e.target.value } : p)}
                          className="w-full px-3 py-1.5 text-sm font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{tag.postCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={handleUpdate} disabled={loading}
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <Check className="h-3 w-3" /> Kaydet
                          </button>
                          <button type="button" onClick={() => { setEditing(null); setError(null); }}
                            className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{tag.nameTr}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{tag.nameEn || "—"}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{tag.slug}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {tag.postCount} yazı
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button"
                            onClick={() => { setEditing({ id: tag.id, nameTr: tag.nameTr, nameEn: tag.nameEn || "", slug: tag.slug }); setError(null); }}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Pencil className="h-3 w-3" /> Düzenle
                          </button>
                          <button type="button"
                            onClick={() => handleDelete(tag.id, tag.nameTr, tag.postCount)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors">
                            <Trash2 className="h-3 w-3" /> Sil
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
