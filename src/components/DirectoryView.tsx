import { Briefcase, MapPin, Sparkles, Star, User } from 'lucide-react';
import { useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { JobPosting, LanguageCode, RatingRecord, YouthProfile } from '../types';
import { getRatingStats, RatingSummary } from './RatingSummary';

interface DirectoryViewProps {
  language: LanguageCode;
  youths: YouthProfile[];
  jobs: JobPosting[];
  ratings: RatingRecord[];
  onFindMatchesForYouth: (youthId: string) => void;
  onFindMatchesForJob: (jobId: string) => void;
  onOpenRating: (target: {
    targetType: 'youth' | 'job';
    targetId: string;
    targetName: string;
    reviewerRole: 'employer' | 'youth';
  }) => void;
}

export function DirectoryView({
  language,
  youths,
  jobs,
  ratings,
  onFindMatchesForYouth,
  onFindMatchesForJob,
  onOpenRating,
}: DirectoryViewProps) {
  const t = TRANSLATIONS[language];
  const [tab, setTab] = useState<'youths' | 'jobs'>('youths');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
            {t.directoryTitle}
          </h1>
          <p className="mt-1.5 text-base text-slate-600">{t.directoryDesc}</p>
        </div>

        <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl self-start">
          <button
            type="button"
            onClick={() => setTab('youths')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold inline-flex items-center gap-2 transition-all tabular-nums ${
              tab === 'youths'
                ? 'bg-[#0F2544] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#0F2544]'
            }`}
          >
            <User className="w-4 h-4" aria-hidden="true" />
            <span>
              {t.tabYouths} ({youths.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab('jobs')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-sm sm:text-base font-bold inline-flex items-center gap-2 transition-all tabular-nums ${
              tab === 'jobs'
                ? 'bg-[#0F2544] text-white shadow-sm'
                : 'text-slate-700 hover:text-[#0F2544]'
            }`}
          >
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>
              {t.tabJobs} ({jobs.length})
            </span>
          </button>
        </div>
      </div>

      {tab === 'youths' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {youths.map((youth) => {
            const stats = getRatingStats(ratings, 'youth', youth.id);
            return (
              <article
                key={youth.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0F2544]">{youth.name}</h2>
                    <div className="mt-1">
                      <RatingSummary
                        ratings={ratings}
                        targetType="youth"
                        targetId={youth.id}
                        language={language}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
                    <span>
                      {youth.location} · {youth.education}
                    </span>
                  </p>

                  <p className="text-sm font-semibold text-[#0F2544]">
                    {youth.skills.join(' · ')}
                  </p>

                  <p className="text-sm text-slate-600">
                    {youth.expected_pay} · {youth.languages.join(', ')} · {youth.availability}
                  </p>

                  {stats.latestNote && (
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100 italic">
                      “{stats.latestNote}”
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onFindMatchesForYouth(youth.id)}
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm inline-flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>{t.quickMatchesTitle}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenRating({
                        targetType: 'youth',
                        targetId: youth.id,
                        targetName: youth.name,
                        reviewerRole: 'employer',
                      })
                    }
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0F2544] font-semibold text-sm inline-flex items-center gap-1.5"
                  >
                    <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span>{t.leaveRatingBtn}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const stats = getRatingStats(ratings, 'job', job.id);
            return (
              <article
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0F2544]">{job.title}</h2>
                    <p className="text-sm font-medium text-slate-600 mt-0.5">
                      {job.employerName || t.fieldEmployerName}
                    </p>
                    <div className="mt-1">
                      <RatingSummary
                        ratings={ratings}
                        targetType="job"
                        targetId={job.id}
                        language={language}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
                    <span>
                      {job.location} · {job.urgency}
                    </span>
                  </p>

                  <p className="text-sm font-semibold text-[#0F2544]">
                    {job.required_skills.join(' · ')}
                  </p>

                  <p className="text-sm text-slate-600">
                    {job.pay} · {job.language}
                  </p>

                  {stats.latestNote && (
                    <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100 italic">
                      “{stats.latestNote}”
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onFindMatchesForJob(job.id)}
                    className="flex-1 min-h-[44px] px-3 py-2 rounded-xl bg-[#0F2544] hover:bg-[#173561] text-white font-bold text-sm inline-flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-teal-300" aria-hidden="true" />
                    <span>{t.quickMatchesTitle}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenRating({
                        targetType: 'job',
                        targetId: job.id,
                        targetName: `${job.title} (${job.employerName || job.location})`,
                        reviewerRole: 'youth',
                      })
                    }
                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#0F2544] font-semibold text-sm inline-flex items-center gap-1.5"
                  >
                    <Star className="w-4 h-4 text-amber-500" aria-hidden="true" />
                    <span>{t.leaveRatingBtn}</span>
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
