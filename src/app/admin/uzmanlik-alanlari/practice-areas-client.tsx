"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Check, Loader2, Upload,
  Shield, Heart, Briefcase, Building2, Landmark, Home,
  Award, BookOpen, Scale, Users, Star, Target, Lightbulb,
  Gavel, Lock, TrendingUp, Truck, Globe, FileText, Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ADMIN_ICON_NAMES, VALIDATION } from "@/lib/constants/admin";

interface PracticeArea {
  id: string;
  slug: string;
  titleTr: string;
  titleEn: string | null;
  descriptionTr: string;
  descriptionEn: string | null;
  longDescTr: string;
  longDescEn: string | null;
  icon: string;
  image: string | null;
  itemsTr: string;
  itemsEn: string | null;
  order: number;
}

interface PracticeAreasClientProps {
  initialAreas: PracticeArea[];
}

const iconMap: Record<string, LucideIcon> = {
  Shield, Heart, Briefcase, Building2, Landmark, Home,
  Award, BookOpen, Scale, Users, Star, Target, Lightbulb,
  Gavel, Lock, TrendingUp, Truck, Globe, FileText, Handshake,
};

const iconOptions = [...ADMIN_ICON_NAMES];

const emptyForm = {
  slug: "",
  titleTr: "",
  titleEn: "",
  descriptionTr: "",
  descriptionEn: "",
  longDescTr: "",
  longDescEn: "",
  icon: "Shield",
  image: "",
  itemsTr: "",
  itemsEn: "",
  order: 0,
};

export function PracticeAreasClient({ initialAreas }: PracticeAreasClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowAdd(false);
    setError("");
  };

  const startEdit = (area: PracticeArea) => {
    setEditingId(area.id);
    setShowAdd(true);
    setForm({
      slug: area.slug,
      titleTr: area.titleTr,
      titleEn: area.titleEn || "",
      descriptionTr: area.descriptionTr,
      descriptionEn: area.descriptionEn || "",
      longDescTr: area.longDescTr,
      longDescEn: area.longDescEn || "",
      icon: area.icon,
      image: area.image || "",
      itemsTr: area.itemsTr,
      itemsEn: area.itemsEn || "",
      order: area.order,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAdd = () => {
    setShowAdd(true);
    setEditingId(null);
    setForm({ ...emptyForm, order: initialAreas.length + 1 });
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
    if (!form.slug.trim() || !form.titleTr.trim() || !form.descriptionTr.trim() || !form.longDescTr.trim() || !form.itemsTr.trim()) {
      setError("Slug, başlık, açıklama, uzun açıklama ve hizmet kalemleri (TR) zorunludur.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { id: editingId, ...form } : form;

      const res = await fetch("/api/practice-areas", {
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
    if (!confirm("Bu uzmanlık alanını silmek istediğinize emin misiniz?")) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/practice-areas?id=${id}`, { method: "DELETE" });
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

  const inputClass =
    "flex h-10 w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const textareaClass =
    "flex w-full rounded-lg border-2 border-gray-600 dark:border-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Uzmanlık Alanları</h1>
        <button
          onClick={startAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Yeni Alan
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
            {editingId ? "Alanı Düzenle" : "Yeni Uzmanlık Alanı"}
          </h2>

          {/* Image Upload */}
          <div className="mb-4">
            <label className={labelClass}>Görsel (opsiyonel)</label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {form.image ? (
                  <img src={form.image} alt="Önizleme" className="h-full w-full object-cover" />
                ) : (
                  <Briefcase className="h-8 w-8 text-gray-400 dark:text-gray-500" />
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
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Yükleniyor..." : "Görsel Yükle"}
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

          {/* Slug + Icon + Order */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                className={inputClass}
                placeholder="ceza-hukuku"
              />
            </div>
            <div>
              <label className={labelClass}>İkon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                className={inputClass}
              >
                {iconOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Sıra</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Title TR/EN */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className={labelClass}>Başlık (TR) *</label>
              <input
                type="text"
                value={form.titleTr}
                onChange={(e) => setForm((p) => ({ ...p, titleTr: e.target.value }))}
                className={inputClass}
                placeholder="Ceza Hukuku"
              />
            </div>
            <div>
              <label className={labelClass}>Başlık (EN)</label>
              <input
                type="text"
                value={form.titleEn}
                onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                className={inputClass}
                placeholder="Criminal Law"
              />
            </div>
          </div>

          {/* Description TR/EN */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className={labelClass}>Kısa Açıklama (TR) *</label>
              <textarea
                value={form.descriptionTr}
                onChange={(e) => setForm((p) => ({ ...p, descriptionTr: e.target.value }))}
                className={textareaClass}
                rows={3}
                placeholder="Ceza davalarında savunma..."
              />
            </div>
            <div>
              <label className={labelClass}>Kısa Açıklama (EN)</label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                className={textareaClass}
                rows={3}
                placeholder="Expert support on defense..."
              />
            </div>
          </div>

          {/* Long Description TR/EN */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className={labelClass}>Uzun Açıklama (TR) *</label>
              <textarea
                value={form.longDescTr}
                onChange={(e) => setForm((p) => ({ ...p, longDescTr: e.target.value }))}
                className={textareaClass}
                rows={5}
                placeholder="Detaylı açıklama..."
              />
            </div>
            <div>
              <label className={labelClass}>Uzun Açıklama (EN)</label>
              <textarea
                value={form.longDescEn}
                onChange={(e) => setForm((p) => ({ ...p, longDescEn: e.target.value }))}
                className={textareaClass}
                rows={5}
                placeholder="Detailed description..."
              />
            </div>
          </div>

          {/* Items TR/EN */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div>
              <label className={labelClass}>Hizmet Kalemleri (TR) * <span className="text-xs text-gray-400">Her satır bir kalem</span></label>
              <textarea
                value={form.itemsTr}
                onChange={(e) => setForm((p) => ({ ...p, itemsTr: e.target.value }))}
                className={textareaClass}
                rows={5}
                placeholder={"Ağır Ceza Davaları\nSoruşturma Süreçleri\nTutukluluk İtirazları"}
              />
            </div>
            <div>
              <label className={labelClass}>Hizmet Kalemleri (EN) <span className="text-xs text-gray-400">Her satır bir kalem</span></label>
              <textarea
                value={form.itemsEn}
                onChange={(e) => setForm((p) => ({ ...p, itemsEn: e.target.value }))}
                className={textareaClass}
                rows={5}
                placeholder={"Serious Criminal Cases\nInvestigation Processes\nDetention Objections"}
              />
            </div>
          </div>

          <div className="flex gap-2">
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

      {/* Practice Areas Grid */}
      {initialAreas.length === 0 && !showAdd ? (
        <div className="rounded-lg bg-white dark:bg-gray-900 p-12 text-center text-gray-500 dark:text-gray-400 shadow-sm">
          Henüz uzmanlık alanı bulunmuyor. İlk alanı ekleyin!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialAreas.map((area) => {
            const Icon = iconMap[area.icon] || Shield;
            return (
              <div
                key={area.id}
                className="rounded-lg bg-white dark:bg-gray-900 p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {area.titleTr}
                    </h3>
                    {area.titleEn && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{area.titleEn}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {area.descriptionTr}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      Slug: {area.slug} · Sıra: {area.order}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => startEdit(area)}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(area.id)}
                    className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
