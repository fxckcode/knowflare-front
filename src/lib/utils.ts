import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const base64ToImage = (base64: string) => {
  return `data:image/png;base64,${base64}`;
};

