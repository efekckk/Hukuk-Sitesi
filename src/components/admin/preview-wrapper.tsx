"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PreviewWrapperProps {
  children: React.ReactNode;
  preview: React.ReactNode;
  title?: string;
}

export function PreviewWrapper({ children, preview, title = "Önizleme" }: PreviewWrapperProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? "Önizlemeyi Kapat" : "Önizleme"}
        </button>
      </div>

      {showPreview ? (
        <div className="flex gap-6">
          <div className="w-[60%] min-w-0">{children}</div>
          <div className="w-[40%] min-w-0">
            <div className="sticky top-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {title}
                </span>
              </div>
              <div className="p-4 overflow-auto max-h-[80vh]">
                <div className="transform scale-[0.6] origin-top-left w-[166.67%]">
                  {preview}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
