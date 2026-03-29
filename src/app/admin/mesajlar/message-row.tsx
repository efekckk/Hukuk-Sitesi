"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Eye, CheckCheck, Archive, Trash2, Send, Loader2 } from "lucide-react";
import { VALIDATION } from "@/lib/constants/admin";

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
  kvkkConsent?: boolean;
  kvkkConsentAt?: string | null;
  kvkkVersion?: string | null;
  kvkkIp?: string | null;
}

interface MessageRowProps {
  message: SerializedMessage;
}

import { MESSAGE_STATUS_LABELS, MESSAGE_STATUS_CLASSES } from "@/lib/constants/admin";

const statusConfig: Record<string, { label: string; className: string }> = Object.fromEntries(
  Object.keys(MESSAGE_STATUS_LABELS).map((k) => [
    k,
    { label: MESSAGE_STATUS_LABELS[k as keyof typeof MESSAGE_STATUS_LABELS], className: MESSAGE_STATUS_CLASSES[k as keyof typeof MESSAGE_STATUS_CLASSES] },
  ])
);

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

async function sendReply(id: string, replyText: string) {
  const res = await fetch("/api/messages/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, replyText }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Yanıt gönderilemedi");
}

export function MessageRow({ message }: MessageRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);
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

  const handleSendReply = async () => {
    if (replyLoading || !replyText.trim()) return;
    setReplyLoading(true);
    setReplyError(null);
    try {
      await sendReply(message.id, replyText);
      setReplySent(true);
      setReplyText("");
      setShowReply(false);
      router.refresh();
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Yanıt gönderilemedi");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleRowClick = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);
    // Açılıyorsa ve okunmamışsa → okundu işaretle (bağımsız — loading'e takılmaz)
    if (willExpand && message.status === "UNREAD") {
      fetch("/api/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, status: "READ" }),
      }).then(() => router.refresh()).catch(() => {/* sessiz hata */});
    }
  };

  return (
    <>
      {/* Ana satır */}
      <tr
        className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer ${
          message.status === "UNREAD" ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
        }`}
        onClick={handleRowClick}
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
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
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
            {/* Yanıtla butonu — arşivlenmemiş mesajlar için */}
            {message.status !== "ARCHIVED" && (
              <button
                type="button"
                onClick={() => { setShowReply(!showReply); setExpanded(true); }}
                disabled={loading}
                title="E-posta ile yanıtla"
                className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="h-3 w-3" />
                Yanıtla
              </button>
            )}
            {message.status === "READ" && (
              <button
                type="button"
                onClick={() => handleStatusChange("REPLIED")}
                disabled={loading}
                title="Yanıtlandı olarak işaretle (e-posta göndermeden)"
                className="inline-flex items-center gap-1 rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                <CheckCheck className="h-3 w-3" />
              </button>
            )}
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
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </td>
      </tr>

      {/* Genişletilmiş içerik */}
      {expanded && (
        <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <td colSpan={6} className="px-6 py-4">
            <div className="space-y-3">
              {/* Gelen mesaj */}
              {message.phone && (
                <p className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-gray-100">Telefon: </span>
                  <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline">{message.phone}</a>
                </p>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Mesaj:</p>
                <p className="whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  {message.message}
                </p>
              </div>

              {/* KVKK Onay Bilgileri */}
              <div className="rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 p-3">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-1.5">KVKK Onay Bilgileri</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <span className="text-gray-400 dark:text-gray-500">Onay: </span>
                    <span className={message.kvkkConsent ? "text-green-600 dark:text-green-400" : "text-red-500"}>
                      {message.kvkkConsent ? "Verildi" : "Verilmedi"}
                    </span>
                  </div>
                  {message.kvkkConsentAt && (
                    <div>
                      <span className="text-gray-400 dark:text-gray-500">Tarih: </span>
                      {new Date(message.kvkkConsentAt).toLocaleString("tr-TR")}
                    </div>
                  )}
                  {message.kvkkIp && (
                    <div>
                      <span className="text-gray-400 dark:text-gray-500">IP: </span>
                      {message.kvkkIp}
                    </div>
                  )}
                  {message.kvkkVersion && (
                    <div>
                      <span className="text-gray-400 dark:text-gray-500">Metin ver.: </span>
                      {new Date(message.kvkkVersion).toLocaleDateString("tr-TR")}
                    </div>
                  )}
                </div>
              </div>

              {/* Başarı mesajı */}
              {replySent && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2.5 text-sm text-green-700 dark:text-green-400">
                  <CheckCheck className="h-4 w-4 shrink-0" />
                  Yanıt başarıyla gönderildi.
                </div>
              )}

              {/* Yanıt paneli */}
              {showReply && (
                <div className="mt-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Yanıt gönder →{" "}
                      <span className="font-normal text-blue-600 dark:text-blue-400">{message.email}</span>
                    </p>
                    <p className="text-xs text-gray-400">Konu: Re: {message.subject}</p>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    placeholder={`Sayın ${message.name},\n\nYazınız...`}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                  {replyError && (
                    <p className="text-xs text-red-500">{replyError}</p>
                  )}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => { setShowReply(false); setReplyError(null); }}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={replyLoading || replyText.trim().length < VALIDATION.REPLY_MIN_LENGTH}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replyLoading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          E-posta Gönder
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
