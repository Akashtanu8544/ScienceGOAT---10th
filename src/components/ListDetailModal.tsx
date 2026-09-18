import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Circle, 
  CheckCircle2, 
  Share2, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  DollarSign, 
  CheckCheck,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AppLanguage, AppSettings, BazarList, ItemCategory, ListItem } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { CategoryIcon } from './CategoryIcon';
import { COMMON_SUGGESTED_ITEMS, FODDOStorage } from '../utils/storage';

interface ListDetailModalProps {
  list: BazarList | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateList: (updatedList: BazarList) => void;
  onCompleteTrip: (list: BazarList, actualTotal: number) => void;
  onDeleteList: (listId: string) => void;
  onReschedule: (list: BazarList) => void;
  settings: AppSettings;
  theme: ThemeConfig;
  currencySymbol: string;
}

export const ListDetailModal: React.FC<ListDetailModalProps> = ({
  list,
  isOpen,
  onClose,
  onUpdateList,
  onCompleteTrip,
  onDeleteList,
  onReschedule,
  settings,
  theme,
  currencySymbol,
}) => {
  const lang = settings.language;
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('vegetables');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [actualSpentInput, setActualSpentInput] = useState('');
  const [copyNotice, setCopyNotice] = useState(false);

  if (!isOpen || !list) return null;

  const handleToggleItem = (itemId: string) => {
    FODDOStorage.triggerHaptic();
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onUpdateList({ ...list, items: updatedItems });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    FODDOStorage.triggerHaptic();
    const newItem: ListItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: newItemName.trim(),
      quantity: newItemQty,
      unit: newItemUnit,
      category: newItemCategory,
      checked: false,
      estimatedPrice: newItemPrice ? parseFloat(newItemPrice) : undefined,
    };

    onUpdateList({ ...list, items: [...list.items, newItem] });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty(1);
    setShowAddForm(false);
  };

  const handleAddSuggested = (sug: typeof COMMON_SUGGESTED_ITEMS[0]) => {
    FODDOStorage.triggerHaptic();
    const newItem: ListItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: sug.name,
      quantity: sug.defaultQty,
      unit: sug.unit,
      category: sug.category,
      checked: false,
      estimatedPrice: sug.price,
    };

    onUpdateList({ ...list, items: [...list.items, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    FODDOStorage.triggerHaptic();
    const updatedItems = list.items.filter((item) => item.id !== itemId);
    onUpdateList({ ...list, items: updatedItems });
  };

  const handleShareList = () => {
    FODDOStorage.triggerHaptic();
    const formatted = `🛒 FODDO: ${list.name} (${list.date})\n\n` +
      list.items.map((i) => `${i.checked ? '✅' : '⬜'} ${i.name} - ${i.quantity} ${i.unit}`).join('\n') +
      `\n\nTotal Items: ${list.items.length}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formatted);
      setCopyNotice(true);
      setTimeout(() => setCopyNotice(false), 2500);
    }
  };

  const checkedCount = list.items.filter((i) => i.checked).length;
  const estimatedTotal = list.items.reduce((acc, i) => acc + (i.estimatedPrice || 0), 0);

  const handleConfirmComplete = () => {
    FODDOStorage.triggerHaptic();
    const total = actualSpentInput ? parseFloat(actualSpentInput) : estimatedTotal;
    onCompleteTrip(list, total);
    setShowCompleteModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        id="modal-list-detail"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                {list.date} {list.reminderTime && `· ${list.reminderTime}`}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                {list.mode.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {list.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-share-list"
              type="button"
              onClick={handleShareList}
              aria-label="Share list"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors relative"
            >
              <Share2 className="w-4 h-4" />
              {copyNotice && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">
                  Copied!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress & Stat Header */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              Basket Progress
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {checkedCount} / {list.items.length} items in cart
            </span>
          </div>

          {estimatedTotal > 0 && (
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                {translate(lang, 'trip.estimated_total')}
              </span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {currencySymbol}{estimatedTotal}
              </span>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              showAddForm
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                : `${theme.primaryBg} text-white shadow-sm`
            }`}
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Close Add Form' : translate(lang, 'trip.add_item')}
          </button>

          <button
            type="button"
            onClick={() => onReschedule(list)}
            className="py-2.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-100"
          >
            <Calendar className="w-4 h-4" />
            Reschedule
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Delete this list?')) {
                onDeleteList(list.id);
                onClose();
              }
            }}
            className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 space-y-3 animate-fadeIn shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Add New Grocery Item
            </h3>

            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Item name (e.g. Potatoes, Milk, Dal)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoFocus
            />

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">QTY</label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">UNIT</label>
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="kg">kg</option>
                  <option value="gm">gm</option>
                  <option value="pcs">pcs</option>
                  <option value="pkt">pkt</option>
                  <option value="L">L</option>
                  <option value="ml">ml</option>
                  <option value="dozen">dozen</option>
                  <option value="bunch">bunch</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">EST. PRICE</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">CATEGORY</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="meat">Meat</option>
                <option value="fish">Fish</option>
                <option value="dairy">Dairy & Eggs</option>
                <option value="bakery">Bakery</option>
                <option value="pantry">Pantry & Grains</option>
                <option value="spices">Spices</option>
                <option value="beverages">Beverages</option>
                <option value="household">Household</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl ${theme.primaryBg} text-white font-bold text-xs shadow-sm`}
            >
              + Add to List
            </button>
          </form>
        )}

        {/* Quick Suggested Items to 1-Tap Add */}
        {list.items.length === 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Quick Suggestions (1-Tap Add):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {COMMON_SUGGESTED_ITEMS.slice(0, 8).map((sug) => (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() => handleAddSuggested(sug)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Plus className="w-3 h-3" />
                  {sug.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* List Items */}
        <div className="space-y-2">
          {list.items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                item.checked
                  ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700/80 shadow-xs'
              }`}
            >
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer select-none"
                onClick={() => handleToggleItem(item.id)}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  item.checked
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                }`}>
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <CategoryIcon category={item.category} size="sm" />

                <div>
                  <h4 className={`text-sm font-bold ${
                    item.checked 
                      ? 'line-through text-slate-400 dark:text-slate-500' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.quantity} {item.unit}
                    {item.estimatedPrice ? ` · ${currencySymbol}${item.estimatedPrice}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Finish Shopping Button */}
        {list.items.length > 0 && (
          <div className="pt-2">
            <button
              id="btn-finish-shopping-trip"
              type="button"
              onClick={() => {
                setActualSpentInput(estimatedTotal > 0 ? String(estimatedTotal) : '');
                setShowCompleteModal(true);
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <CheckCheck className="w-5 h-5" />
              {translate(lang, 'trip.finish_trip')}
            </button>
          </div>
        )}

        {/* Complete Shopping Trip Confirmation Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 p-4 animate-fadeIn">
            <div className="w-full max-w-sm bg-white dark:bg-slate-850 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCheck className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Trip Completed!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter actual total amount spent to record in your spending analytics.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Actual Total Spent ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={actualSpentInput}
                  onChange={(e) => setActualSpentInput(e.target.value)}
                  placeholder={`e.g. ${estimatedTotal || 250}`}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmComplete}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Save & Archive
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
