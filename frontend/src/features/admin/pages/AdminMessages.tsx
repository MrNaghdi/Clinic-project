import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Mail,
  MailOpen,
  CheckCircle2,
  Send,
  Loader2,
  X,
  Search,
  Trash2,
  Lock,
  Unlock,
  Clock,
} from "lucide-react";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import { CustomSelect } from "../../../shared/components/ui/CustomSelect";
import {
  fetchContactMessages,
  addTicketReply,
  markContactRead,
  deleteContactMessage,
  updateContactStatus,
  STATUS_COLORS,
  STATUS_LABELS,
  SUBJECT_LABELS,
  TicketStatus,
  ReplySenderType,
  type ContactMessage,
} from "../../contact/api/contact.api";

const STATUS_OPTIONS = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: TicketStatus.Open, label: "باز" },
  { value: TicketStatus.InProgress, label: "در حال بررسی" },
  { value: TicketStatus.Resolved, label: "پاسخ داده شد" },
  { value: TicketStatus.Closed, label: "بسته شده" },
];

export default function AdminMessages() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedTicket, setSelectedTicket] =
    useState<ContactMessage | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages", { search, statusFilter, page }],
    queryFn: () =>
      fetchContactMessages({
        search: search || undefined,
        status:
          statusFilter !== "all"
            ? (statusFilter as TicketStatus)
            : undefined,
        page,
        limit: 15,
      }),
    staleTime: 1 * 60 * 1000,
  });

  const items = data?.items ?? [];
  const pages = data?.pages ?? 1;

  const readMutation = useMutation({
    mutationFn: markContactRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TicketStatus }) =>
      updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
    },
  });

  const handleDelete = (id: number) => {
    if (!window.confirm("این تیکت حذف شود؟")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2
          className={`text-xl sm:text-2xl font-black mb-1 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          تیکت‌های پشتیبانی
        </h2>
        <p
          className={`text-xs sm:text-sm ${
            darkMode ? "text-white/50" : "text-slate-500"
          }`}
        >
          {data?.open_count
            ? `${data.open_count} تیکت باز در انتظار پاسخ`
            : "همه تیکت‌ها"}
        </p>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="جستجو در تیکت‌ها..."
            className={`w-full h-11 pr-10 pl-4 rounded-xl border text-sm outline-none ${
              darkMode
                ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
            }`}
          />
        </div>

        <CustomSelect
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={STATUS_OPTIONS}
          className="sm:w-48"
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
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-20 rounded-lg animate-pulse ${
                  darkMode ? "bg-white/5" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare
              size={40}
              className={`mx-auto mb-3 ${
                darkMode ? "text-white/20" : "text-slate-300"
              }`}
            />
            <p
              className={`text-sm ${
                darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              تیکتی یافت نشد
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200/50 dark:divide-white/5">
            {items.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`p-4 transition-colors ${
                  darkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50/50"
                } ${!msg.is_read ? "bg-brand-500/[0.03]" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.status === TicketStatus.Resolved
                        ? "bg-green-500/15 text-green-500"
                        : msg.status === TicketStatus.Closed
                          ? "bg-gray-500/15 text-gray-500"
                          : "bg-blue-500/15 text-blue-500"
                    }`}
                  >
                    {msg.is_read ? (
                      <MailOpen size={18} />
                    ) : (
                      <Mail size={18} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p
                        className={`font-bold text-sm ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {msg.full_name}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          STATUS_COLORS[msg.status]
                        }`}
                      >
                        {STATUS_LABELS[msg.status]}
                      </span>
                      {!msg.is_read && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500 text-white">
                          جدید
                        </span>
                      )}
                      {msg.replies?.length > 0 && (
                        <span
                          className={`text-[10px] ${
                            darkMode ? "text-white/40" : "text-slate-400"
                          }`}
                        >
                          {msg.replies.length} پیام
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mb-1 ${
                        darkMode ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      {SUBJECT_LABELS[msg.subject]} ·{" "}
                      <span dir="ltr" className="font-mono">
                        {msg.phone}
                      </span>
                    </p>
                    <p
                      className={`text-sm leading-7 line-clamp-2 ${
                        darkMode ? "text-white/70" : "text-slate-600"
                      }`}
                    >
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[10px] tabular-nums ${
                        darkMode ? "text-white/40" : "text-slate-400"
                      }`}
                    >
                      {new Intl.DateTimeFormat("fa-IR", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(msg.created_at))}
                    </span>
                    <div className="flex gap-1">
                      {!msg.is_read && (
                        <button
                          onClick={() => readMutation.mutate(msg.id)}
                          disabled={readMutation.isPending}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode
                              ? "hover:bg-white/10 text-white/60"
                              : "hover:bg-slate-100 text-slate-500"
                          }`}
                          title="خوانده شده"
                        >
                          <MailOpen size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedTicket(msg)}
                        className="inline-flex items-center gap-1 px-2.5 h-8 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold hover:opacity-90"
                      >
                        <Send size={12} />
                        پاسخ
                      </button>
                      {msg.status !== TicketStatus.Closed ? (
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: msg.id,
                              status: TicketStatus.Closed,
                            })
                          }
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode
                              ? "hover:bg-white/10 text-white/60"
                              : "hover:bg-slate-100 text-slate-500"
                          }`}
                          title="بستن تیکت"
                        >
                          <Lock size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              id: msg.id,
                              status: TicketStatus.Open,
                            })
                          }
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode
                              ? "hover:bg-white/10 text-green-400"
                              : "hover:bg-slate-100 text-green-500"
                          }`}
                          title="باز کردن تیکت"
                        >
                          <Unlock size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode
                            ? "hover:bg-red-500/10 text-red-400"
                            : "hover:bg-red-50 text-red-500"
                        }`}
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-1.5 flex-wrap">
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                page === i + 1
                  ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white"
                  : darkMode
                    ? "bg-white/5 text-white/60 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedTicket && (
        <AdminReplyModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSuccess={() => {
            setSelectedTicket(null);
            queryClient.invalidateQueries({
              queryKey: ["admin", "messages"],
            });
            queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
          }}
        />
      )}
    </div>
  );
}

function AdminReplyModal({
  ticket,
  onClose,
  onSuccess,
}: {
  ticket: ContactMessage;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { darkMode } = useDarkMode();
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localReplies, setLocalReplies] = useState(ticket.replies ?? []);

  const isClosed = ticket.status === TicketStatus.Closed;

  const handleSubmit = async () => {
    if (!reply.trim()) {
      setError("پاسخ را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const saved = await addTicketReply(ticket.id, reply.trim());
      setLocalReplies((prev) => [...prev, saved]);
      setReply("");
      onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "خطا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-2xl rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto ${
            darkMode ? "bg-[#0c0a14]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className={`text-lg font-black ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                پاسخ به تیکت
              </h3>
              <p
                className={`text-xs mt-0.5 ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                {ticket.full_name} —{" "}
                <span dir="ltr" className="font-mono">
                  {ticket.phone}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
              }`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            <div
              className={`p-3 rounded-xl ${
                darkMode
                  ? "bg-white/5 border border-white/10"
                  : "bg-slate-50 border border-slate-200"
              }`}
            >
              <p
                className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${
                  darkMode ? "text-white/50" : "text-slate-500"
                }`}
              >
                <MessageSquare size={10} />
                پیام کاربر
              </p>
              <p
                className={`text-sm leading-7 ${
                  darkMode ? "text-white/80" : "text-slate-700"
                }`}
              >
                {ticket.message}
              </p>
            </div>

            {localReplies.map((r) => {
              const isAdmin = r.sender_type === ReplySenderType.Admin;
              return (
                <div
                  key={r.id}
                  className={`p-3 rounded-xl ${
                    isAdmin
                      ? darkMode
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-green-50 border border-green-200"
                      : darkMode
                        ? "bg-brand-500/10 border border-brand-500/20"
                        : "bg-brand-50 border border-brand-200"
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${
                      isAdmin
                        ? darkMode
                          ? "text-green-400"
                          : "text-green-600"
                        : darkMode
                          ? "text-brand-400"
                          : "text-brand-600"
                    }`}
                  >
                    {isAdmin ? (
                      <CheckCircle2 size={10} />
                    ) : (
                      <MessageSquare size={10} />
                    )}
                    {isAdmin ? "شما (ادمین)" : "کاربر"}
                    <span className="mr-auto font-normal opacity-70 flex items-center gap-1">
                      <Clock size={10} />
                      {new Intl.DateTimeFormat("fa-IR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(r.created_at))}
                    </span>
                  </p>
                  <p
                    className={`text-sm leading-7 ${
                      isAdmin
                        ? darkMode
                          ? "text-green-200"
                          : "text-green-900"
                        : darkMode
                          ? "text-brand-200"
                          : "text-brand-900"
                    }`}
                  >
                    {r.message}
                  </p>
                </div>
              );
            })}
          </div>

          {!isClosed ? (
            <>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="پاسخ خود را بنویسید..."
                className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${
                  darkMode
                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    : "bg-white border-slate-200"
                }`}
              />

              {error && (
                <p className="text-xs text-red-500 font-bold mt-2">{error}</p>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || !reply.trim()}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  ارسال پاسخ
                </button>
                <button
                  onClick={onClose}
                  className={`px-6 h-11 rounded-xl border font-bold text-sm ${
                    darkMode
                      ? "border-white/10 hover:bg-white/5"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  بستن
                </button>
              </div>
            </>
          ) : (
            <div
              className={`p-3 rounded-xl text-center text-sm ${
                darkMode
                  ? "bg-white/5 text-white/50"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              <Lock size={14} className="inline mr-1" />
              این تیکت بسته شده. برای پاسخ، ابتدا آن را باز کنید.
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}