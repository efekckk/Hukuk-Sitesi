"use client";

import { BlogEditor } from "@/components/forms/blog-editor";

export interface SerializedPost {
  id: string;
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
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    slug: string;
    nameTr: string;
    nameEn: string | null;
  } | null;
  tags: {
    tag: {
      id: string;
      slug: string;
      nameTr: string;
      nameEn: string | null;
    };
  }[];
}

interface EditPostClientProps {
  initialData: SerializedPost;
}

export function EditPostClient({ initialData }: EditPostClientProps) {
  return <BlogEditor initialData={initialData} />;
}
