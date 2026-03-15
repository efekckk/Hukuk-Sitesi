import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OldPracticeAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/hizmetlerimiz/${slug}`);
}
