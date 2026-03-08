"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check, KeyRound, Shield, User } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface UsersClientProps {
  users: AdminUser[];
  currentUserId: string;
  isSuperAdmin: boolean;
}

type ModalType = "create" | "edit" | "password" | null;

export function UsersClient({ users, currentUserId, isSuperAdmin }: UsersClientProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({ email: "", name: "", password: "", role: "EDITOR" });
  const [editForm, setEditForm] = useState({ name: "", role: "EDITOR" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const closeModal = () => { setModal(null); setSelectedUser(null); setError(null); };

  const handleCreate = async () => {
    if (!createForm.email || !createForm.name || !createForm.password) {
      setError("Tüm alanlar zorunludur"); return;
    }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCreateForm({ email: "", name: "", password: "", role: "EDITOR" });
      closeModal();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser || !editForm.name.trim()) { setError("Ad zorunludur"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      closeModal();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    if (!passwordForm.newPassword) { setError("Yeni şifre zorunludur"); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError("Şifreler eşleşmiyor"); return; }
    if (passwordForm.newPassword.length < 8) { setError("Şifre en az 8 karakter olmalıdır"); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`"${user.name}" kullanıcısını silmek istediğinizden emin misiniz?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin-users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Silinemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isSuperAdmin && (
        <button
          type="button"
          onClick={() => { setModal("create"); setError(null); }}
          className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Yeni Kullanıcı
        </button>
      )}

      <div className="rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Ad</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">E-posta</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Rol</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Oluşturulma</th>
              <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">(Siz)</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === "SUPER_ADMIN"
                      ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                  }`}>
                    {user.role === "SUPER_ADMIN" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {user.role === "SUPER_ADMIN" ? "Süper Admin" : "Editör"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{user.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {(isSuperAdmin || user.id === currentUserId) && (
                      <button type="button"
                        onClick={() => { setSelectedUser(user); setEditForm({ name: user.name, role: user.role }); setModal("edit"); setError(null); }}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Pencil className="h-3 w-3" /> Düzenle
                      </button>
                    )}
                    {(user.id === currentUserId || isSuperAdmin) && (
                      <button type="button"
                        onClick={() => { setSelectedUser(user); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setModal("password"); setError(null); }}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <KeyRound className="h-3 w-3" /> Şifre
                      </button>
                    )}
                    {isSuperAdmin && user.id !== currentUserId && (
                      <button type="button"
                        onClick={() => handleDelete(user)}
                        disabled={loading}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors">
                        <Trash2 className="h-3 w-3" /> Sil
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {modal === "create" && "Yeni Kullanıcı"}
                {modal === "edit" && "Kullanıcıyı Düzenle"}
                {modal === "password" && "Şifre Değiştir"}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {modal === "create" && (
              <div className="space-y-4">
                {[
                  { label: "Ad Soyad *", key: "name", type: "text" },
                  { label: "E-posta *", key: "email", type: "email" },
                  { label: "Şifre *", key: "password", type: "password" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                    <input type={type} value={createForm[key as keyof typeof createForm]}
                      onChange={(e) => setCreateForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Rol</label>
                  <select value={createForm.role} onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="EDITOR">Editör</option>
                    <option value="SUPER_ADMIN">Süper Admin</option>
                  </select>
                </div>
              </div>
            )}

            {modal === "edit" && selectedUser && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ad Soyad *</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                {isSuperAdmin && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Rol</label>
                    <select value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option value="EDITOR">Editör</option>
                      <option value="SUPER_ADMIN">Süper Admin</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {modal === "password" && selectedUser && (
              <div className="space-y-4">
                {selectedUser.id === currentUserId && !isSuperAdmin && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mevcut Şifre *</label>
                    <input type="password" value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Yeni Şifre * (min. 8 karakter)</label>
                  <input type="password" value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Şifre Tekrar *</label>
                  <input type="password" value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button type="button" onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                İptal
              </button>
              <button type="button" disabled={loading}
                onClick={modal === "create" ? handleCreate : modal === "edit" ? handleEdit : handlePasswordChange}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? "..." : <><Check className="h-4 w-4" /> Kaydet</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
