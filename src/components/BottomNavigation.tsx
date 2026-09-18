import React from 'react';
import { Home, ListOrdered, Clock, SlidersHorizontal, Plus } from 'lucide-react';
import { AppLanguage } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

export type NavTab = 'home' | 'lists' | 'history' | 'settings';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenNewBazar: () => void;
  lang: AppLanguage;
  theme: ThemeConfig;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewBazar,
  lang,
  theme,
}) => {
  const handleTabClick = (tab: NavTab) => {
    FODDOStorage.triggerHaptic();
    onSelectTab(tab);
  };

  const handleFabClick = () => {
    FODDOStorage.triggerHaptic();
    onOpenNewBazar();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 relative flex items-center justify-between">
        
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          type="button"
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            currentTab === 'home'
              ? `${theme.primaryText} font-semibold scale-105`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight">{translate(lang, 'nav.home')}</span>
        </button>

        {/* Lists Tab */}
        <button
          id="nav-tab-lists"
          type="button"
          onClick={() => handleTabClick('lists')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            currentTab === 'lists'
              ? `${theme.primaryText} font-semibold scale-105`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ListOrdered className={`w-5 h-5 ${currentTab === 'lists' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight">{translate(lang, 'nav.lists')}</span>
        </button>

        {/* Center Floating Action Button (+) */}
        <div className="flex-1 flex justify-center items-center h-full relative">
          <button
            id="nav-fab-new-bazar"
            type="button"
            onClick={handleFabClick}
            aria-label="Create New Bazar List"
            className={`-top-5 absolute w-13 h-13 rounded-full ${theme.primaryBg} ${theme.primaryHover} text-white shadow-lg shadow-blue-500/35 dark:shadow-blue-900/40 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400/30`}
          >
            <Plus className="w-7 h-7 stroke-[2.75]" />
          </button>
        </div>

        {/* History Tab */}
        <button
          id="nav-tab-history"
          type="button"
          onClick={() => handleTabClick('history')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            currentTab === 'history'
              ? `${theme.primaryText} font-semibold scale-105`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Clock className={`w-5 h-5 ${currentTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight">{translate(lang, 'nav.history')}</span>
        </button>

        {/* Settings Tab */}
        <button
          id="nav-tab-settings"
          type="button"
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1.5 transition-all ${
            currentTab === 'settings'
              ? `${theme.primaryText} font-semibold scale-105`
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <SlidersHorizontal className={`w-5 h-5 ${currentTab === 'settings' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[11px] mt-1 tracking-tight">{translate(lang, 'nav.settings')}</span>
        </button>

      </div>
    </div>
  );
};
