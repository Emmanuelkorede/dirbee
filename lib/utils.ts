import { clsx , type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export default function cn(...inputs : ClassValue[]) : string {
    return twMerge(clsx(inputs))
}


export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^\w\s-]/g, "") 
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, ""); 
}
