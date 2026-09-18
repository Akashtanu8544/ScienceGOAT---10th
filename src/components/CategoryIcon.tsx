import React from 'react';
import { 
  Carrot, 
  Apple, 
  Beef, 
  Fish, 
  Milk, 
  Package, 
  Flame, 
  Coffee, 
  Sparkles, 
  Home, 
  Tag, 
  ShoppingBag,
  Salad,
  CircleDot
} from 'lucide-react';
import { ItemCategory } from '../types/foddo';

interface CategoryIconProps {
  category: ItemCategory | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5 rounded-lg text-xs',
    md: 'w-9 h-9 p-2 rounded-xl text-sm',
    lg: 'w-12 h-12 p-2.5 rounded-2xl text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const iconSize = iconSizes[size];

  switch (category) {
    case 'vegetables':
      return (
        <div className={`flex items-center justify-center bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Salad size={iconSize} />
        </div>
      );
    case 'fruits':
      return (
        <div className={`flex items-center justify-center bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Apple size={iconSize} />
        </div>
      );
    case 'meat':
      return (
        <div className={`flex items-center justify-center bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Beef size={iconSize} />
        </div>
      );
    case 'fish':
      return (
        <div className={`flex items-center justify-center bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Fish size={iconSize} />
        </div>
      );
    case 'dairy':
      return (
        <div className={`flex items-center justify-center bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Milk size={iconSize} />
        </div>
      );
    case 'bakery':
      return (
        <div className={`flex items-center justify-center bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <ShoppingBag size={iconSize} />
        </div>
      );
    case 'pantry':
      return (
        <div className={`flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Package size={iconSize} />
        </div>
      );
    case 'spices':
      return (
        <div className={`flex items-center justify-center bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200/80 dark:border-red-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Flame size={iconSize} />
        </div>
      );
    case 'beverages':
      return (
        <div className={`flex items-center justify-center bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Coffee size={iconSize} />
        </div>
      );
    case 'household':
      return (
        <div className={`flex items-center justify-center bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Home size={iconSize} />
        </div>
      );
    default:
      return (
        <div className={`flex items-center justify-center bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 ${sizeClasses[size]} ${className}`}>
          <Tag size={iconSize} />
        </div>
      );
  }
};
