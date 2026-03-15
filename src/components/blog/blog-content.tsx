"use client";

import DOMPurify from "isomorphic-dompurify";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const clean = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "h1","h2","h3","h4","h5","h6",
      "p","br","hr","blockquote","pre","code",
      "ul","ol","li","strong","em","u","s","a",
      "img","figure","figcaption","table","thead","tbody","tr","th","td",
    ],
    ALLOWED_ATTR: ["href","src","alt","title","class","target","rel"],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
