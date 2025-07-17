import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
}

export function formatBalance(balance: string): string {
  return parseFloat(balance).toFixed(2);
}

export function getAPYForDuration(duration: number): number {
  const rates: { [key: number]: number } = {
    30: 2.0,
    90: 4.0,
    180: 6.0,
    360: 8.0
  };
  return rates[duration] || 2.0;
}

export function calculateEndDate(durationDays: number): Date {
  const now = new Date();
  now.setDate(now.getDate() + durationDays);
  return now;
}

export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}