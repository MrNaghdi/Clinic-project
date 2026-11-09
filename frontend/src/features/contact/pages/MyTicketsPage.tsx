import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronDown,
  Clock,
  CheckCircle2,
  MessageSquare,
  Loader2,
  Plus,
  Send,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../../shared/hook/useDarkMode";
import {
  fetchMyTickets,
  addTicketReply,
  STATUS_COLORS,
  STATUS_LABELS,
  SUBJECT_LABELS,
  TicketStatus,
  ReplySenderType,
} from "../api/contact.api";

export default function MyTicketsPage() {
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: fetchMyTickets,
    staleTime: 1 * 60 * 1000,
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) =>
      addTicketReply(id, message),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      setReplyText((prev) => ({ ...prev, [vars.id]: "" }));
    },
  });

  const handleSendReply = (ticketId: number) => {
    const text = replyText[ticketId]?.trim();
    if (!text) return;
    replyMutation.mutate({ id: ticketId, message: text });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-brand-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className={`text-2xl font-black mb-1 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            تیکت‌های من
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            پیگیری تیکت‌های پشتیبانی
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:opacity-90"
        >
          <Plus size={16} />
          تیکت جدید
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3
            className={`text-lg font-bold mb-2 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            تیکتی وجود ندارد
          </h3>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            برای شروع، از صفحه تماس با ما تیکت جدید ثبت کنید
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-bold text-sm"
          >
            <Plus size={16} />
            ثبت تیکت
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket, i) => {
            const isOpen = expandedId === ticket.id;
            const isClosed = ticket.status === TicketStatus.Closed;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-2xl border overflow-hidden ${
                  darkMode
                    ? "bg-white/[0.03] border-white/10"
                    : "bg-white border-slate-200"
                }`}
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : ticket.id)}
                  className={`w-full p-4 flex items-center gap-3 text-right transition-colors ${
                    darkMode ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ticket.status === TicketStatus.Resolved
                        ? "bg-green-500/15 text-green-500"
                        : ticket.status === TicketStatus.Closed
                          ? "bg-gray-500/15 text-gray-500"
                          : "bg-blue-500/15 text-blue-500"
                    }`}
                  >
                    {ticket.status === TicketStatus.Resolved ? (
                      <CheckCircle2 size={18} />
                    ) : isClosed ? (
                      <Lock size={18} />
                    ) : (
                      <MessageSquare size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p
                        className={`font-bold text-sm truncate ${
                          darkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {SUBJECT_LABELS[ticket.subject]}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          STATUS_COLORS[ticket.status]
                        }`}
                      >
                        {STATUS_LABELS[ticket.status]}
                      </span>
                      {ticket.replies?.length > 0 && (
                        <span
                          className={`text-[10px] ${
                            darkMode ? "text-white/40" : "text-slate-400"
                          }`}
                        >
                          {ticket.replies.length} پیام
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs truncate ${
                        darkMode ? "text-white/50" : "text-slate-500"
                      }`}
                    >
                      {ticket.message}
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
                      }).format(new Date(ticket.created_at))}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      } ${darkMode ? "text-white/40" : "text-slate-400"}`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`px-4 pb-4 pt-2 border-t ${
                          darkMode ? "border-white/5" : "border-slate-100"
                        }`}
                      >
                        <div className="space-y-3 mb-4">
                          <div
                            className={`p-3 rounded-xl ${
                              darkMode
                                ? "bg-white/5 border border-white/10"
                                : "bg-slate-50 border border-slate-200"
                            }`}
                          >
                            <p
                              className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${
                                darkMode
                                  ? "text-white/50"
                                  : "text-slate-500"
                              }`}
                            >
                              <MessageSquare size={10} />
                              پیام شما
                            </p>
                            <p
                              className={`text-sm leading-7 ${
                                darkMode
                                  ? "text-white/80"
                                  : "text-slate-700"
                              }`}
                            >
                              {ticket.message}
                            </p>
                          </div>

                          {ticket.replies?.map((reply) => {
                            const isAdmin =
                              reply.sender_type === ReplySenderType.Admin;
                            return (
                              <div
                                key={reply.id}
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
                                  {isAdmin ? "پشتیبانی" : "شما"}
                                  <span className="mr-auto font-normal opacity-70 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Intl.DateTimeFormat("fa-IR", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(new Date(reply.created_at))}
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
                                  {reply.message}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {!isClosed ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText[ticket.id] ?? ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSendReply(ticket.id);
                                }
                              }}
                              placeholder="پاسخ خود را بنویسید..."
                              className={`flex-1 h-10 px-3 rounded-lg border text-sm outline-none ${
                                darkMode
                                  ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-brand-500"
                                  : "bg-white border-slate-200 placeholder:text-slate-400 focus:border-brand-500"
                              }`}
                            />
                            <button
                              onClick={() => handleSendReply(ticket.id)}
                              disabled={
                                !replyText[ticket.id]?.trim() ||
                                replyMutation.isPending
                              }
                              className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center disabled:opacity-50"
                            >
                              {replyMutation.isPending ? (
                                <Loader2
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                <Send size={14} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`p-3 rounded-lg text-center text-xs ${
                              darkMode
                                ? "bg-white/5 text-white/50"
                                : "bg-slate-50 text-slate-500"
                            }`}
                          >
                            <Lock
                              size={12}
                              className="inline mr-1"
                            />
                            این تیکت بسته شده است
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}