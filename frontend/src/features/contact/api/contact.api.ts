import axiosInstance from "../../../shared/api/axiosInstance";

export enum ContactSubject {
  General = "general",
  Complaint = "complaint",
  Suggestion = "suggestion",
  Booking = "booking",
  Other = "other",
}

export enum TicketStatus {
  Open = "open",
  InProgress = "in_progress",
  Resolved = "resolved",
  Closed = "closed",
}

export enum ReplySenderType {
  User = "user",
  Admin = "admin",
}

export interface ContactReply {
  id: number;
  contact_id: number;
  sender_type: ReplySenderType;
  sender_id: number | null;
  message: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  user_id: number | null;
  full_name: string;
  phone: string;
  subject: ContactSubject;
  message: string;
  status: TicketStatus;
  is_read: boolean;
  last_reply_at: string | null;
  replies: ContactReply[];
  created_at: string;
  updated_at: string;
}

export interface ContactListResponse {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  unread_count: number;
  open_count: number;
}

export interface CreateContactPayload {
  full_name?: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export const SUBJECT_LABELS: Record<ContactSubject, string> = {
  [ContactSubject.General]: "سوال عمومی",
  [ContactSubject.Complaint]: "شکایت",
  [ContactSubject.Suggestion]: "پیشنهاد",
  [ContactSubject.Booking]: "درباره رزرو",
  [ContactSubject.Other]: "سایر",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: "باز",
  [TicketStatus.InProgress]: "در حال بررسی",
  [TicketStatus.Resolved]: "پاسخ داده شد",
  [TicketStatus.Closed]: "بسته شده",
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.Open]: "bg-blue-500/15 text-blue-500",
  [TicketStatus.InProgress]: "bg-amber-500/15 text-amber-500",
  [TicketStatus.Resolved]: "bg-green-500/15 text-green-500",
  [TicketStatus.Closed]: "bg-gray-500/15 text-gray-500",
};

export const SUBJECT_OPTIONS = [
  { value: ContactSubject.General, label: "سوال عمومی" },
  { value: ContactSubject.Booking, label: "درباره رزرو" },
  { value: ContactSubject.Suggestion, label: "پیشنهاد" },
  { value: ContactSubject.Complaint, label: "شکایت" },
  { value: ContactSubject.Other, label: "سایر" },
];

export async function createContactMessage(
  payload: CreateContactPayload,
): Promise<{ id: number; message: string }> {
  const { data } = await axiosInstance.post("/contact", payload);
  return data;
}

export async function createPublicContactMessage(
  payload: CreateContactPayload & { full_name: string; phone: string },
): Promise<{ id: number; message: string }> {
  const { data } = await axiosInstance.post("/contact/public", payload);
  return data;
}

export async function fetchMyTickets(): Promise<ContactMessage[]> {
  const { data } = await axiosInstance.get("/contact/my");
  return data;
}

export async function fetchMyTicket(id: number): Promise<ContactMessage> {
  const { data } = await axiosInstance.get(`/contact/my/${id}`);
  return data;
}

export async function addTicketReply(
  ticketId: number,
  message: string,
): Promise<ContactReply> {
  const { data } = await axiosInstance.post(
    `/contact/${ticketId}/reply`,
    { message },
  );
  return data;
}

export async function fetchContactMessages(params: {
  unread_only?: boolean;
  status?: TicketStatus;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ContactListResponse> {
  const { data } = await axiosInstance.get("/contact", {
    params: {
      ...params,
      unread_only: params.unread_only ? "true" : undefined,
    },
  });
  return data;
}

export async function fetchContactMessage(id: number): Promise<ContactMessage> {
  const { data } = await axiosInstance.get(`/contact/${id}`);
  return data;
}

export async function updateContactStatus(
  id: number,
  status: TicketStatus,
): Promise<ContactMessage> {
  const { data } = await axiosInstance.patch(`/contact/${id}`, { status });
  return data;
}

export async function markContactRead(id: number): Promise<ContactMessage> {
  const { data } = await axiosInstance.patch(`/contact/${id}/read`);
  return data;
}

export async function deleteContactMessage(
  id: number,
): Promise<{ message: string; id: number }> {
  const { data } = await axiosInstance.delete(`/contact/${id}`);
  return data;
}