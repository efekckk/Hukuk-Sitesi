"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, Loader2, Upload, Users } from "lucide-react";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

interface TeamMember {
  id: string;
  nameTr: string;
  nameEn: string | null;
  roleTr: string;
  roleEn: string | null;
  specialtyTr: string;
  specialtyEn: string | null;
  image: string | null;
  order: number;
}

interface TeamClientProps {
  initialMembers: TeamMember[];
}

const emptyForm = {
  nameTr: "",
  nameEn: "",
  roleTr: "",
  roleEn: "",
  specialtyTr: "",
  specialtyEn: "",
  image: "",
  order: 0,
};

export function TeamClient({ initialMembers }: TeamClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  useUnsavedChanges(editingId !== null || showAdd);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowAdd(false);
    setError("");
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setShowAdd(true);
    setForm({
      nameTr: member.nameTr,
      nameEn: member.nameEn || "",
      roleTr: member.roleTr,
      roleEn: member.roleEn || "",
      specialtyTr: member.specialtyTr,
      specialtyEn: member.specialtyEn || "",
      image: member.image || "",
      order: member.order,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ ...emptyForm, order: initialMembers.length + 1 });
    setError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Yükleme hatası");
      }

      const data = await res.json();
      setForm((p) => ({ ...p, image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme hatası");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.nameTr.trim() || !form.roleTr.trim() || !form.specialtyTr.trim()) {
      setError("İsim, unvan ve uzmanlık alanı (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/team", {
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
    if (!confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/team?id=${id}`, { method: "DELETE" });
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ekip Yönetimi</h1>
        <button
          onClick={startAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Üye
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
            {editingId ? "Üye Düzenle" : "Yeni Üye"}
          </h2>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Fotoğraf</label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Önizleme"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                </button>
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, image: "" }))}
                    className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <X className="h-4 w-4" />
                    Kaldır
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">İsim (TR) *</label>
              <input
                type="text"
                value={form.nameTr}
                onChange={(e) => setForm((p) => ({ ...p, nameTr: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Av. Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">İsim (EN)</label>
              <input
                type="text"
                value={form.nameEn}
                onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Lawyer Ahmet Yılmaz"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Unvan (TR) *</label>
              <input
                type="text"
                value={form.roleTr}
                onChange={(e) => setForm((p) => ({ ...p, roleTr: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Kurucu Ortak"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Unvan (EN)</label>
              <input
                type="text"
                value={form.roleEn}
                onChange={(e) => setForm((p) => ({ ...p, roleEn: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Founding Partner"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Uzmanlık (TR) *</label>
              <input
                type="text"
                value={form.specialtyTr}
                onChange={(e) => setForm((p) => ({ ...p, specialtyTr: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ceza Hukuku"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Uzmanlık (EN)</label>
              <input
                type="text"
                value={form.specialtyEn}
                onChange={(e) => setForm((p) => ({ ...p, specialtyEn: e.target.value }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Criminal Law"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sıra</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                className="flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {initialMembers.length === 0 && !showAdd ? (
        <div className="rounded-lg bg-white dark:bg-gray-900 p-12 text-center text-gray-500 dark:text-gray-400 shadow-sm">
          Henüz ekip üyesi bulunmuyor. İlk üyeyi ekleyin!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-lg bg-white dark:bg-gray-900 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.nameTr}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Users className="h-7 w-7 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {member.nameTr}
                  </h3>
                  {member.nameEn && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.nameEn}</p>
                  )}
                  <p className="mt-1 text-sm text-blue-600 font-medium">{member.roleTr}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.specialtyTr}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Sıra: {member.order}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 dark:border-gray-700 pt-3">
                <button
                  onClick={() => startEdit(member)}
                  className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  title="Düzenle"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  title="Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
