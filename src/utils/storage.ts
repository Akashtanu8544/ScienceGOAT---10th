import { AppSettings, BazarList, QuickStartTemplate, ShoppingHistoryRecord, ListItem, ItemCategory } from '../types/foddo';

export const DEFAULT_TEMPLATES: QuickStartTemplate[] = [
  {
    id: 'weekly_grocery',
    titleKey: 'template.weekly_grocery',
    title: 'Weekly Grocery',
    iconName: 'ShoppingBag',
    bgTint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    items: [
      { name: 'Rice / Basmati', category: 'pantry', quantity: 5, unit: 'kg', estimatedPrice: 350 },
      { name: 'Cooking Oil', category: 'pantry', quantity: 2, unit: 'L', estimatedPrice: 280 },
      { name: 'Onions', category: 'vegetables', quantity: 2, unit: 'kg', estimatedPrice: 70 },
      { name: 'Potatoes', category: 'vegetables', quantity: 3, unit: 'kg', estimatedPrice: 90 },
      { name: 'Fresh Milk', category: 'dairy', quantity: 2, unit: 'L', estimatedPrice: 120 },
      { name: 'Farm Fresh Eggs', category: 'dairy', quantity: 12, unit: 'pcs', estimatedPrice: 90 },
      { name: 'Yellow Lentils (Dal)', category: 'pantry', quantity: 1, unit: 'kg', estimatedPrice: 140 },
    ],
  },
  {
    id: 'veg_fruits',
    titleKey: 'template.veg_fruits',
    title: 'Veg & Fruits',
    iconName: 'Salad',
    bgTint: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400 border-green-200 dark:border-green-800/60',
    iconColor: 'text-green-600 dark:text-green-400',
    items: [
      { name: 'Red Tomatoes', category: 'vegetables', quantity: 1, unit: 'kg', estimatedPrice: 40 },
      { name: 'Spinach / Greens', category: 'vegetables', quantity: 2, unit: 'bunch', estimatedPrice: 30 },
      { name: 'Green Chillies & Coriander', category: 'vegetables', quantity: 1, unit: 'pkt', estimatedPrice: 20 },
      { name: 'Fresh Bananas', category: 'fruits', quantity: 1, unit: 'dozen', estimatedPrice: 60 },
      { name: 'Crisp Apples', category: 'fruits', quantity: 1, unit: 'kg', estimatedPrice: 160 },
      { name: 'Cucumbers', category: 'vegetables', quantity: 1, unit: 'kg', estimatedPrice: 40 },
    ],
  },
  {
    id: 'meat_fish',
    titleKey: 'template.meat_fish',
    title: 'Meat & Fish',
    iconName: 'Beef',
    bgTint: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    iconColor: 'text-rose-600 dark:text-rose-400',
    items: [
      { name: 'Fresh Chicken Curry Cut', category: 'meat', quantity: 1, unit: 'kg', estimatedPrice: 240 },
      { name: 'Fresh Water Fish', category: 'fish', quantity: 1, unit: 'kg', estimatedPrice: 320 },
      { name: 'Brown / Country Eggs', category: 'dairy', quantity: 1, unit: 'dozen', estimatedPrice: 110 },
    ],
  },
  {
    id: 'daily_essentials',
    titleKey: 'template.daily_essentials',
    title: 'Daily Essentials',
    iconName: 'Milk',
    bgTint: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    iconColor: 'text-blue-600 dark:text-blue-400',
    items: [
      { name: 'Milk Carton', category: 'dairy', quantity: 1, unit: 'L', estimatedPrice: 60 },
      { name: 'Whole Wheat Bread', category: 'bakery', quantity: 1, unit: 'pkt', estimatedPrice: 45 },
      { name: 'Salted Butter', category: 'dairy', quantity: 1, unit: 'pkt', estimatedPrice: 58 },
      { name: 'Fresh Curd / Yogurt', category: 'dairy', quantity: 500, unit: 'gm', estimatedPrice: 40 },
    ],
  },
  {
    id: 'spices_pantry',
    titleKey: 'template.spices_pantry',
    title: 'Spices & Pantry',
    iconName: 'Package',
    bgTint: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    iconColor: 'text-amber-600 dark:text-amber-400',
    items: [
      { name: 'Turmeric Powder', category: 'spices', quantity: 200, unit: 'gm', estimatedPrice: 45 },
      { name: 'Cumin Seeds (Jeera)', category: 'spices', quantity: 100, unit: 'gm', estimatedPrice: 60 },
      { name: 'Garlic & Ginger', category: 'vegetables', quantity: 500, unit: 'gm', estimatedPrice: 80 },
      { name: 'Table Salt & Sugar', category: 'pantry', quantity: 2, unit: 'kg', estimatedPrice: 90 },
    ],
  },
];

export const COMMON_SUGGESTED_ITEMS = [
  { name: 'Potatoes (আলু)', category: 'vegetables' as ItemCategory, unit: 'kg', defaultQty: 2, price: 60 },
  { name: 'Onions (পেঁয়াজ)', category: 'vegetables' as ItemCategory, unit: 'kg', defaultQty: 2, price: 70 },
  { name: 'Tomatoes (টমেটো)', category: 'vegetables' as ItemCategory, unit: 'kg', defaultQty: 1, price: 40 },
  { name: 'Fresh Milk (দুধ)', category: 'dairy' as ItemCategory, unit: 'L', defaultQty: 1, price: 60 },
  { name: 'Eggs (ডিম)', category: 'dairy' as ItemCategory, unit: 'pcs', defaultQty: 12, price: 90 },
  { name: 'Basmati / Miniket Rice (চাল)', category: 'pantry' as ItemCategory, unit: 'kg', defaultQty: 5, price: 320 },
  { name: 'Mustard / Soybean Oil (তেল)', category: 'pantry' as ItemCategory, unit: 'L', defaultQty: 2, price: 280 },
  { name: 'Chicken (মুরগির মাংস)', category: 'meat' as ItemCategory, unit: 'kg', defaultQty: 1, price: 240 },
  { name: 'Fish (মাছ)', category: 'fish' as ItemCategory, unit: 'kg', defaultQty: 1, price: 300 },
  { name: 'Green Chillies (কাঁচামরিচ)', category: 'vegetables' as ItemCategory, unit: 'gm', defaultQty: 250, price: 30 },
  { name: 'Bananas (কলা)', category: 'fruits' as ItemCategory, unit: 'dozen', defaultQty: 1, price: 60 },
  { name: 'Bread (পাউরুটি)', category: 'bakery' as ItemCategory, unit: 'pkt', defaultQty: 1, price: 45 },
  { name: 'Garlic & Ginger (রসুন ও আদা)', category: 'vegetables' as ItemCategory, unit: 'gm', defaultQty: 500, price: 80 },
  { name: 'Red Lentils / Dal (মসুর ডাল)', category: 'pantry' as ItemCategory, unit: 'kg', defaultQty: 1, price: 130 },
  { name: 'Tea / Chai Patti (চা পাতা)', category: 'beverages' as ItemCategory, unit: 'pkt', defaultQty: 1, price: 120 },
  { name: 'Dish Soap / Detergent', category: 'household' as ItemCategory, unit: 'pcs', defaultQty: 1, price: 65 },
];

const STORAGE_KEYS = {
  SETTINGS: 'foddo_settings_v2',
  LISTS: 'foddo_lists_v2',
  HISTORY: 'foddo_history_v2',
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  appearance: 'light',
  colorPalette: 'nordic-indigo',
  currency: 'INR',
  hapticFeedback: true,
  notifications: true,
  nightReminder: true,
  nightReminderTime: '9:00 PM',
  autoSync: true,
  soundEffects: false,
};

// Seed initial lists matching the screenshot: Veg & Fruits and Weekly Grocery (Overdue)
export const SEED_LISTS: BazarList[] = [
  {
    id: 'list-veg-fruits',
    name: 'Veg & Fruits',
    date: '2026-08-29',
    reminderTime: '10:00 AM',
    status: 'active',
    mode: 'solo',
    budget: 350,
    createdAt: Date.now() - 172800000,
    items: [
      { id: 'i1', name: 'Fresh Tomatoes', quantity: 1, unit: 'kg', category: 'vegetables', checked: false, estimatedPrice: 40 },
      { id: 'i2', name: 'Spinach / Palak', quantity: 2, unit: 'bunch', category: 'vegetables', checked: false, estimatedPrice: 30 },
      { id: 'i3', name: 'Green Chillies & Coriander', quantity: 250, unit: 'gm', category: 'vegetables', checked: false, estimatedPrice: 25 },
      { id: 'i4', name: 'Bananas', quantity: 1, unit: 'dozen', category: 'fruits', checked: false, estimatedPrice: 60 },
    ],
  },
  {
    id: 'list-weekly-grocery',
    name: 'Weekly Grocery',
    date: '2026-08-29',
    reminderTime: '12:00 PM',
    status: 'active',
    mode: 'solo',
    budget: 1200,
    createdAt: Date.now() - 172800000,
    items: [
      { id: 'i5', name: 'Basmati Rice', quantity: 5, unit: 'kg', category: 'pantry', checked: false, estimatedPrice: 350 },
      { id: 'i6', name: 'Cooking Sunflower Oil', quantity: 2, unit: 'L', category: 'pantry', checked: false, estimatedPrice: 280 },
      { id: 'i7', name: 'Farm Fresh Milk', quantity: 2, unit: 'L', category: 'dairy', checked: false, estimatedPrice: 120 },
      { id: 'i8', name: 'Fresh Eggs', quantity: 12, unit: 'pcs', category: 'dairy', checked: false, estimatedPrice: 90 },
      { id: 'i9', name: 'Red Onions', quantity: 2, unit: 'kg', category: 'vegetables', checked: false, estimatedPrice: 70 },
      { id: 'i10', name: 'Potatoes', quantity: 3, unit: 'kg', category: 'vegetables', checked: false, estimatedPrice: 90 },
    ],
  },
];

export const FODDOStorage = {
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getLists(): BazarList[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with seed data on first run
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(SEED_LISTS));
      return SEED_LISTS;
    } catch {
      return SEED_LISTS;
    }
  },

  saveLists(lists: BazarList[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    } catch (e) {
      console.error('Failed to save lists:', e);
    }
  },

  getHistory(): ShoppingHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(history: ShoppingHistoryRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  },

  addHistoryRecord(record: ShoppingHistoryRecord): void {
    const history = this.getHistory();
    const updated = [record, ...history];
    this.saveHistory(updated);
  },

  clearShoppingData(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    } catch (e) {
      console.error('Clear shopping data error:', e);
    }
  },

  resetAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.LISTS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Reset data error:', e);
    }
  },

  triggerHaptic(): void {
    const settings = this.getSettings();
    if (settings.hapticFeedback && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore vibrate errors if blocked
      }
    }
  },
};
