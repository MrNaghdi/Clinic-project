import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, UserPlus, UserMinus, Search, Crown } from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchAdmins,
  promoteToAdmin,
  demoteAdmin,
  fetchAdminUsers,
} from "../api/admin.api";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

export default function AdminAdmins() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [promoteSearch, setPromoteSearch] = useState("");
  const [promoting, setPromoting] = useState(false);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin", "admins"],
    queryFn: fetchAdmins,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const { data: customersData } = useQuery({
    queryKey: ["admin", "users", { search: promoteSearch, role: "customer" }],
    queryFn: () =>
      fetchAdminUsers({
        search: promoteSearch || undefined,
        role: "customer",
        limit: 20,
      }),
    enabled: modalOpen,
    staleTime: 1 * 60 * 1000,
  });

  const customers = customersData?.items ?? [];

  const handlePromote = async (userId: number, name: string) => {
    if (!window.confirm(`آیا مطمئنی می‌خوای ${name} رو ادمین کنی؟`)) return;

    setPromoting(true);
    try {
      await promoteToAdmin(userId);
      setModalOpen(false);
      setPromoteSearch("");
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "خطا");
    } finally {
      setPromoting(false);
    }
  };

  const handleDemote = async (admin: any) => {
    if (admin.role === "super_admin") {
      alert("نقش سوپر ادمین قابل لغو نیست");
      return;
    }
    if (
      !window.confirm(
        `لغو نقش ادمین برای ${admin.first_name} ${admin.last_name}؟`,
      )
    )
      return;

    try {
      await demoteAdmin(admin.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "خطا");
    }
  };

  const filteredAdmins = search
    ? admins.filter(
        (a) =>
          `${a.first_name ?? ""} ${a.last_name ?? ""}`.includes(search) ||
          a.phone.includes(search),
      )
    : admins;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black mb-1">مدیریت ادمین‌ها</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            فقط سوپر ادمین می‌تواند ادمین جدید اضافه یا حذف کند
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90"
        >
          <UserPlus size={16} />
          ارتقا به ادمین
        </button>
      </div>

      <div className="relative">
        <Search
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${
            darkMode ? "text-white/40" : "text-slate-400"
          }`}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی ادمین..."
          className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
            darkMode
              ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
              : "bg-white border-slate-200 focus:border-brand-500"
          }`}
        />
      </div>

      <div
        className={`rounded-2xl border overflow-hidden ${
          darkMode
            ? "bg-white/[0.03] border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`h-14 rounded-lg animate-pulse ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-12 text-center">
            <p className={darkMode ? "text-white/50" : "text-slate-500"}>
              ادمینی یافت نشد
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-white/5">
            {filteredAdmins.map((a, i) => {
              const isSuper = a.role === "super_admin";
              const img = getImageUrl(a.profile_image);
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]"
                >
                  {img ? (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black ${
                        isSuper
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-brand-500 to-accent-500"
                      }`}
                    >
                      {isSuper ? <Crown size={18} /> : a.first_name?.[0] ?? "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold truncate">
                        {a.first_name} {a.last_name}
                      </p>
                      {isSuper && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-bold">
                          <Crown size={10} />
                          سوپر ادمین
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs font-mono tabular-nums ${
                        darkMode ? "text-white/40" : "text-slate-400"
                      }`}
                    >
                      {a.phone}
                    </p>
                  </div>

                  {!isSuper && (
                    <button
                      onClick={() => handleDemote(a)}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg border border-red-500/30 text-red-500 text-xs font-bold hover:bg-red-500/10"
                    >
                      <UserMinus size={12} />
                      لغو ادمینی
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setModalOpen(false);
            setPromoteSearch("");
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl p-6 ${
              darkMode ? "bg-[#0c0a14]" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Shield size={18} className="text-brand-500" />
                ارتقا به ادمین
              </h3>
            </div>

            <div className="relative mb-4">
              <Search
                size={16}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-white/40" : "text-slate-400"
                }`}
              />
              <input
                autoFocus
                type="text"
                value={promoteSearch}
                onChange={(e) => setPromoteSearch(e.target.value)}
                placeholder="جستجو با شماره تلفن یا نام..."
                className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-slate-200"
                }`}
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1">
              {customers.length === 0 ? (
                <p
                  className={`text-xs p-3 text-center ${
                    darkMode ? "text-white/40" : "text-slate-400"
                  }`}
                >
                  کاربری یافت نشد
                </p>
              ) : (
                customers.map((u) => {
                  const uimg = getImageUrl(u.profile_image);
                  return (
                    <button
                      key={u.id}
                      onClick={() =>
                        handlePromote(
                          u.id,
                          `${u.first_name ?? ""} ${u.last_name ?? ""}`,
                        )
                      }
                      disabled={promoting}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-right transition-colors ${
                        darkMode ? "hover:bg-white/5" : "hover:bg-slate-50"
                      } disabled:opacity-50`}
                    >
                      {uimg ? (
                        <img
                          src={uimg}
                          alt=""
                          loading="lazy"
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center text-xs font-black">
                          {u.first_name?.[0] ?? "?"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold">
                          {u.first_name} {u.last_name}
                        </p>
                        <p
                          className={`text-[10px] font-mono ${
                            darkMode ? "text-white/40" : "text-slate-400"
                          }`}
                        >
                          {u.phone}
                        </p>
                      </div>
                      <UserPlus size={14} className="text-brand-500" />
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={() => {
                setModalOpen(false);
                setPromoteSearch("");
              }}
              className={`w-full mt-4 h-11 rounded-xl border font-bold text-sm ${
                darkMode
                  ? "border-white/10 hover:bg-white/5"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              لغو
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}