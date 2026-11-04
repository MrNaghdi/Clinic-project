import axiosInstance from "../../../shared/api/axiosInstance";

export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    appointment_id: number;
    specialist_id: number;
    service_id: number | null;
    user?: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      profile_image: string | null;
    };
    specialist?: {
      id: number;
      user_id: number;
      user: {
        first_name: string | null;
        last_name: string | null;
        profile_image: string | null;
      } | null;
    } | null;
    service?: {
      id: number;
      name: string;
    } | null;
    created_at: string;
    updated_at: string;
  }

export interface MyReview {
    id: number;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    appointment_id: number;
    specialist_id: number;
    service_id: number | null;
    specialist_name: string;
    service_name: string | null;
    created_at: string;
}

export interface ReviewsListResponse {
    items: Review[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface ReviewStats {
    average: number;
    count: number;
}

export async function fetchReviews(params: {
    specialist_id?: number;
    service_id?: number;
    approved_only?: boolean;
    page?: number;
    limit?: number;
}): Promise<ReviewsListResponse> {
    const { data } = await axiosInstance.get("/reviews", {
        params: {
            ...params,
            approved_only: params.approved_only === false ? "false" : undefined,
        },
    });
    return data;
}

export async function fetchSpecialistStats(
    specialistId: number,
): Promise<ReviewStats> {
    const { data } = await axiosInstance.get(
        `/reviews/specialist/${specialistId}/stats`,
    );
    return data;
}

export async function fetchMyReviews(): Promise<MyReview[]> {
    const { data } = await axiosInstance.get("/reviews/my");
    return data;
}

export async function createReview(payload: {
    appointment_id: number;
    rating: number;
    comment?: string;
}) {
    const { data } = await axiosInstance.post("/reviews", payload);
    return data;
}

export async function updateReview(
    id: number,
    payload: { is_approved?: boolean; comment?: string },
) {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, payload);
    return data;
}

export async function deleteReview(id: number) {
    const { data } = await axiosInstance.delete(`/reviews/${id}`);
    return data;
}

export async function fetchReviewableAppointments() {
    const { data } = await axiosInstance.get("/appointments/my/reviewable");
    return data;
}

const SKIPPED_KEY = "skipped_reviews";

export function getSkippedReviewIds(): number[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(SKIPPED_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function skipReview(appointmentId: number): void {
    if (typeof window === "undefined") return;
    const current = getSkippedReviewIds();
    if (!current.includes(appointmentId)) {
        current.push(appointmentId);
        localStorage.setItem(SKIPPED_KEY, JSON.stringify(current));
    }
}

export function unskipReview(appointmentId: number): void {
    if (typeof window === "undefined") return;
    const current = getSkippedReviewIds().filter((id) => id !== appointmentId);
    localStorage.setItem(SKIPPED_KEY, JSON.stringify(current));
}
export async function updateMyReview(
    id: number,
    payload: { rating?: number; comment?: string },
) {
    const { data } = await axiosInstance.patch(`/reviews/my/${id}`, payload);
    return data;
}