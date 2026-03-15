import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hukukburosu.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // Database not available during build
  }

  const staticPages = [
    "",
    "/hakkimizda",
    "/hizmetlerimiz",
    "/blog",
    "/iletisim",
    "/kvkk",
    "/cerez-politikasi",
  ];

  const staticEntries = staticPages.flatMap((page) => [
    {
      url: `${BASE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          tr: `${BASE_URL}${page}`,
          en: `${BASE_URL}/en${page}`,
        },
      },
    },
  ]);

  const blogEntries = posts.flatMap((post) => [
    {
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          tr: `${BASE_URL}/blog/${post.slug}`,
          en: `${BASE_URL}/en/blog/${post.slug}`,
        },
      },
    },
  ]);

  return [...staticEntries, ...blogEntries];
}
