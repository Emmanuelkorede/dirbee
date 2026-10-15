export const siteConfig = {
  name: "House of Bee",
  // Placeholder copy: replace with Bee's wording.
  description:
    "A creative production house for music visuals, artist content and cinematic storytelling.",
  email: "officialdirectorbee@gmail.com",
  instagramUrl:
    "https://www.instagram.com/directorbee_?igsh=MTA0bXp5czl2aGxjaQ%3D%3D&utm_source=qr",
  tiktokUrl: "https://www.tiktok.com/@directorbee_?_r=1&_t=ZS-968V6WxDdPW",
} as const;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Meet the Director", href: "/director" },
  { label: "About House of Bee", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;