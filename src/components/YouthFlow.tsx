import { ArrowRight, CheckCircle2, Loader2, Plus, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { LanguageCode, YouthProfile } from '../types';
import { VoiceMicButton } from './VoiceMicButton';

interface YouthFlowProps {
  language: LanguageCode;
  onSaveYouth: (profile: Omit<YouthProfile, 'id' | 'createdAt'>) => Promise<YouthProfile>;
  onGoToMatches: (youthId: string) => void;
}

interface ExtractedYouthDraft {
  name: string;
  skills: string[];
  education: string;
  location: string;
  languages: string[];
  expected_pay: string;
  availability: string;
}

export function YouthFlow({ language, onSaveYouth, onGoToMatches }: YouthFlowProps) {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExtractedYouthDraft | null>(null);
  const [savedProfile, setSavedProfile] = useState<YouthProfile | null>(null);

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setError(null);
    setExtracting(true);
    try {
      const res = await fetch('/api/ai/extract-youth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText.trim(), language }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }
      setDraft({
        name: data.name || '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        education: data.education || '',
        location: data.location || '',
        languages: Array.isArray(data.languages) ? data.languages : [],
        expected_pay: data.expected_pay || '',
        availability: data.availability || '',
      });
      setSavedProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setExtracting(false);
    }
  };

  const handleAddSkill = () => {
    if (!draft || !newSkill.trim()) return;
    setDraft({
      ...draft,
      skills: [...draft.skills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    if (!draft) return;
    setDraft({
      ...draft,
      skills: draft.skills.filter((_, i) => i !== index),
    });
  };

  const handleConfirmSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError(null);
    setSaving(true);
    try {
      const created = await onSaveYouth({
        name: draft.name,
        skills: draft.skills,
        education: draft.education,
        location: draft.location,
        languages: draft.languages,
        expected_pay: draft.expected_pay,
        availability: draft.availability,
        rawTranscript: inputText,
      });
      setSavedProfile(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setDraft(null);
    setSavedProfile(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
          {t.youthPageTitle}
        </h1>
        <p className="mt-1.5 text-base sm:text-lg text-slate-600">{t.youthPageDesc}</p>
      </div>

      {/* Saved Confirmation Screen */}
      {savedProfile ? (
        <div className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F2544]">{t.profileSavedTitle}</h2>
            <p className="mt-2 text-base text-slate-600">{t.profileSavedDesc}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-1.5 border border-slate-200">
            <p className="font-bold text-lg text-[#0F2544]">{savedProfile.name}</p>
            <p className="text-sm text-slate-600">
              {savedProfile.location} · {savedProfile.education} · {savedProfile.expected_pay}
            </p>
            <p className="text-sm font-medium text-teal-800">
              {savedProfile.skills.join(' · ')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onGoToMatches(savedProfile.id)}
              className="flex-1 min-h-[54px] px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>{t.findMyJobsBtn}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[54px] px-6 py-3.5 rounded-2xl border border-slate-300 text-[#0F2544] font-semibold text-base hover:bg-slate-50"
            >
              {t.createAnotherBtn}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Voice & Text Capture Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <VoiceMicButton
              language={language}
              currentText={inputText}
              onTranscriptChange={setInputText}
            />

            <div className="space-y-2.5">
              <label
                htmlFor="youth-voice-text"
                className="block text-sm font-bold text-[#0F2544]"
              >
                {t.orTypeBelow}
              </label>
              <textarea
                id="youth-voice-text"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.youthPlaceholder}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 text-base sm:text-lg text-[#0F2544] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Quick sample buttons for easy demoing */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">{t.tryExample}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {t.youthExamples.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(example)}
                    className="flex-1 text-left text-sm text-[#0F2544] bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-xl px-3.5 py-2.5 transition-colors"
                  >
                    “{example}”
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExtract}
              disabled={extracting || !inputText.trim()}
              className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-[#0F2544] hover:bg-[#173561] disabled:opacity-50 text-white font-bold text-lg flex items-center justify-center gap-3 transition-colors"
            >
              {extracting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                  <span>{t.analyzingText}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-teal-300" aria-hidden="true" />
                  <span>{t.understandButton}</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-rose-800 font-medium text-base"
            >
              {error}
            </div>
          )}

          {/* Editable Verification Card */}
          {draft && (
            <form
              onSubmit={handleConfirmSave}
              className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2544]">
                  {t.confirmYouthHeading}
                </h2>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  {t.confirmSubtext}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldName}
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder={t.fieldNameOptional}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldLocation}
                  </label>
                  <input
                    type="text"
                    required
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldEducation}
                  </label>
                  <input
                    type="text"
                    value={draft.education}
                    onChange={(e) => setDraft({ ...draft, education: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldExpectedPay}
                  </label>
                  <input
                    type="text"
                    value={draft.expected_pay}
                    onChange={(e) => setDraft({ ...draft, expected_pay: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldAvailability}
                  </label>
                  <input
                    type="text"
                    value={draft.availability}
                    onChange={(e) => setDraft({ ...draft, availability: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldLanguages}
                  </label>
                  <input
                    type="text"
                    value={draft.languages.join(', ')}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        languages: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Editable Skills list */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#0F2544]">
                  {t.fieldSkills}{' '}
                  <span className="font-normal text-slate-500">({t.fieldSkillsHint})</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {draft.skills.map((skill, idx) => (
                    <button
                      key={`${skill}-${idx}`}
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 font-semibold text-sm inline-flex items-center gap-2 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-900 transition-colors"
                    >
                      <span>{skill}</span>
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder={t.addSkillPlaceholder}
                    className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F2544] font-semibold text-sm inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>{t.addBtn}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-lg flex items-center justify-center gap-2.5 shadow-md shadow-teal-600/20"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>{t.savingText}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                    <span>{t.saveProfileBtn}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
