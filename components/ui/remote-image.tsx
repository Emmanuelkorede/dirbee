import type { ComponentProps } from "react";

// A plain <img> on purpose: Cloudinary and Wistia resize images from the URL,
export function RemoteImage({
  alt,
  loading = "lazy",
  ...props
}: ComponentProps<"img"> & { alt: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading={loading} decoding="async" {...props} />;
}