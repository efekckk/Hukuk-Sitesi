"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  X,
  FileText,
  Settings,
  Search,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { slugify } from "@/lib/utils";

interface BlogEditorProps {
  initialData?: {
    id?: string;
    slug: string;
    titleTr: string;
    titleEn: string | null;
    contentTr: string;
    contentEn: string | null;
    excerptTr: string | null;
    excerptEn: string | null;
    featuredImage: string | null;
    isPublished: boolean;
    isFeatured: boolean;
    categoryId: string | null;
    metaTitleTr: string | null;
    metaTitleEn: string | null;
    metaDescTr: string | null;
    metaDescEn: string | null;
    tags?: { tag: { id: string } }[];
  };
}

interface Category {
  id: string;
  slug: string;
  nameTr: string;
  nameEn: string | null;
}

interface Tag {
  id: string;
  slug: string;
  nameTr: string;
}

export function BlogEditor({ initialData }: BlogEditorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tr" | "en">("tr");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    titleTr: initialData?.titleTr || "",
    titleEn: initialData?.titleEn || "",
    contentTr: initialData?.contentTr || "",
    contentEn: initialData?.contentEn || "",
    excerptTr: initialData?.excerptTr || "",
    excerptEn: initialData?.excerptEn || "",
    featuredImage: initialData?.featuredImage || "",
    isPublished: initialData?.isPublished || false,
    isFeatured: initialData?.isFeatured || false,
    categoryId: initialData?.categoryId || "",
    metaTitleTr: initialData?.metaTitleTr || "",
    metaTitleEn: initialData?.metaTitleEn || "",
    metaDescTr: initialData?.metaDescTr || "",
    metaDescEn: initialData?.metaDescEn || "",
    tagIds: initialData?.tags?.map((t) => t.tag.id) || [],
  });

  const editorTr = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Türkçe içerik yazın..." }),
    ],
    content: formData.contentTr,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentTr: editor.getHTML() }));
    },
  });

  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write English content..." }),
    ],
    content: formData.contentEn,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentEn: editor.getHTML() }));
    },
  });

  const currentEditor = activeTab === "tr" ? editorTr : editorEn;

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});

    fetch("/api/tags")
      .then((r) => r.json())
      .then((data) => setTags(data.tags || []))
      .catch(() => {});
  }, []);

  const handleTitleChange = (value: string) => {
    if (activeTab === "tr") {
      setFormData((prev) => ({
        ...prev,
        titleTr: value,
        slug: prev.slug || slugify(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, titleEn: value }));
    }
  };

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          currentEditor?.chain().focus().setImage({ src: data.url }).run();
        } else {
          setUploadError("Görsel yüklenemedi");
        }
      } catch {
        setUploadError("Görsel yüklenemedi");
      }
    };
    input.click();
  }, [currentEditor]);

  const handleFeaturedImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingImage(true);
      const fd = new FormData();
      fd.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          setFormData((prev) => ({ ...prev, featuredImage: data.url }));
        } else {
          setUploadError("Görsel yüklenemedi");
        }
      } catch {
        setUploadError("Görsel yüklenemedi");
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  };

  const handleAddLink = useCallback(() => {
    const existing = currentEditor?.getAttributes("link").href || "";
    setLinkUrl(existing);
    setLinkModalOpen(true);
  }, [currentEditor]);

  const handleLinkConfirm = useCallback(() => {
    if (linkUrl.trim() && currentEditor) {
      const href = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`;
      currentEditor.chain().focus().setLink({ href }).run();
    }
    setLinkModalOpen(false);
    setLinkUrl("");
  }, [linkUrl, currentEditor]);

  const handleLinkRemove = useCallback(() => {
    currentEditor?.chain().focus().unsetLink().run();
    setLinkModalOpen(false);
    setLinkUrl("");
  }, [currentEditor]);

  const handleSave = async (publish: boolean) => {
    if (!formData.titleTr.trim()) {
      setSaveError("Başlık (TR) zorunludur");
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      // Clean up empty strings to null for optional fields
      const payload = {
        slug: formData.slug || slugify(formData.titleTr),
        titleTr: formData.titleTr,
        titleEn: formData.titleEn || null,
        contentTr: formData.contentTr || "<p></p>",
        contentEn: formData.contentEn || null,
        excerptTr: formData.excerptTr || null,
        excerptEn: formData.excerptEn || null,
        featuredImage: formData.featuredImage || null,
        isPublished: publish,
        isFeatured: formData.isFeatured,
        categoryId: formData.categoryId || null,
        metaTitleTr: formData.metaTitleTr || null,
        metaTitleEn: formData.metaTitleEn || null,
        metaDescTr: formData.metaDescTr || null,
        metaDescEn: formData.metaDescEn || null,
        tagIds: formData.tagIds,
        ...(initialData?.id ? { id: initialData.id } : {}),
      };

      const method = initialData?.id ? "PUT" : "POST";
      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.error || "Kaydetme hatasi";
        throw new Error(msg);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/admin/yazilar");
        router.refresh();
      }, 500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Yazı kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!initialData?.id;

  return (
    <div className="min-h-screen -m-8">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/yazilar")}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Yazilara Don
            </button>
            <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEditing ? "Yaziyi Duzenle" : "Yeni Yazi"}
            </h1>
            {formData.isPublished ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Yayinda
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                Taslak
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4" />
                Kaydedildi!
              </span>
            )}
            {saveError && (
              <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                {saveError}
              </span>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              Taslak Kaydet
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Yayinla
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex gap-6 p-6">
        {/* Left Column - Editor */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Language Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("tr")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "tr"
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                🇹🇷 Turkce
              </button>
              <button
                onClick={() => setActiveTab("en")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "en"
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {activeTab === "tr" ? "Baslik *" : "Title"}
                </label>
                <input
                  type="text"
                  value={activeTab === "tr" ? formData.titleTr : formData.titleEn}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 text-lg font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder={
                    activeTab === "tr" ? "Yazi basligini girin..." : "Enter post title..."
                  }
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {activeTab === "tr" ? "Ozet" : "Excerpt"}
                </label>
                <textarea
                  value={activeTab === "tr" ? formData.excerptTr : formData.excerptEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [activeTab === "tr" ? "excerptTr" : "excerptEn"]: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                  placeholder={
                    activeTab === "tr"
                      ? "Kisa ozet (liste gorunumunde gorunur)..."
                      : "Short excerpt..."
                  }
                />
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-wrap">
              <ToolbarButton
                onClick={() => currentEditor?.chain().focus().toggleBold().run()}
                active={currentEditor?.isActive("bold")}
                icon={<Bold className="w-4 h-4" />}
                tooltip="Kalin"
              />
              <ToolbarButton
                onClick={() => currentEditor?.chain().focus().toggleItalic().run()}
                active={currentEditor?.isActive("italic")}
                icon={<Italic className="w-4 h-4" />}
                tooltip="Italik"
              />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />
              <ToolbarButton
                onClick={() =>
                  currentEditor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={currentEditor?.isActive("heading", { level: 2 })}
                icon={<Heading2 className="w-4 h-4" />}
                tooltip="Baslik 2"
              />
              <ToolbarButton
                onClick={() =>
                  currentEditor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={currentEditor?.isActive("heading", { level: 3 })}
                icon={<Heading3 className="w-4 h-4" />}
                tooltip="Baslik 3"
              />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />
              <ToolbarButton
                onClick={() => currentEditor?.chain().focus().toggleBulletList().run()}
                active={currentEditor?.isActive("bulletList")}
                icon={<List className="w-4 h-4" />}
                tooltip="Madde Listesi"
              />
              <ToolbarButton
                onClick={() =>
                  currentEditor?.chain().focus().toggleOrderedList().run()
                }
                active={currentEditor?.isActive("orderedList")}
                icon={<ListOrdered className="w-4 h-4" />}
                tooltip="Numarali Liste"
              />
              <ToolbarButton
                onClick={() =>
                  currentEditor?.chain().focus().toggleBlockquote().run()
                }
                active={currentEditor?.isActive("blockquote")}
                icon={<Quote className="w-4 h-4" />}
                tooltip="Alinti"
              />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />
              <ToolbarButton
                onClick={handleImageUpload}
                icon={<ImageIcon className="w-4 h-4" />}
                tooltip="Gorsel Ekle"
              />
              <ToolbarButton
                onClick={handleAddLink}
                icon={<LinkIcon className="w-4 h-4" />}
                tooltip="Link Ekle"
              />
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-0.5" />
              <ToolbarButton
                onClick={() => currentEditor?.chain().focus().undo().run()}
                icon={<Undo className="w-4 h-4" />}
                tooltip="Geri Al"
              />
              <ToolbarButton
                onClick={() => currentEditor?.chain().focus().redo().run()}
                icon={<Redo className="w-4 h-4" />}
                tooltip="Ileri Al"
              />
            </div>

            <div className="p-4 min-h-[450px] bg-white dark:bg-gray-900">
              <div className={activeTab === "tr" ? "block" : "hidden"}>
                <EditorContent editor={editorTr} className="tiptap" />
              </div>
              <div className={activeTab === "en" ? "block" : "hidden"}>
                <EditorContent editor={editorEn} className="tiptap" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 shrink-0 space-y-5">
          {/* URL Slug */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">URL</h3>
            </div>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 font-mono placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="yazi-url-slug"
            />
            {formData.slug && (
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 truncate">
                /blog/{formData.slug}
              </p>
            )}
          </div>

          {/* Featured Image */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Öne Çıkan Görsel
              </h3>
            </div>
            {uploadError && (
              <p className="mb-2 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                {uploadError}
              </p>
            )}
            {formData.featuredImage ? (
              <div className="relative group">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, featuredImage: "" }))
                  }
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleFeaturedImageUpload}
                disabled={uploadingImage}
                className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">
                  {uploadingImage ? "Yukleniyor..." : "Gorsel Yukle"}
                </span>
              </button>
            )}
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ayarlar</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900"
                >
                  <option value="">Kategori secin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameTr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700 dark:text-gray-300">One Cikan Yazi</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.isFeatured}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: !prev.isFeatured,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formData.isFeatured ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                      formData.isFeatured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">SEO</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {activeTab === "tr" ? "Meta Baslik" : "Meta Title"}
                </label>
                <input
                  type="text"
                  value={
                    activeTab === "tr" ? formData.metaTitleTr : formData.metaTitleEn
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [activeTab === "tr" ? "metaTitleTr" : "metaTitleEn"]:
                        e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Arama sonuclarinda gorunecek baslik"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {activeTab === "tr" ? "Meta Aciklama" : "Meta Description"}
                </label>
                <textarea
                  value={
                    activeTab === "tr" ? formData.metaDescTr : formData.metaDescEn
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [activeTab === "tr" ? "metaDescTr" : "metaDescEn"]:
                        e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                  placeholder="Arama sonuclarinda gorunecek aciklama"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Link Ekle
              </h3>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLinkConfirm()}
              autoFocus
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-900 mb-4"
            />
            <div className="flex items-center gap-2 justify-end">
              {currentEditor?.isActive("link") && (
                <button
                  type="button"
                  onClick={handleLinkRemove}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Linki Kaldır
                </button>
              )}
              <button
                type="button"
                onClick={() => { setLinkModalOpen(false); setLinkUrl(""); }}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleLinkConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  icon,
  tooltip,
}: {
  onClick: () => void;
  active?: boolean;
  icon: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      className={`p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors ${
        active
          ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      }`}
    >
      {icon}
    </button>
  );
}
