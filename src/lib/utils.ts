import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateUserRole = (role: string): boolean => {
  return ["owner", "operator"].includes(role);
};