// Cloudinary builds resized copies on the fly when a transformation is added
export function cloudinaryImage(url: string, width: number) {
  return url.replace("/upload/", `/upload/c_limit,w_${width},q_auto,f_auto/`);
}