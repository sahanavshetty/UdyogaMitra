import { Handshake } from 'lucide-react';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../i18n/translations';
import type { AppView, LanguageCode } from '../types';

interface TopBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export function TopBar({
  currentView,
  onNavigate,
  language,
  onLanguageChange,
}: TopBarProps) {
  const t = TRANSLATIONS[language];

  const navItems: { id: AppView; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'youth', label: t.navYouth },
    { id: 'employer', label: t.navEmployer },
    { id: 'matches', label: t.navMatches },
    { id: 'directory', label: t.navDirectory },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded-lg"
        >
          <span className="w-9 h-9 rounded-xl bg-[#0F2544] text-teal-300 flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5" aria-hidden="true" />
          </span>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F2544]">
            {t.appName}
          </span>
        </button>

        {/* Zone 2: Desktop single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {navItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-2 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                  active
                    ? 'text-teal-700 border-teal-600'
                    : 'text-slate-600 border-transparent hover:text-[#0F2544]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher (English, Hindi, Kannada) */}
        <div
          role="group"
          aria-label="Language switcher"
          className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0"
        >
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => onLanguageChange(opt.code)}
                className={`min-h-[36px] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  active
                    ? 'bg-[#0F2544] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#0F2544]'
                }`}
              >
                {opt.nativeLabel}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
