"use client";

import { useState, useEffect, useCallback } from "react";
import { History, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  CREATE: { label: "Oluşturma", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  UPDATE: { label: "Güncelleme", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  DELETE: { label: "Silme", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const ENTITY_LABELS: Record<string, string> = {
  BlogPost: "Blog Yazısı",
  Category: "Kategori",
  Tag: "Etiket",
  FaqItem: "SSS",
  ContactSubmission: "Mesaj",
  HeroSlide: "Slider",
  PracticeArea: "Uzmanlık Alanı",
  TeamMember: "Ekip Üyesi",
  Testimonial: "Referans",
  Value: "Değer",
  Popup: "Popup",
  PageContent: "Sayfa İçeriği",
  SiteSetting: "Site Ayarı",
  AdminUser: "Kullanıcı",
};

export function AuditLogClient() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entityFilter, setEntityFilter] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "30" });
      if (entityFilter) params.set("entity", entityFilter);

      const res = await fetch(`/api/audit-logs?${params}`);
      if (!res.ok) {
        if (res.status === 403) {
          setError("Bu sayfayı görüntüleme yetkiniz yok.");
          return;
        }
        throw new Error("Fetch error");
      }
      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.totalPages);
    } catch {
      setError("Loglar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, [page, entityFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Aktivite Logu</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tüm admin paneli değişiklikleri
          </p>
        </div>
        <History className="h-8 w-8 text-gray-400" />
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={entityFilter}
          onChange={(e) => { setEntityFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Tüm İşlemler</option>
          {Object.entries(ENTITY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-gray-500">Yükleniyor...</div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-gray-500">Henüz log kaydı yok.</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Tarih</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Kullanıcı</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">İşlem</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Alan</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => {
                  const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: "bg-gray-100 text-gray-800" };
                  return (
                    <tr key={log.id} className="bg-white dark:bg-gray-900">
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-400">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{log.user.name}</div>
                        <div className="text-xs text-gray-500">{log.user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${actionInfo.color}`}>
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {ENTITY_LABELS[log.entity] || log.entity}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-gray-500 dark:text-gray-400">
                        {log.details || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Sayfa {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-gray-300 p-2 text-sm disabled:opacity-50 dark:border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-gray-300 p-2 text-sm disabled:opacity-50 dark:border-gray-700"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
