export type AppTheme = 'system' | 'light' | 'dark';
export type AppLanguage = 'en' | 'bn';

export type ColorPalette = 
  | 'nordic-indigo'
  | 'emerald-sage'
  | 'sunset-amber'
  | 'royal-violet'
  | 'ocean-teal'
  | 'crimson-berry'
  | 'midnight-slate';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
}

export type ItemCategory = 
  | 'vegetables'
  | 'fruits'
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'bakery'
  | 'pantry'
  | 'spices'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'personal'
  | 'other';

export interface ListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice?: number;
  actualPrice?: number;
  category: ItemCategory;
  checked: boolean;
  notes?: string;
}

export interface BazarList {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  reminderTime: string; // e.g. "10:00 AM"
  status: 'active' | 'completed' | 'archived';
  mode: 'solo' | 'shared';
  budget?: number;
  items: ListItem[];
  createdAt: number;
  completedAt?: number;
  actualTotalSpent?: number;
  color?: string;
  tags?: string[];
}

export interface ShoppingHistoryRecord {
  id: string;
  listId: string;
  listName: string;
  date: string;
  totalSpent: number;
  itemCount: number;
  items: ListItem[];
  completedAt: number;
  mode: 'solo' | 'shared';
}

export interface AppSettings {
  language: AppLanguage;
  appearance: AppTheme;
  colorPalette: ColorPalette;
  currency: string;
  hapticFeedback: boolean;
  notifications: boolean;
  nightReminder: boolean;
  nightReminderTime: string;
  autoSync: boolean;
  soundEffects: boolean;
}

export interface TemplateItem {
  id: string;
  name: string;
  category: ItemCategory;
  defaultQty: number;
  unit: string;
}

export interface QuickStartTemplate {
  id: string;
  titleKey: string;
  title: string;
  iconName: string;
  bgTint: string;
  iconColor: string;
  items: Array<{ name: string; category: ItemCategory; quantity: number; unit: string; estimatedPrice?: number }>;
}
