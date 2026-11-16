import { Star } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import type { LanguageCode, RatingRecord } from '../types';

interface RatingSummaryProps {
  ratings: RatingRecord[];
  targetType: 'youth' | 'job';
  targetId: string;
  language: LanguageCode;
}

export function getRatingStats(
  ratings: RatingRecord[],
  targetType: 'youth' | 'job',
  targetId: string
) {
  const matched = ratings.filter(
    (r) => r.targetType === targetType && r.targetId === targetId
  );
  if (matched.length === 0) {
    return { average: null, count: 0, latestNote: null };
  }
  const sum = matched.reduce((acc, r) => acc + r.stars, 0);
  return {
    average: Number((sum / matched.length).toFixed(1)),
    count: matched.length,
    latestNote: matched[0]?.note || null,
  };
}

export function RatingSummary({
  ratings,
  targetType,
  targetId,
  language,
}: RatingSummaryProps) {
  const t = TRANSLATIONS[language];
  const { average, count } = getRatingStats(ratings, targetType, targetId);

  if (average === null) {
    return <span className="text-sm text-slate-500">{t.noReviewsYet}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2544] tabular-nums">
      <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" aria-hidden="true" />
      <span>{average.toFixed(1)}</span>
      <span className="text-slate-500 font-normal">
        ({count} {t.reviewsCount})
      </span>
    </span>
  );
}
