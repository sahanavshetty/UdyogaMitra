import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileImage,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { JobPosting, LanguageCode } from '../types';
import { VoiceMicButton } from './VoiceMicButton';

interface EmployerFlowProps {
  language: LanguageCode;
  onSaveJob: (job: Omit<JobPosting, 'id' | 'createdAt'>) => Promise<JobPosting>;
  onGoToMatches: (jobId: string) => void;
}

interface ExtractedJobDraft {
  employerName: string;
  title: string;
  required_skills: string[];
  location: string;
  pay: string;
  urgency: string;
  language: string;
  extractedNoteText?: string;
}

function createSampleHandwrittenNoteImage(lang: LanguageCode): string {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 460;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Lined notebook paper background
  ctx.fillStyle = '#FFFDF5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#DBEAFE';
  ctx.lineWidth = 2;
  for (let y = 70; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = '#FCA5A5';
  ctx.beginPath();
  ctx.moveTo(76, 0);
  ctx.lineTo(76, canvas.height);
  ctx.stroke();

  // Handwritten dark blue ink lines
  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'italic 28px Georgia, serif';

  const lines =
    lang === 'hi'
      ? [
          'श्री लक्ष्मी हार्डवेयर, डोड्डाबल्लापुर',
          'काम: दुकान हेल्पर और बिलिंग (Tally)',
          'कौशल: ग्राहक बात, UPI बिलिंग, स्टॉक गिनती',
          'वेतन: 13,000 रुपये प्रति माह',
          'तुरंत चाहिए · कन्नड़ या हिंदी',
        ]
      : lang === 'kn'
      ? [
          'ಶ್ರೀ ಲಕ್ಷ್ಮಿ ಹಾರ್ಡ್‌ವೇರ್, ದೊಡ್ಡಬಳ್ಳಾಪುರ',
          'ಕೆಲಸ: ಅಂಗಡಿ ಸಹಾಯಕ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್',
          'ಕೌಶಲ್ಯ: ಗ್ರಾಹಕರ ಸೇವೆ, UPI ಬಿಲ್ಲಿಂಗ್, Tally',
          'ಸಂಬಳ: ತಿಂಗಳಿಗೆ ₹13,000',
          'ತಕ್ಷಣ ಬೇಕು · ಕನ್ನಡ ಗೊತ್ತಿರಬೇಕು',
        ]
      : [
          'Sri Lakshmi Hardware, Doddaballapur',
          'Need: Shop Counter & Billing Helper',
          'Skills: Basic Tally, UPI billing, Stock check',
          'Pay: Rs. 13,000 / month',
          'Urgent: Join this week (Kannada / Hindi)',
        ];

  lines.forEach((line, idx) => {
    ctx.save();
    ctx.translate(96, 108 + idx * 62);
    ctx.rotate((idx % 2 === 0 ? -0.4 : 0.35) * (Math.PI / 180));
    ctx.fillText(line, 0, 0);
    ctx.restore();
  });

  return canvas.toDataURL('image/png');
}

export function EmployerFlow({ language, onSaveJob, onGoToMatches }: EmployerFlowProps) {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [newSkill, setNewSkill] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ExtractedJobDraft | null>(null);
  const [savedJob, setSavedJob] = useState<JobPosting | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTrySampleNote = () => {
    const dataUrl = createSampleHandwrittenNoteImage(language);
    if (dataUrl) {
      setImageDataUrl(dataUrl);
      setImageMimeType('image/png');
    }
  };

  const handleExtract = async () => {
    if (!inputText.trim() && !imageDataUrl) return;
    setError(null);
    setExtracting(true);
    try {
      const res = await fetch('/api/ai/extract-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim() || undefined,
          imageBase64: imageDataUrl || undefined,
          mimeType: imageMimeType,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
      }
      setDraft({
        employerName: data.employerName || '',
        title: data.title || '',
        required_skills: Array.isArray(data.required_skills) ? data.required_skills : [],
        location: data.location || '',
        pay: data.pay || '',
        urgency: data.urgency || '',
        language: data.language || '',
        extractedNoteText: data.extractedNoteText || '',
      });
      setSavedJob(null);
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
      required_skills: [...draft.required_skills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    if (!draft) return;
    setDraft({
      ...draft,
      required_skills: draft.required_skills.filter((_, i) => i !== index),
    });
  };

  const handleConfirmSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setError(null);
    setSaving(true);
    try {
      const created = await onSaveJob({
        employerName: draft.employerName,
        title: draft.title,
        required_skills: draft.required_skills,
        location: draft.location,
        pay: draft.pay,
        urgency: draft.urgency,
        language: draft.language,
        rawInput: inputText || draft.extractedNoteText || '',
      });
      setSavedJob(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setImageDataUrl(null);
    setDraft(null);
    setSavedJob(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2544]">
          {t.employerPageTitle}
        </h1>
        <p className="mt-1.5 text-base sm:text-lg text-slate-600">{t.employerPageDesc}</p>
      </div>

      {savedJob ? (
        <div className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#0F2544]">{t.jobSavedTitle}</h2>
            <p className="mt-2 text-base text-slate-600">{t.jobSavedDesc}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-1.5 border border-slate-200">
            <p className="font-bold text-lg text-[#0F2544]">{savedJob.title}</p>
            <p className="text-sm text-slate-600">
              {savedJob.employerName} · {savedJob.location} · {savedJob.pay}
            </p>
            <p className="text-sm font-medium text-teal-800">
              {savedJob.required_skills.join(' · ')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onGoToMatches(savedJob.id)}
              className="flex-1 min-h-[54px] px-6 py-3.5 rounded-2xl bg-[#0F2544] hover:bg-[#173561] text-white font-bold text-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-teal-300" aria-hidden="true" />
              <span>{t.findWorkersBtn}</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[54px] px-6 py-3.5 rounded-2xl border border-slate-300 text-[#0F2544] font-semibold text-base hover:bg-slate-50"
            >
              {t.roleEmployerCta}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Voice input */}
            <VoiceMicButton
              language={language}
              currentText={inputText}
              onTranscriptChange={setInputText}
            />

            {/* Text box fallback */}
            <div className="space-y-2.5">
              <label
                htmlFor="employer-job-text"
                className="block text-sm font-bold text-[#0F2544]"
              >
                {t.orTypeBelow}
              </label>
              <textarea
                id="employer-job-text"
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.employerPlaceholder}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 text-base sm:text-lg text-[#0F2544] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* Handwritten Note Vision Upload */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#0F2544] text-white flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0F2544]">
                    {t.uploadHandwrittenTitle}
                  </h3>
                  <p className="text-sm text-slate-600">{t.uploadHandwrittenDesc}</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              {imageDataUrl ? (
                <div className="space-y-3">
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-white max-h-64 flex items-center justify-center">
                    <img
                      src={imageDataUrl}
                      alt={t.uploadHandwrittenTitle}
                      className="max-h-64 w-auto object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageDataUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-sm font-semibold inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>{t.removePhotoBtn}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-teal-600 text-[#0F2544] font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-teal-700" aria-hidden="true" />
                    <span>{t.choosePhotoBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTrySampleNote}
                    className="min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-900 font-semibold text-sm sm:text-base inline-flex items-center gap-2 transition-colors"
                  >
                    <FileImage className="w-5 h-5 text-teal-700" aria-hidden="true" />
                    <span>{t.sampleNoteBtn}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick text examples */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500">{t.tryExample}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {t.employerExamples.map((example, idx) => (
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
              disabled={extracting || (!inputText.trim() && !imageDataUrl)}
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
                  <span>{t.understandJobBtn}</span>
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

          {/* Editable Job Verification Card */}
          {draft && (
            <form
              onSubmit={handleConfirmSave}
              className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2544]">
                  {t.confirmJobHeading}
                </h2>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  {t.confirmSubtext}
                </p>
                {draft.extractedNoteText && (
                  <p className="mt-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                    {draft.extractedNoteText}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldJobTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldEmployerName}
                  </label>
                  <input
                    type="text"
                    value={draft.employerName}
                    onChange={(e) => setDraft({ ...draft, employerName: e.target.value })}
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
                    {t.fieldPay}
                  </label>
                  <input
                    type="text"
                    value={draft.pay}
                    onChange={(e) => setDraft({ ...draft, pay: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldUrgency}
                  </label>
                  <input
                    type="text"
                    value={draft.urgency}
                    onChange={(e) => setDraft({ ...draft, urgency: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2544] mb-1.5">
                    {t.fieldLanguage}
                  </label>
                  <input
                    type="text"
                    value={draft.language}
                    onChange={(e) => setDraft({ ...draft, language: e.target.value })}
                    className="w-full min-h-[48px] px-4 py-2.5 rounded-xl border border-slate-300 text-base text-[#0F2544] focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              {/* Editable Required Skills */}
              <div className="space-y-2.5">
                <label className="block text-sm font-bold text-[#0F2544]">
                  {t.fieldRequiredSkills}{' '}
                  <span className="font-normal text-slate-500">({t.fieldSkillsHint})</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {draft.required_skills.map((skill, idx) => (
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
                    <span>{t.saveJobBtn}</span>
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
