"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2, Bell } from "lucide-react";
import { PreviewWrapper } from "@/components/admin/preview-wrapper";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

interface Popup {
  id: string;
  titleTr: string;
  titleEn: string | null;
  messageTr: string;
  messageEn: string | null;
  type: string;
  linkUrl: string | null;
  linkTextTr: string | null;
  linkTextEn: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  order: number;
}

interface PopupClientProps {
  initialItems: Popup[];
}

function toDatetimeLocal(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const emptyForm = {
  titleTr: "",
  titleEn: "",
  messageTr: "",
  messageEn: "",
  type: "modal",
  linkUrl: "",
  linkTextTr: "",
  linkTextEn: "",
  startDate: "",
  endDate: "",
  order: 0,
  isActive: true,
};

export function PopupClient({ initialItems }: PopupClientProps) {
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

  const startEdit = (item: Popup) => {
    setEditingId(item.id);
    setShowAdd(true);
    setForm({
      titleTr: item.titleTr,
      titleEn: item.titleEn || "",
      messageTr: item.messageTr,
      messageEn: item.messageEn || "",
      type: item.type,
      linkUrl: item.linkUrl || "",
      linkTextTr: item.linkTextTr || "",
      linkTextEn: item.linkTextEn || "",
      startDate: toDatetimeLocal(item.startDate),
      endDate: toDatetimeLocal(item.endDate),
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
    if (!form.titleTr.trim() || !form.messageTr.trim() || !form.startDate || !form.endDate) {
      setError("Başlık (TR), Mesaj (TR), Başlangıç ve Bitiş tarihi zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/popups", {
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
    if (!confirm("Bu popup'ı silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/popups?id=${id}`, { method: "DELETE" });
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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const previewContent = (
    <div className="relative">
      {initialItems.filter((p) => p.isActive).map((item) =>
        item.type === "banner" ? (
          <div key={item.id} className="bg-blue-600 text-white px-4 py-3 text-center text-sm">
            <strong>{item.titleTr}</strong> — {item.messageTr}
            {item.linkUrl && item.linkTextTr && (
              <span className="ml-2 underline">{item.linkTextTr}</span>
            )}
          </div>
        ) : (
          <div key={item.id} className="flex items-center justify-center p-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
              <Bell className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{item.titleTr}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{item.messageTr}</p>
              {item.linkUrl && item.linkTextTr && (
                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {item.linkTextTr}
                </span>
              )}
            </div>
          </div>
        )
      )}
      {initialItems.filter((p) => p.isActive).length === 0 && (
        <div className="text-center text-gray-400 py-8">Aktif popup bulunmuyor</div>
      )}
    </div>
  );

  const inputClass = "flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400";
  const textareaClass = "flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <PreviewWrapper preview={previewContent} title="Popup Önizleme">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Popup Bildirimi Yönetimi</h1>
          <button
            onClick={startAdd}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Yeni Popup
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
              {editingId ? "Popup Düzenle" : "Yeni Popup"}
            </h2>

            <div className="space-y-4">
              {/* Title TR/EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Başlık (TR) *</label>
                  <input
                    type="text"
                    value={form.titleTr}
                    onChange={(e) => { setForm((p) => ({ ...p, titleTr: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                    placeholder="Popup başlığı..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Başlık (EN)</label>
                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(e) => { setForm((p) => ({ ...p, titleEn: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                    placeholder="Popup title..."
                  />
                </div>
              </div>

              {/* Message TR/EN */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Mesaj (TR) *</label>
                  <textarea
                    value={form.messageTr}
                    onChange={(e) => { setForm((p) => ({ ...p, messageTr: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className={textareaClass}
                    placeholder="Popup mesajı..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Mesaj (EN)</label>
                  <textarea
                    value={form.messageEn}
                    onChange={(e) => { setForm((p) => ({ ...p, messageEn: e.target.value })); setFormTouched(true); }}
                    rows={3}
                    className={textareaClass}
                    placeholder="Popup message..."
                  />
                </div>
              </div>

              {/* Type */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Tip</label>
                  <select
                    value={form.type}
                    onChange={(e) => { setForm((p) => ({ ...p, type: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                  >
                    <option value="modal">Modal (Ortalanmış)</option>
                    <option value="banner">Banner (Üst Bar)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Link URL (opsiyonel)</label>
                  <input
                    type="text"
                    value={form.linkUrl}
                    onChange={(e) => { setForm((p) => ({ ...p, linkUrl: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                    placeholder="/iletisim"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Link Metin (TR)</label>
                    <input
                      type="text"
                      value={form.linkTextTr}
                      onChange={(e) => { setForm((p) => ({ ...p, linkTextTr: e.target.value })); setFormTouched(true); }}
                      className={inputClass}
                      placeholder="Tıklayın"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Link Metin (EN)</label>
                    <input
                      type="text"
                      value={form.linkTextEn}
                      onChange={(e) => { setForm((p) => ({ ...p, linkTextEn: e.target.value })); setFormTouched(true); }}
                      className={inputClass}
                      placeholder="Click here"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Başlangıç Tarihi *</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => { setForm((p) => ({ ...p, startDate: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bitiş Tarihi *</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => { setForm((p) => ({ ...p, endDate: e.target.value })); setFormTouched(true); }}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="flex items-center gap-6">
                <div className="w-32">
                  <label className={labelClass}>Sıra</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => { setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 })); setFormTouched(true); }}
                    className={inputClass}
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

        {/* Popup Table */}
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
          {initialItems.length === 0 && !showAdd ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <Bell className="h-7 w-7 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Henüz popup bulunmuyor. İlk popup&apos;ı ekleyin!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Sıra</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Başlık</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Tip</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Tarih Aralığı</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {initialItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.order}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.titleTr}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.messageTr}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.type === "modal"
                              ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                              : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {item.type === "modal" ? "Modal" : "Banner"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
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
