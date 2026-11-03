import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  Clock,
  DollarSign,
  ImageIcon,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchAdminServices,
  deleteService,
  toggleServiceActive,
} from "../api/admin.api";
import type { AdminService } from "../api/types";
import { ServiceFormModal } from "../components/ServiceFormModal";
import { getImageUrl } from "../../../shared/utils/getImageUrl";

function ServiceCard({
  service,
  index,
  darkMode,
  onEdit,
  onDelete,
  onToggle,
}: {
  service: AdminService;
  index: number;
  darkMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const imageUrl = getImageUrl(service.image);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className={`relative rounded-2xl border overflow-hidden ${
        darkMode
          ? "bg-white/[0.03] border-white/10"
          : "bg-white border-slate-200"
      } ${!service.is_active ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center">
            <ImageIcon
              size={32}
              className={darkMode ? "text-white/20" : "text-slate-300"}
            />
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              service.is_active
                ? "bg-green-500/90 text-white"
                : "bg-gray-500/90 text-white"
            }`}
          >
            {service.is_active ? "فعال" : "غیرفعال"}
          </span>
        </div>
      </div>

      <div className="relative p-5">
        <h3 className="font-black text-base mb-2">{service.name}</h3>

        {service.description && (
          <p
            className={`text-xs line-clamp-2 mb-3 ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            {service.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs mb-3">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} className="text-brand-500" />
            {service.duration_minutes} دقیقه
          </span>
          <span className="inline-flex items-center gap-1">
            <DollarSign size={12} className="text-accent-500" />
            {new Intl.NumberFormat("fa-IR").format(service.price)}
          </span>
        </div>

        {service.specialists_count !== undefined && (
          <p
            className={`text-[10px] mb-3 ${
              darkMode ? "text-white/40" : "text-slate-400"
            }`}
          >
            {service.specialists_count} متخصص
          </p>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-dashed border-gray-300/30">
          <button
            onClick={onEdit}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border text-xs font-bold transition-colors ${
              darkMode
                ? "border-white/10 hover:bg-white/5"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Pencil size={12} />
            ویرایش
          </button>
          <button
            onClick={onToggle}
            className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-colors ${
              darkMode
                ? "border-white/10 hover:bg-white/5"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Power
              size={14}
              className={service.is_active ? "text-green-500" : "text-gray-400"}
            />
          </button>
          <button
            onClick={onDelete}
            className="w-9 h-9 rounded-lg border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminServices() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [includeInactive, setIncludeInactive] = useState(true);
  const [editing, setEditing] = useState<AdminService | "new" | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services", { search, includeInactive }],
    queryFn: () =>
      fetchAdminServices({
        search: search || undefined,
        includeInactive,
      }),
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  const handleDelete = async (s: AdminService) => {
    if (!window.confirm(`حذف خدمت «${s.name}»؟`)) return;
    try {
      await deleteService(s.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    } catch (e: any) {
      const msg = e?.response?.data?.message;
      if (msg && msg.includes("اجباری")) {
        if (window.confirm(`${msg}\n\nحذف اجباری انجام شود؟`)) {
          try {
            await deleteService(s.id, true);
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
          } catch (e2: any) {
            alert(e2?.response?.data?.message ?? "خطا");
          }
        }
      } else {
        alert(msg ?? "خطا در حذف");
      }
    }
  };

  const handleToggle = async (s: AdminService) => {
    try {
      await toggleServiceActive(s.id);
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    } catch {
      alert("خطا");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-black mb-1">خدمات</h2>
          <p
            className={`text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            مدیریت لیست خدمات کلینیک
          </p>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90"
        >
          <Plus size={16} />
          خدمت جدید
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
            placeholder="جستجوی خدمت..."
            className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
              darkMode
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                : "bg-white border-slate-200 focus:border-brand-500"
            }`}
          />
        </div>
        <label
          className={`inline-flex items-center gap-2 h-11 px-4 rounded-xl border cursor-pointer text-sm font-bold ${
            darkMode
              ? "bg-white/5 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="accent-brand-500"
          />
          نمایش غیرفعال‌ها
        </label>
      </div>

      {isLoading && services.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-72 rounded-2xl animate-pulse ${
                darkMode ? "bg-white/5" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div
          className={`rounded-2xl p-12 text-center border ${
            darkMode
              ? "bg-white/[0.03] border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          <p className={darkMode ? "text-white/50" : "text-slate-500"}>
            خدمتی وجود ندارد
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {services.map((s, i) => (
              <ServiceCard
                key={s.id}
                service={s}
                index={i}
                darkMode={darkMode}
                onEdit={() => setEditing(s)}
                onDelete={() => handleDelete(s)}
                onToggle={() => handleToggle(s)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {editing && (
        <ServiceFormModal
          service={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSuccess={() => {
            setEditing(null);
            queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
          }}
        />
      )}
    </div>
  );
}