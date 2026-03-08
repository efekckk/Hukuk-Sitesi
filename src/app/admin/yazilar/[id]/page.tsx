import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditPostClient } from "./edit-post-client";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await auth();
  if (!session) redirect("/admin/giris");

  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Serialize dates to strings for client component
  const serializedPost = {
    id: post.id,
    slug: post.slug,
    titleTr: post.titleTr,
    titleEn: post.titleEn,
    contentTr: post.contentTr,
    contentEn: post.contentEn,
    excerptTr: post.excerptTr,
    excerptEn: post.excerptEn,
    featuredImage: post.featuredImage,
    isPublished: post.isPublished,
    isFeatured: post.isFeatured,
    categoryId: post.categoryId,
    metaTitleTr: post.metaTitleTr,
    metaTitleEn: post.metaTitleEn,
    metaDescTr: post.metaDescTr,
    metaDescEn: post.metaDescEn,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    category: post.category
      ? {
          id: post.category.id,
          slug: post.category.slug,
          nameTr: post.category.nameTr,
          nameEn: post.category.nameEn,
        }
      : null,
    tags: post.tags.map((t) => ({
      tag: {
        id: t.tag.id,
        slug: t.tag.slug,
        nameTr: t.tag.nameTr,
        nameEn: t.tag.nameEn,
      },
    })),
  };

  return <EditPostClient initialData={serializedPost} />;
}
