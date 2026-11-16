import { Briefcase, Home, Mic, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { AppView, LanguageCode } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: LanguageCode;
}

export function BottomNav({ currentView, onNavigate, language }: BottomNavProps) {
  const t = TRANSLATIONS[language];

  const items: { id: AppView; label: string; icon: typeof Home }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'youth', label: t.navYouth, icon: Mic },
    { id: 'employer', label: t.navEmployer, icon: Briefcase },
    { id: 'matches', label: t.navMatches, icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200"
    >
      <div className="grid grid-cols-4 h-full">
        {items.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] px-1 transition-colors ${
                active ? 'text-teal-700 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
              <span className="text-[11px] leading-tight mt-1 truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
