/**
 * Ensures delivery URLs include automatic format/quality optimization.
 * Works for standard Cloudinary URLs: .../image/upload/<version>/...
 */
export function toOptimizedCloudinaryUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.includes("res.cloudinary.com")) return trimmed;
  if (!trimmed.includes("/upload/")) return trimmed;
  if (/\/upload\/[^/]*f_auto/.test(trimmed)) return trimmed;

  return trimmed.replace("/upload/", "/upload/f_auto,q_auto/");
}
