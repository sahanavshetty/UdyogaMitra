import { Star, X } from 'lucide-react';
import { useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { LanguageCode } from '../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType: 'youth' | 'job';
  targetId: string;
  reviewerRole: 'employer' | 'youth';
  language: LanguageCode;
  onSubmit: (payload: {
    targetType: 'youth' | 'job';
    targetId: string;
    reviewerRole: 'employer' | 'youth';
    reviewerName: string;
    stars: number;
    note: string;
  }) => Promise<void>;
}

export function RatingModal({
  isOpen,
  onClose,
  targetName,
  targetType,
  targetId,
  reviewerRole,
  language,
  onSubmit,
}: RatingModalProps) {
  const t = TRANSLATIONS[language];
  const [stars, setStars] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        targetType,
        targetId,
        reviewerRole,
        reviewerName: reviewerName.trim() || 'Community Member',
        stars,
        note: note.trim(),
      });
      setNote('');
      setReviewerName('');
      setStars(5);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F2544]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rating-modal-title"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 id="rating-modal-title" className="text-xl font-bold text-[#0F2544]">
              {t.ratingModalTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{targetName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancelBtn}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0F2544] mb-2">
              {t.yourStarsLabel}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStars(value)}
                  className="min-w-[48px] min-h-[48px] rounded-xl flex items-center justify-center border border-slate-200 hover:bg-amber-50 transition-colors"
                  aria-label={`${value} stars`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      value <= stars
                        ? 'text-amber-500 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F2544] mb-1.5">
              {t.yourNameLabel}
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder={t.fieldNameOptional}
              className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F2544] mb-1.5">
              {t.yourNoteLabel}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.yourNotePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-50"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[#0F2544] hover:bg-[#173561] text-white font-bold text-base disabled:opacity-60"
            >
              {submitting ? t.savingText : t.submitRatingBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
