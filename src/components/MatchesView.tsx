import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Loader2,
  MapPin,
  RefreshCw,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type {
  JobPosting,
  LanguageCode,
  MatchResult,
  RatingRecord,
  UpskillPlan,
  YouthProfile,
} from '../types';
import { RatingSummary } from './RatingSummary';

interface MatchesViewProps {
  language: LanguageCode;
  youths: YouthProfile[];
  jobs: JobPosting[];
  ratings: RatingRecord[];
  initialMode: 'youth' | 'employer';
  initialSelectedId: string | null;
  onOpenRating: (target: {
    targetType: 'youth' | 'job';
    targetId: string;
    targetName: string;
    reviewerRole: 'employer' | 'youth';
  }) => void;
}

export function MatchesView({
  language,
  youths,
  jobs,
  ratings,
  initialMode,
  initialSelectedId,
  onOpenRating,
}: MatchesViewProps) {
  const t = TRANSLATIONS[language];
  const [mode, setMode] = useState<'youth' | 'employer'>(initialMode);
  const [selectedYouthId, setSelectedYouthId] = useState<string>(
    initialMode === 'youth' && initialSelectedId
      ? initialSelectedId
      : youths[0]?.id || ''
  );
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialMode === 'employer' && initialSelectedId
      ? initialSelectedId
      : jobs[0]?.id || ''
  );

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Per-match upskilling plans keyed by `${sourceId}_${targetId}_${language}`
  const [upskillPlans, setUpskillPlans] = useState<Record<string, UpskillPlan>>({});
  const [loadingPlanKey, setLoadingPlanKey] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    if (initialMode === 'youth' && initialSelectedId) {
      setSelectedYouthId(initialSelectedId);
    } else if (initialMode === 'employer' && initialSelectedId) {
      setSelectedJobId(initialSelectedId);
    }
  }, [initialMode, initialSelectedId]);

  const activeSourceId = mode === 'youth' ? selectedYouthId : selectedJobId;
  const activeYouth = youths.find((y) => y.id === selectedYouthId) || youths[0];
  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const runMatching = useCallback(async () => {
    const sourceItem = mode === 'youth' ? activeYouth : activeJob;
    const candidates = mode === 'youth' ? jobs : youths;
    if (!sourceItem || candidates.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          sourceItem,
          candidates,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }
      const list = Array.isArray(data.matches) ? (data.matches as MatchResult[]) : [];
      list.sort((a, b) => b.score - a.score);
      setMatches(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  }, [mode, activeYouth, activeJob, jobs, youths, language, t.errorGeneric]);

  useEffect(() => {
    runMatching();
  }, [runMatching]);

  const handleLoadUpskill = async (
    match: MatchResult,
    targetRole: string,
    currentSkills: string[]
  ) => {
    const planKey = `${activeSourceId}_${match.targetId}_${language}`;
    if (upskillPlans[planKey]) return;

    setLoadingPlanKey(planKey);
    try {
      const res = await fetch('/api/ai/upskill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missingSkills: match.missing_skills,
          targetRole,
          currentSkills,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }
      setUpskillPlans((prev) => ({ ...prev, [planKey]: data as UpskillPlan }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setLoadingPlanKey(null);
    }
  };

  const getScoreMeta = (score: number) => {
    if (score >= 80) {
      return {
        label: t.strongMatch,
        textClass: 'text-teal-800',
        barClass: 'bg-teal-600',
        ringClass: 'border-teal-600 text-teal-800 bg-teal-50/70',
      };
    }
    if (score >= 55) {
      return {
        label: t.goodMatch,
        textClass: 'text-[#0F2544]',
        barClass: 'bg-[#0F2544]',
        ringClass: 'border-[#0F2544] text-[#0F2544] bg-slate-50',
      };
    }
    return {
      label: t.partialMatch,
      textClass: 'text-amber-800',
      barClass: 'bg-amber-500',
      ringClass: 'border-amber-500 text-amber-900 bg-amber-50/70',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header & Role Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
            {t.matchesPageTitle}
          </h1>
          <p className="mt-1.5 text-base text-slate-600">{t.matchesPageDesc}</p>
        </div>

        <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl self-start">
          <button
            type="button"
            onClick={() => setMode('youth')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold inline-flex items-center gap-2 transition-all whitespace-nowrap ${
              mode === 'youth'
                ? 'bg-[#0F2544] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#0F2544]'
            }`}
          >
            <User className="w-4 h-4" aria-hidden="true" />
            <span>{t.modeWorker}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('employer')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold inline-flex items-center gap-2 transition-all whitespace-nowrap ${
              mode === 'employer'
                ? 'bg-[#0F2544] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#0F2544]'
            }`}
          >
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>{t.modeEmployer}</span>
          </button>
        </div>
      </div>

      {/* Selector Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        <div className="flex-1">
          <label
            htmlFor="match-source-select"
            className="block text-sm font-bold text-[#0F2544] mb-1.5"
          >
            {mode === 'youth' ? t.selectYourProfile : t.selectYourJob}
          </label>
          {mode === 'youth' ? (
            <select
              id="match-source-select"
              value={activeYouth?.id || ''}
              onChange={(e) => setSelectedYouthId(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-semibold text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {youths.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} — {y.location} ({y.skills.slice(0, 2).join(', ')})
                </option>
              ))}
            </select>
          ) : (
            <select
              id="match-source-select"
              value={activeJob?.id || ''}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-semibold text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.location} ({j.pay})
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={runMatching}
          disabled={loading}
          className="min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-base inline-flex items-center justify-center gap-2 shrink-0"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{t.findMatchesBtn}</span>
        </button>
      </div>

      {/* Selected Source Summary */}
      {mode === 'youth' && activeYouth && (
        <div className="bg-slate-100/80 rounded-2xl px-5 py-3.5 text-sm sm:text-base text-[#0F2544] flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-bold">{activeYouth.name}</span>
          <span aria-hidden="true">·</span>
          <span>{activeYouth.location}</span>
          <span aria-hidden="true">·</span>
          <span>{activeYouth.skills.join(', ')}</span>
          <span aria-hidden="true">·</span>
          <span>{activeYouth.expected_pay}</span>
        </div>
      )}

      {mode === 'employer' && activeJob && (
        <div className="bg-slate-100/80 rounded-2xl px-5 py-3.5 text-sm sm:text-base text-[#0F2544] flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-bold">{activeJob.title}</span>
          <span aria-hidden="true">·</span>
          <span>{activeJob.location}</span>
          <span aria-hidden="true">·</span>
          <span>{activeJob.required_skills.join(', ')}</span>
          <span aria-hidden="true">·</span>
          <span>{activeJob.pay}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-rose-800 font-medium"
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto" aria-hidden="true" />
          <p className="text-lg font-bold text-[#0F2544]">{t.matchingLoading}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map((match) => {
            const targetJob =
              mode === 'youth' ? jobs.find((j) => j.id === match.targetId) : undefined;
            const targetYouth =
              mode === 'employer'
                ? youths.find((y) => y.id === match.targetId)
                : undefined;

            if (!targetJob && !targetYouth) return null;

            const scoreMeta = getScoreMeta(match.score);
            const planKey = `${activeSourceId}_${match.targetId}_${language}`;
            const upskillPlan = upskillPlans[planKey];
            const hasMissingSkills = match.missing_skills && match.missing_skills.length > 0;
            const targetName = targetJob
              ? `${targetJob.title} (${targetJob.employerName || targetJob.location})`
              : targetYouth?.name || '';
            const targetRoleForPlan = targetJob
              ? targetJob.title
              : activeJob?.title || '';
            const currentSkillsForPlan = targetYouth
              ? targetYouth.skills
              : activeYouth?.skills || [];

            return (
              <article
                key={match.targetId}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top row: Title & Score */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-xl font-extrabold text-[#0F2544] leading-snug">
                        {targetJob ? targetJob.title : targetYouth?.name}
                      </h2>
                      <p className="text-sm sm:text-base font-medium text-slate-600">
                        {targetJob
                          ? `${targetJob.employerName || ''} · ${targetJob.location}`
                          : `${targetYouth?.education} · ${targetYouth?.location}`}
                      </p>
                      <div className="pt-0.5">
                        <RatingSummary
                          ratings={ratings}
                          targetType={targetJob ? 'job' : 'youth'}
                          targetId={match.targetId}
                          language={language}
                        />
                      </div>
                    </div>

                    <div
                      className={`shrink-0 rounded-2xl border-2 px-3.5 py-2 text-center min-w-[84px] ${scoreMeta.ringClass}`}
                    >
                      <div className="text-2xl font-extrabold tabular-nums leading-none">
                        {match.score}%
                      </div>
                      <div className="text-[11px] font-bold mt-1 whitespace-nowrap">
                        {scoreMeta.label}
                      </div>
                    </div>
                  </div>

                  {/* Key metadata line (unboxed, clean separators) */}
                  <div className="text-sm text-slate-700 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-y border-slate-100 py-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0F2544]">
                      <MapPin className="w-4 h-4 text-teal-600" aria-hidden="true" />
                      {targetJob ? targetJob.location : targetYouth?.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#0F2544]">
                      {targetJob ? targetJob.pay : targetYouth?.expected_pay}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {targetJob
                        ? targetJob.language
                        : targetYouth?.languages.join(', ')}
                    </span>
                  </div>

                  {/* 4-Factor Breakdown */}
                  <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 rounded-2xl p-3">
                    <div>
                      <div className="text-xs text-slate-500">{t.scoreSkills}</div>
                      <div className="text-sm font-bold text-[#0F2544] tabular-nums">
                        {match.skill_overlap_score}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{t.scoreDistance}</div>
                      <div className="text-sm font-bold text-[#0F2544] tabular-nums">
                        {match.distance_score}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{t.scorePay}</div>
                      <div className="text-sm font-bold text-[#0F2544] tabular-nums">
                        {match.pay_fit_score}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{t.scoreLanguage}</div>
                      <div className="text-sm font-bold text-[#0F2544] tabular-nums">
                        {match.language_score}%
                      </div>
                    </div>
                  </div>

                  {/* Plain-language AI explanation */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-teal-700">{t.whyYouMatch}</p>
                    <p className="text-base text-[#0F2544] leading-relaxed">
                      {match.explanation}
                    </p>
                  </div>

                  {/* Skills & Skill Gap Section */}
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                      <span className="font-semibold text-[#0F2544]">
                        {targetJob ? t.fieldRequiredSkills : t.fieldSkills}:
                      </span>{' '}
                      {(targetJob
                        ? targetJob.required_skills
                        : targetYouth?.skills || []
                      ).join(' · ')}
                    </p>

                    {hasMissingSkills ? (
                      <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-3">
                        <div>
                          <p className="text-xs font-bold text-amber-900">
                            {t.skillGapTitle}
                          </p>
                          <p className="text-sm font-semibold text-[#0F2544] mt-0.5">
                            {t.missingSkillsLabel}: {match.missing_skills.join(', ')}
                          </p>
                        </div>

                        {!upskillPlan ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleLoadUpskill(
                                match,
                                targetRoleForPlan,
                                currentSkillsForPlan
                              )
                            }
                            disabled={loadingPlanKey === planKey}
                            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/60 text-[#0F2544] font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                          >
                            {loadingPlanKey === planKey ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                <span>{t.loadingPlan}</span>
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-4 h-4 text-teal-700" aria-hidden="true" />
                                <span>{t.getUpskillPlanBtn}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="space-y-3 pt-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-extrabold text-[#0F2544] flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                                <span>{upskillPlan.summary}</span>
                              </p>
                              <span className="text-xs font-semibold text-teal-800 whitespace-nowrap">
                                {upskillPlan.estimated_time}
                              </span>
                            </div>
                            <ol className="space-y-2">
                              {upskillPlan.steps.slice(0, 3).map((step, sIdx) => (
                                <li
                                  key={sIdx}
                                  className="bg-white rounded-xl border border-amber-200/70 p-3 text-sm"
                                >
                                  <p className="font-bold text-[#0F2544]">
                                    {t.stepLabel} {sIdx + 1}: {step.title}
                                  </p>
                                  <p className="text-slate-600 mt-0.5">{step.detail}</p>
                                  <p className="text-xs font-semibold text-teal-700 mt-1">
                                    {step.resource_hint}
                                  </p>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-teal-700 inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        <span>{t.noMissingSkills}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action: Rate after work */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenRating({
                        targetType: targetJob ? 'job' : 'youth',
                        targetId: match.targetId,
                        targetName,
                        reviewerRole: mode === 'youth' ? 'youth' : 'employer',
                      })
                    }
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 text-[#0F2544] font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                  >
                    <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span>{t.rateAfterWorkBtn}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
