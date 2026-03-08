"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Eye, CheckCheck, Archive, Trash2, Mail } from "lucide-react";

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
    label: "Okunmadı",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  READ: {
    label: "Okundu",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  REPLIED: {
    label: "Yanıtlandı",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  ARCHIVED: {
    label: "Arşivlendi",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
};

async function updateMessageStatus(id: string, status: string) {
  const res = await fetch("/api/messages", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!res.ok) throw new Error("Durum güncellenemedi");
}

async function deleteMessage(id: string) {
  const res = await fetch("/api/messages", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Mesaj silinemedi");
}

export function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const status = statusConfig[message.status] || statusConfig.UNREAD;

  const handleStatusChange = async (newStatus: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await updateMessageStatus(message.id, newStatus);
      router.refresh();
    } catch {
      setError("İşlem başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    if (!window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteMessage(message.id);
      router.refresh();
    } catch {
      setError("Mesaj silinemedi");
    } finally {
      setLoading(false);
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
          {message.status === "UNREAD" && (
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 shrink-0" />
          )}
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
        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
          {message.formattedDate}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {message.status === "UNREAD" && (
              <button
                type="button"
                onClick={() => handleStatusChange("READ")}
                disabled={loading}
                title="Okundu işaretle"
                className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                <Eye className="h-3 w-3" />
                Okundu
              </button>
            )}
            {message.status === "READ" && (
              <button
                type="button"
                onClick={() => handleStatusChange("REPLIED")}
                disabled={loading}
                title="Yanıtlandı işaretle"
                className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCheck className="h-3 w-3" />
                Yanıtlandı
              </button>
            )}
            {message.status === "REPLIED" && (
              <button
                type="button"
                onClick={() => handleStatusChange("ARCHIVED")}
                disabled={loading}
                title="Arşivle"
                className="inline-flex items-center gap-1 rounded-md bg-gray-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
              >
                <Archive className="h-3 w-3" />
                Arşivle
              </button>
            )}
            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
              title="E-posta gönder"
              onClick={() => message.status === "UNREAD" && handleStatusChange("READ")}
              className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Mail className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              title="Sil"
              className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 ml-1" />
            )}
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-2">
              {message.phone && (
                <p className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Telefon: </span>
                  <span className="text-gray-500 dark:text-gray-400">{message.phone}</span>
                </p>
              )}
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Mesaj:</p>
              <p className="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {message.message}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
