import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations/blog";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const published = searchParams.get("published");

    const where: Record<string, unknown> = {};
    if (published === "true") where.isPublished = true;
    if (category) where.categoryId = category;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true, author: true, tags: { include: { tag: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = blogPostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { tagIds, ...postData } = validationResult.data;

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        authorId: session.user.id,
        publishedAt: postData.isPublished ? new Date() : null,
        tags: tagIds?.length
          ? { create: tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: { category: true, author: true, tags: { include: { tag: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { id, tagIds, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const validationResult = blogPostSchema.safeParse(updateData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    // Update post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validationResult.data,
        publishedAt: validationResult.data.isPublished ? new Date() : null,
        tags: {
          deleteMany: {},
          create: tagIds?.map((tagId: string) => ({ tagId })) || [],
        },
      },
      include: { category: true, author: true, tags: { include: { tag: true } } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
