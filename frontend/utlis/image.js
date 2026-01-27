// utils/image.js
export const getImageUrl = (path) => {
  if (!path) return "";

  // already absolute
  if (path.startsWith("http")) return path;

  // already root-relative
  if (path.startsWith("/")) return path;

  // fallback: prepend base url
  return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${path}`;
};