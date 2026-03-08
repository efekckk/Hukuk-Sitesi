"use client";

import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { MessageRow } from "./message-row";

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

interface MessagesClientProps {
  messages: SerializedMessage[];
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "UNREAD", label: "Okunmadı" },
  { value: "READ", label: "Okundu" },
  { value: "REPLIED", label: "Yanıtlandı" },
  { value: "ARCHIVED", label: "Arşivlendi" },
];

export function MessagesClient({ messages }: MessagesClientProps) {
  const [statusFilter, setStatusFilter] = useState("all");

  const counts = useMemo(() => ({
    all: messages.length,
    UNREAD: messages.filter((m) => m.status === "UNREAD").length,
    READ: messages.filter((m) => m.status === "READ").length,
    REPLIED: messages.filter((m) => m.status === "REPLIED").length,
    ARCHIVED: messages.filter((m) => m.status === "ARCHIVED").length,
  }), [messages]);

  const filtered = useMemo(() =>
    statusFilter === "all" ? messages : messages.filter((m) => m.status === statusFilter),
    [messages, statusFilter]
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const count = counts[opt.value as keyof typeof counts];
          const isActive = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {opt.label}
              {opt.value === "UNREAD" && count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                  {count}
                </span>
              )}
              {opt.value !== "UNREAD" && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
              <MessageSquare className="h-7 w-7 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {statusFilter === "all" ? "Henüz mesaj bulunmuyor." : "Bu kategoride mesaj yok."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">E-posta</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Konu</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Durum</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Tarih</th>
                  <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((msg) => (
                  <MessageRow key={msg.id} message={msg} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
