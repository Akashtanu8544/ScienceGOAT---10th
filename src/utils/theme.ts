import { ColorPalette, CurrencyConfig } from '../types/foddo';

export interface ThemeConfig {
  id: ColorPalette;
  name: string;
  dotColor1: string;
  dotColor2: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
}

export const COLOR_PALETTES: Record<ColorPalette, ThemeConfig> = {
  'nordic-indigo': {
    id: 'nordic-indigo',
    name: 'Nordic Indigo',
    dotColor1: '#2563eb',
    dotColor2: '#06b6d4',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    accentBorder: 'border-blue-200 dark:border-blue-800',
    accentText: 'text-blue-700 dark:text-blue-300',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/50',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  'emerald-sage': {
    id: 'emerald-sage',
    name: 'Emerald Sage',
    dotColor1: '#059669',
    dotColor2: '#f59e0b',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryText: 'text-emerald-600',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accentBorder: 'border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  'sunset-amber': {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    dotColor1: '#ea580c',
    dotColor2: '#eab308',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    primaryText: 'text-amber-600',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    accentBorder: 'border-amber-200 dark:border-amber-800',
    accentText: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/50',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
  'royal-violet': {
    id: 'royal-violet',
    name: 'Royal Violet',
    dotColor1: '#7c3aed',
    dotColor2: '#ec4899',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    accentBorder: 'border-purple-200 dark:border-purple-800',
    accentText: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/50',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  'ocean-teal': {
    id: 'ocean-teal',
    name: 'Ocean Teal',
    dotColor1: '#0d9488',
    dotColor2: '#0284c7',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600',
    accentBg: 'bg-teal-50 dark:bg-teal-950/40',
    accentBorder: 'border-teal-200 dark:border-teal-800',
    accentText: 'text-teal-700 dark:text-teal-300',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/50',
    badgeText: 'text-teal-700 dark:text-teal-300',
  },
  'crimson-berry': {
    id: 'crimson-berry',
    name: 'Crimson Berry',
    dotColor1: '#e11d48',
    dotColor2: '#f43f5e',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryText: 'text-rose-600',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    accentBorder: 'border-rose-200 dark:border-rose-800',
    accentText: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/50',
    badgeText: 'text-rose-700 dark:text-rose-300',
  },
  'midnight-slate': {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    dotColor1: '#334155',
    dotColor2: '#64748b',
    primaryBg: 'bg-slate-800',
    primaryHover: 'hover:bg-slate-900',
    primaryText: 'text-slate-800 dark:text-slate-200',
    accentBg: 'bg-slate-100 dark:bg-slate-800',
    accentBorder: 'border-slate-300 dark:border-slate-700',
    accentText: 'text-slate-800 dark:text-slate-200',
    badgeBg: 'bg-slate-200 dark:bg-slate-700',
    badgeText: 'text-slate-800 dark:text-slate-200',
  },
};

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'BDT', symbol: '৳', label: 'BDT (৳)' },
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];
