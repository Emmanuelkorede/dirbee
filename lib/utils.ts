import { clsx , type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs : ClassValue[]) : string {
    return twMerge(clsx(inputs))
}

export function generateSlug(name : string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}