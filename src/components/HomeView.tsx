import { ArrowRight, Briefcase, Mic, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { AppView, LanguageCode } from '../types';

interface HomeViewProps {
  language: LanguageCode;
  youthCount: number;
  jobCount: number;
  onNavigate: (view: AppView) => void;
}

export function HomeView({
  language,
  youthCount,
  jobCount,
  onNavigate,
}: HomeViewProps) {
  const t = TRANSLATIONS[language];
  const [youthImgErr, setYouthImgErr] = useState(false);
  const [empImgErr, setEmpImgErr] = useState(false);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero section */}
      <section className="pt-2 sm:pt-4">
        <p className="text-sm sm:text-base font-bold text-teal-700 tracking-wide">
          {t.tagline}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F2544] tracking-tight leading-tight max-w-3xl">
          {t.appName}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          {t.homeSubtitle}
        </p>
      </section>

      {/* Two primary role cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: I am looking for work */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="aspect-[4/3] w-full bg-[#F1F5F9] overflow-hidden relative">
              {!youthImgErr ? (
                <img
                  src="/src/assets/images/youth_worker_card_1794835961320.jpg"
                  alt={t.roleYouthTitle}
                  referrerPolicy="no-referrer"
                  onError={() => setYouthImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-slate-100 text-teal-800 p-6">
                  <Mic className="w-12 h-12 mb-2" />
                  <span className="font-bold text-lg">{t.roleYouthTitle}</span>
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
                {t.roleYouthTitle}
              </h2>
              <p className="mt-2.5 text-base sm:text-lg text-slate-600 leading-relaxed">
                {t.roleYouthDesc}
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <button
              type="button"
              onClick={() => onNavigate('youth')}
              className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md shadow-teal-600/20"
            >
              <Mic className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span>{t.roleYouthCta}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Card 2: I want to hire */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="aspect-[4/3] w-full bg-[#F1F5F9] overflow-hidden relative">
              {!empImgErr ? (
                <img
                  src="/src/assets/images/employer_shop_card_1794835961644.jpg"
                  alt={t.roleEmployerTitle}
                  referrerPolicy="no-referrer"
                  onError={() => setEmpImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-teal-50 text-[#0F2544] p-6">
                  <Briefcase className="w-12 h-12 mb-2" />
                  <span className="font-bold text-lg">{t.roleEmployerTitle}</span>
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
                {t.roleEmployerTitle}
              </h2>
              <p className="mt-2.5 text-base sm:text-lg text-slate-600 leading-relaxed">
                {t.roleEmployerDesc}
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <button
              type="button"
              onClick={() => onNavigate('employer')}
              className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-[#0F2544] hover:bg-[#173561] active:scale-[0.99] text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md shadow-[#0F2544]/15"
            >
              <Briefcase className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span>{t.roleEmployerCta}</span>
              <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Secondary quick links: Find Matches & Community Directory */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => onNavigate('matches')}
          className="text-left bg-white hover:bg-teal-50/40 rounded-2xl border border-slate-200 p-6 transition-colors flex items-center justify-between gap-4 min-h-[88px]"
        >
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F2544]">
                {t.quickMatchesTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {t.quickMatchesDesc}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('directory')}
          className="text-left bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 p-6 transition-colors flex items-center justify-between gap-4 min-h-[88px]"
        >
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0F2544] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F2544]">
                {t.quickDirectoryTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mt-1 tabular-nums">
                {youthCount} {t.youthRegisteredCount} · {jobCount} {t.jobsPostedCount}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#0F2544] shrink-0" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
