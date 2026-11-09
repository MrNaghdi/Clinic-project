import axiosInstance from "../../../shared/api/axiosInstance";

export enum ArticleCategory {
    Skin = "skin",
    Hair = "hair",
    Beauty = "beauty",
    Laser = "laser",
    Tips = "tips",
    News = "news",
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    category: ArticleCategory;
    tags: string[] | null;
    is_published: boolean;
    is_featured: boolean;
    published_at: string | null;
    views: number;
    read_time: number;
    created_at: string;
    updated_at: string;
}

export interface ArticlesListResponse {
    items: Article[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface CreateArticlePayload {
    title: string;
    slug?: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    category: ArticleCategory;
    tags?: string[];
    is_featured?: boolean;
    read_time?: number;
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
    [ArticleCategory.Skin]: "پوست",
    [ArticleCategory.Hair]: "مو",
    [ArticleCategory.Beauty]: "زیبایی",
    [ArticleCategory.Laser]: "لیزر",
    [ArticleCategory.Tips]: "نکات",
    [ArticleCategory.News]: "اخبار",
};

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
    [ArticleCategory.Skin]: "from-rose-500 to-pink-500",
    [ArticleCategory.Hair]: "from-amber-500 to-orange-500",
    [ArticleCategory.Beauty]: "from-purple-500 to-pink-500",
    [ArticleCategory.Laser]: "from-cyan-500 to-blue-500",
    [ArticleCategory.Tips]: "from-green-500 to-emerald-500",
    [ArticleCategory.News]: "from-indigo-500 to-purple-500",
};

export const CATEGORY_OPTIONS = [
    { value: ArticleCategory.Skin, label: "پوست" },
    { value: ArticleCategory.Hair, label: "مو" },
    { value: ArticleCategory.Beauty, label: "زیبایی" },
    { value: ArticleCategory.Laser, label: "لیزر" },
    { value: ArticleCategory.Tips, label: "نکات" },
    { value: ArticleCategory.News, label: "اخبار" },
];

export async function fetchArticles(params: {
    search?: string;
    category?: ArticleCategory;
    tag?: string;
    published_only?: boolean;
    featured_only?: boolean;
    page?: number;
    limit?: number;
}): Promise<ArticlesListResponse> {
    const { data } = await axiosInstance.get("/articles", {
        params: {
            ...params,
            published_only: params.published_only === false ? "false" : undefined,
            featured_only: params.featured_only ? "true" : undefined,
        },
    });
    return data;
}

export async function fetchArticleBySlug(slug: string): Promise<Article> {
    const { data } = await axiosInstance.get(`/articles/slug/${slug}`);
    return data;
}

export async function fetchArticleById(id: number): Promise<Article> {
    const { data } = await axiosInstance.get(`/articles/${id}`);
    return data;
}

export async function incrementArticleViews(id: number): Promise<void> {
    await axiosInstance.post(`/articles/${id}/view`);
}

export async function createArticle(
    payload: CreateArticlePayload,
): Promise<Article> {
    const { data } = await axiosInstance.post("/articles", payload);
    return data;
}

export async function updateArticle(
    id: number,
    payload: Partial<CreateArticlePayload>,
): Promise<Article> {
    const { data } = await axiosInstance.patch(`/articles/${id}`, payload);
    return data;
}

export async function uploadArticleCover(
    id: number,
    file: File,
): Promise<Article> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post(
        `/articles/${id}/cover`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
}

export async function deleteArticle(id: number): Promise<void> {
    await axiosInstance.delete(`/articles/${id}`);
}