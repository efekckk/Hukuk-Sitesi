export type Locale = "tr" | "en";

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogPostWithRelations {
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
  publishedAt: Date | null;
  viewCount: number;
  metaTitleTr: string | null;
  metaTitleEn: string | null;
  metaDescTr: string | null;
  metaDescEn: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
  };
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
