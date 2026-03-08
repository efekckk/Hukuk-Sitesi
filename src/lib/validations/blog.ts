import { z } from "zod";

// Transform empty strings to null for optional fields
const emptyToNull = z.string().transform((v) => (v === "" ? null : v));
const optionalString = emptyToNull.nullable().optional();

export const blogPostSchema = z.object({
  slug: z.string().min(1).max(200),
  titleTr: z.string().min(1, "Başlık gereklidir").max(300),
  titleEn: optionalString,
  contentTr: z.string().min(1, "İçerik gereklidir"),
  contentEn: optionalString,
  excerptTr: z.string().max(500).optional().nullable().transform((v) => v || null),
  excerptEn: optionalString,
  featuredImage: optionalString,
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  categoryId: emptyToNull.nullable().optional(),
  tagIds: z.array(z.string()).optional(),
  metaTitleTr: z.string().max(100).optional().nullable().transform((v) => v || null),
  metaTitleEn: optionalString,
  metaDescTr: z.string().max(200).optional().nullable().transform((v) => v || null),
  metaDescEn: optionalString,
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
