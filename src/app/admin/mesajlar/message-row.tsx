"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

interface SerializedMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  formattedDate: string;
}

interface MessageRowProps {
  message: SerializedMessage;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  UNREAD: {
    label: "Okunmadi",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  READ: {
    label: "Okundu",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  REPLIED: {
    label: "Yanitlandi",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  ARCHIVED: {
    label: "Arsivlendi",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [marking, setMarking] = useState(false);
  const router = useRouter();

  const status = statusConfig[message.status] || statusConfig.UNREAD;

  const handleMarkAsRead = async () => {
    if (message.status !== "UNREAD" || marking) return;
    setMarking(true);

    try {
      await fetch(`/api/contact/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });
      router.refresh();
    } catch {
      // Silently fail - user can retry
    } finally {
      setMarking(false);
    }
  };

  return (
    <>
      <tr
        className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer ${
          message.status === "UNREAD" ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
          {message.name}
        </td>
        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{message.email}</td>
        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{message.subject}</td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </td>
        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
          {message.formattedDate}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            {message.status === "UNREAD" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead();
                }}
                disabled={marking}
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Eye className="h-3 w-3" />
                {marking ? "..." : "Okundu"}
              </button>
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-2">
              {message.phone && (
                <p className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Telefon:{" "}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{message.phone}</span>
                </p>
              )}
              <p className="text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">Mesaj: </span>
              </p>
              <p className="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">
                {message.message}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
