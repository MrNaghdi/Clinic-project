const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000";

export function getImageUrl(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }
  return `${API_BASE}/${path}`;
}