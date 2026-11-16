import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DirectoryView } from './components/DirectoryView';
import { EmployerFlow } from './components/EmployerFlow';
import { HomeView } from './components/HomeView';
import { MatchesView } from './components/MatchesView';
import { RatingModal } from './components/RatingModal';
import { TopBar } from './components/TopBar';
import { YouthFlow } from './components/YouthFlow';
import { INITIAL_STORE_DATA } from './data/seed';
import { TRANSLATIONS } from './i18n/translations';
import type {
  AppView,
  JobPosting,
  LanguageCode,
  RatingRecord,
  StoreData,
  YouthProfile,
} from './types';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [store, setStore] = useState<StoreData>(INITIAL_STORE_DATA);
  const [matchContext, setMatchContext] = useState<{
    mode: 'youth' | 'employer';
    selectedId: string | null;
  }>({ mode: 'youth', selectedId: null });

  const [ratingTarget, setRatingTarget] = useState<{
    targetType: 'youth' | 'job';
    targetId: string;
    targetName: string;
    reviewerRole: 'employer' | 'youth';
  } | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    let active = true;
    fetch('/api/data')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Load failed'))))
      .then((data: StoreData) => {
        if (active && data && Array.isArray(data.youths) && Array.isArray(data.jobs)) {
          setStore(data);
        }
      })
      .catch(() => {
        // Fallback smoothly to preloaded seed data in state
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSaveYouth = async (
    profile: Omit<YouthProfile, 'id' | 'createdAt'>
  ): Promise<YouthProfile> => {
    const res = await fetch('/api/youths', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const created = await res.json();
    if (!res.ok) {
      throw new Error(created.error || t.errorGeneric);
    }
    setStore((prev) => ({
      ...prev,
      youths: [created as YouthProfile, ...prev.youths],
    }));
    return created as YouthProfile;
  };

  const handleSaveJob = async (
    job: Omit<JobPosting, 'id' | 'createdAt'>
  ): Promise<JobPosting> => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    const created = await res.json();
    if (!res.ok) {
      throw new Error(created.error || t.errorGeneric);
    }
    setStore((prev) => ({
      ...prev,
      jobs: [created as JobPosting, ...prev.jobs],
    }));
    return created as JobPosting;
  };

  const handleSaveRating = async (payload: {
    targetType: 'youth' | 'job';
    targetId: string;
    reviewerRole: 'employer' | 'youth';
    reviewerName: string;
    stars: number;
    note: string;
  }) => {
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    if (!res.ok) {
      throw new Error(created.error || t.errorGeneric);
    }
    setStore((prev) => ({
      ...prev,
      ratings: [created as RatingRecord, ...prev.ratings],
    }));
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToMatchesForYouth = (youthId: string) => {
    setMatchContext({ mode: 'youth', selectedId: youthId });
    navigateTo('matches');
  };

  const goToMatchesForJob = (jobId: string) => {
    setMatchContext({ mode: 'employer', selectedId: jobId });
    navigateTo('matches');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-[#0F2544]">
      <TopBar
        currentView={currentView}
        onNavigate={navigateTo}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {currentView !== 'home' && (
          <div className="mb-4">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="min-h-[44px] px-3 -ml-3 rounded-xl text-sm font-bold text-slate-600 hover:text-[#0F2544] inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t.backHomeBtn}</span>
            </button>
          </div>
        )}

        {currentView === 'home' && (
          <HomeView
            language={language}
            youthCount={store.youths.length}
            jobCount={store.jobs.length}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'youth' && (
          <YouthFlow
            language={language}
            onSaveYouth={handleSaveYouth}
            onGoToMatches={goToMatchesForYouth}
          />
        )}

        {currentView === 'employer' && (
          <EmployerFlow
            language={language}
            onSaveJob={handleSaveJob}
            onGoToMatches={goToMatchesForJob}
          />
        )}

        {currentView === 'matches' && (
          <MatchesView
            language={language}
            youths={store.youths}
            jobs={store.jobs}
            ratings={store.ratings}
            initialMode={matchContext.mode}
            initialSelectedId={matchContext.selectedId}
            onOpenRating={(target) => setRatingTarget(target)}
          />
        )}

        {currentView === 'directory' && (
          <DirectoryView
            language={language}
            youths={store.youths}
            jobs={store.jobs}
            ratings={store.ratings}
            onFindMatchesForYouth={goToMatchesForYouth}
            onFindMatchesForJob={goToMatchesForJob}
            onOpenRating={(target) => setRatingTarget(target)}
          />
        )}
      </main>

      <BottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        language={language}
      />

      <RatingModal
        isOpen={Boolean(ratingTarget)}
        onClose={() => setRatingTarget(null)}
        targetName={ratingTarget?.targetName || ''}
        targetType={ratingTarget?.targetType || 'youth'}
        targetId={ratingTarget?.targetId || ''}
        reviewerRole={ratingTarget?.reviewerRole || 'employer'}
        language={language}
        onSubmit={handleSaveRating}
      />
    </div>
  );
}
