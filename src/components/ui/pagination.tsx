import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

function getPageUrl(baseUrl: string, page: number): string {
  if (page === 1) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}page=${page}`;
}

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

function Pagination({ currentPage, totalPages, baseUrl, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(baseUrl, currentPage - 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {visiblePages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-10 w-10 items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isActive = page === currentPage;

        return isActive ? (
          <span
            key={page}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-white text-sm font-medium"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(baseUrl, page)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            {page}
          </Link>
        );
      })}

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(baseUrl, currentPage + 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground opacity-50 cursor-not-allowed">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

export { Pagination };
