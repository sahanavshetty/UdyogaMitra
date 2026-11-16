import { Mic, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../i18n/translations';
import type { LanguageCode } from '../types';

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEventLike {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface VoiceMicButtonProps {
  language: LanguageCode;
  onTranscriptChange: (text: string) => void;
  currentText: string;
}

export function VoiceMicButton({
  language,
  onTranscriptChange,
  currentText,
}: VoiceMicButtonProps) {
  const t = TRANSLATIONS[language];
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseTextRef = useRef(currentText);

  useEffect(() => {
    baseTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      setSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore cleanup stop errors
        }
      }
    };
  }, []);

  const toggleMic = () => {
    setMicError(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      setSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      const langMeta = LANGUAGE_OPTIONS.find((l) => l.code === language);
      recognition.lang = langMeta?.speechLang || 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      const startingPrefix = baseTextRef.current.trim();

      recognition.onresult = (event) => {
        let spoken = '';
        for (let i = 0; i < event.results.length; i += 1) {
          spoken += event.results[i][0].transcript + ' ';
        }
        const combined = startingPrefix
          ? `${startingPrefix} ${spoken.trim()}`
          : spoken.trim();
        onTranscriptChange(combined);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicError(t.speechUnsupported);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setSupported(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <button
        type="button"
        onClick={toggleMic}
        disabled={!supported}
        aria-pressed={isListening}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 ${
          !supported
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
            : isListening
            ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/30 scale-105'
            : 'bg-teal-600 hover:bg-teal-700 active:scale-95 text-white shadow-xl shadow-teal-600/25'
        }`}
      >
        {isListening ? (
          <>
            <span
              className="absolute inset-0 rounded-full border-4 border-rose-300 animate-ping opacity-40"
              aria-hidden="true"
            />
            <Square className="w-9 h-9 fill-current mb-1" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide">{t.tapToStop}</span>
          </>
        ) : (
          <>
            <Mic className="w-11 h-11 mb-1" strokeWidth={2.2} aria-hidden="true" />
            <span className="text-xs font-bold px-2 leading-tight">MIC</span>
          </>
        )}
      </button>

      <p className="mt-4 text-base sm:text-lg font-bold text-[#0F2544]">
        {!supported
          ? t.speechUnsupported
          : isListening
          ? t.listeningNow
          : t.tapToSpeak}
      </p>

      {micError && (
        <p className="mt-1.5 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          {micError}
        </p>
      )}
    </div>
  );
}
