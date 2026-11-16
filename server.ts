import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_STORE_DATA } from './src/data/seed.ts';
import type { JobPosting, LanguageCode, RatingRecord, StoreData, YouthProfile } from './src/types.ts';

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

function ensureStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(INITIAL_STORE_DATA, null, 2), 'utf-8');
    return JSON.parse(JSON.stringify(INITIAL_STORE_DATA));
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as StoreData;
    return {
      youths: Array.isArray(parsed.youths) ? parsed.youths : INITIAL_STORE_DATA.youths,
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : INITIAL_STORE_DATA.jobs,
      ratings: Array.isArray(parsed.ratings) ? parsed.ratings : INITIAL_STORE_DATA.ratings,
    };
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_STORE_DATA));
  }
}

function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function getLanguageName(code: LanguageCode): string {
  if (code === 'hi') return 'Hindi (Devanagari script)';
  if (code === 'kn') return 'Kannada (Kannada script)';
  return 'English (simple everyday Indian English)';
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  // Ensure initial store exists on boot
  ensureStore();

  // --- Data persistence endpoints ---
  app.get('/api/data', (_req, res) => {
    const data = ensureStore();
    res.json(data);
  });

  app.post('/api/youths', (req, res) => {
    const body = req.body as Partial<YouthProfile>;
    if (!body || !Array.isArray(body.skills) || !body.location) {
      res.status(400).json({ error: 'Skills and location are required.' });
      return;
    }
    const store = ensureStore();
    const newYouth: YouthProfile = {
      id: `youth-${Date.now()}`,
      name: (body.name || '').trim() || 'Local Worker',
      skills: body.skills.map((s) => String(s).trim()).filter(Boolean),
      education: (body.education || '').trim() || 'Not specified',
      location: body.location.trim(),
      languages: Array.isArray(body.languages)
        ? body.languages.map((l) => String(l).trim()).filter(Boolean)
        : ['Kannada'],
      expected_pay: (body.expected_pay || '').trim() || 'Negotiable',
      availability: (body.availability || '').trim() || 'Immediate',
      rawTranscript: body.rawTranscript || '',
      createdAt: new Date().toISOString(),
    };
    store.youths.unshift(newYouth);
    writeStore(store);
    res.status(201).json(newYouth);
  });

  app.post('/api/jobs', (req, res) => {
    const body = req.body as Partial<JobPosting>;
    if (!body || !body.title || !body.location) {
      res.status(400).json({ error: 'Job title and location are required.' });
      return;
    }
    const store = ensureStore();
    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      employerName: (body.employerName || '').trim() || 'Local Business',
      title: body.title.trim(),
      required_skills: Array.isArray(body.required_skills)
        ? body.required_skills.map((s) => String(s).trim()).filter(Boolean)
        : [],
      location: body.location.trim(),
      pay: (body.pay || '').trim() || 'Negotiable',
      urgency: (body.urgency || '').trim() || 'Flexible',
      language: (body.language || '').trim() || 'Kannada',
      rawInput: body.rawInput || '',
      createdAt: new Date().toISOString(),
    };
    store.jobs.unshift(newJob);
    writeStore(store);
    res.status(201).json(newJob);
  });

  app.post('/api/ratings', (req, res) => {
    const body = req.body as Partial<RatingRecord>;
    if (
      !body ||
      (body.targetType !== 'youth' && body.targetType !== 'job') ||
      !body.targetId ||
      typeof body.stars !== 'number' ||
      body.stars < 1 ||
      body.stars > 5
    ) {
      res.status(400).json({ error: 'Valid target and 1-5 star rating are required.' });
      return;
    }
    const store = ensureStore();
    const newRating: RatingRecord = {
      id: `rate-${Date.now()}`,
      targetType: body.targetType,
      targetId: body.targetId,
      reviewerRole: body.reviewerRole === 'employer' ? 'employer' : 'youth',
      reviewerName: (body.reviewerName || '').trim() || 'Community Member',
      stars: Math.round(body.stars),
      note: (body.note || '').trim() || 'Good experience.',
      createdAt: new Date().toISOString(),
    };
    store.ratings.unshift(newRating);
    writeStore(store);
    res.status(201).json(newRating);
  });

  // --- Gemini AI Endpoints ---

  // 1. Extract structured Youth Profile from spoken/typed text
  app.post('/api/ai/extract-youth', async (req, res) => {
    try {
      const { text, language = 'en' } = req.body as { text?: string; language?: LanguageCode };
      if (!text || !text.trim()) {
        res.status(400).json({ error: 'Please speak or type your details first.' });
        return;
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Extract a structured rural worker profile from this spoken/typed input:\n"${text.trim()}"`,
        config: {
          systemInstruction: `You are Udyoga Mitra, helping rural Indian youth create a simple job profile without a resume.
Extract the fields accurately from the user's input (even if spoken informally or in Kannada, Hindi, English, or mixed Hinglish/Kanglish).
All string values in the JSON response MUST be written in ${targetLang} so the user can easily verify them.
If name is not mentioned, return an empty string "".
If expected_pay is not mentioned, estimate or write "Negotiable" in ${targetLang}.
If availability is not mentioned, write "Immediate" in ${targetLang}.
If languages are not explicitly mentioned, infer likely local languages from the input language (e.g. Kannada if near Bengaluru taluks).
Keep skills concise, practical, and easy to read (2-4 words per skill).`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Person name if mentioned, otherwise empty string.' },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of practical work skills.',
              },
              education: { type: Type.STRING, description: 'Schooling or ITI/diploma level.' },
              location: { type: Type.STRING, description: 'Village, town, or taluk name.' },
              languages: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Languages spoken.',
              },
              expected_pay: { type: Type.STRING, description: 'Expected monthly or daily wage.' },
              availability: { type: Type.STRING, description: 'When they can start or shift preference.' },
            },
            required: ['name', 'skills', 'education', 'location', 'languages', 'expected_pay', 'availability'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to extract youth profile.';
      res.status(500).json({ error: message });
    }
  });

  // 2. Extract structured Job Posting from text OR handwritten photo (Gemini Vision)
  app.post('/api/ai/extract-job', async (req, res) => {
    try {
      const { text, imageBase64, mimeType, language = 'en' } = req.body as {
        text?: string;
        imageBase64?: string;
        mimeType?: string;
        language?: LanguageCode;
      };

      if ((!text || !text.trim()) && !imageBase64) {
        res.status(400).json({ error: 'Please speak, type, or upload a photo of the job note.' });
        return;
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }

      parts.push({
        text: text?.trim()
          ? `Read any attached handwritten note photo and/or this description, and extract the job details:\n"${text.trim()}"`
          : 'Read this handwritten job note photo carefully (it may be in English, Hindi, or Kannada) and extract the structured job posting.',
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction: `You are Udyoga Mitra, helping small local Indian employers (shops, clinics, garages, farms) post a job easily.
Read the handwritten note image (if provided) and/or text input.
Extract structured job fields. ALL values in the JSON response MUST be written in ${targetLang}.
Keep required_skills short and practical (e.g., 2 to 4 skills).
If employerName is not mentioned, put a helpful generic shop/business label in ${targetLang} or empty string.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              employerName: { type: Type.STRING, description: 'Shop, clinic, workshop, or farm name if stated.' },
              title: { type: Type.STRING, description: 'Clear short job title.' },
              required_skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Required practical skills.',
              },
              location: { type: Type.STRING, description: 'Village, town, landmark, or taluk.' },
              pay: { type: Type.STRING, description: 'Salary or daily wage offered.' },
              urgency: { type: Type.STRING, description: 'How soon worker is needed.' },
              language: { type: Type.STRING, description: 'Preferred spoken languages.' },
              extractedNoteText: {
                type: Type.STRING,
                description: 'Plain transcription of what was read from the handwritten note or speech.',
              },
            },
            required: ['employerName', 'title', 'required_skills', 'location', 'pay', 'urgency', 'language'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to extract job posting.';
      res.status(500).json({ error: message });
    }
  });

  // 3. Score Youth <-> Job matches (0-100) on skill overlap, distance, pay fit, language
  app.post('/api/ai/match', async (req, res) => {
    try {
      const { mode, sourceItem, candidates, language = 'en' } = req.body as {
        mode: 'youth' | 'employer';
        sourceItem: YouthProfile | JobPosting;
        candidates: Array<YouthProfile | JobPosting>;
        language?: LanguageCode;
      };

      if (!sourceItem || !Array.isArray(candidates) || candidates.length === 0) {
        res.status(400).json({ error: 'Source item and candidates are required.' });
        return;
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const prompt =
        mode === 'youth'
          ? `Score how well each JOB matches this YOUTH WORKER from 0 to 100.
YOUTH WORKER:
${JSON.stringify(sourceItem)}

CANDIDATE JOBS:
${JSON.stringify(candidates)}`
          : `Score how well each YOUTH WORKER matches this JOB POSTING from 0 to 100.
JOB POSTING:
${JSON.stringify(sourceItem)}

CANDIDATE YOUTH WORKERS:
${JSON.stringify(candidates)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: `You are Udyoga Mitra's matching engine for rural Karnataka / Bengaluru rural taluks (Doddaballapur, Devanahalli, Nelamangala, Hoskote, Magadi, Anekal, etc.).
Evaluate EVERY candidate against the source item on 4 criteria (each 0-100):
1. skill_overlap_score: How well the worker's skills cover the job's required skills.
2. distance_score: Real geographic proximity between the two rural towns/taluks near Bengaluru (same town = 90-100, adjacent taluk ~20-35km = 65-85, far side of Bengaluru = 30-55).
3. pay_fit_score: Compatibility between expected pay and offered pay.
4. language_score: Overlap in spoken languages.

Compute an overall weighted score (0-100).
Write "explanation" as a warm, 1-2 sentence plain-language reason in ${targetLang} (for example: "You match because you know mobile repair and this shop is right in Doddaballapur.").
List "missing_skills" in ${targetLang} (empty array if no skills are missing).
Return one result object for EVERY candidate using its exact "id" as "targetId", sorted from highest score to lowest.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                targetId: { type: Type.STRING },
                score: { type: Type.INTEGER },
                skill_overlap_score: { type: Type.INTEGER },
                distance_score: { type: Type.INTEGER },
                pay_fit_score: { type: Type.INTEGER },
                language_score: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                missing_skills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'targetId',
                'score',
                'skill_overlap_score',
                'distance_score',
                'pay_fit_score',
                'language_score',
                'explanation',
                'missing_skills',
              ],
            },
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '[]').trim());
      res.json({ matches: parsed });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate AI matches.';
      res.status(500).json({ error: message });
    }
  });

  // 4. Generate 3-step free Upskilling Plan for missing skills
  app.post('/api/ai/upskill', async (req, res) => {
    try {
      const { missingSkills, targetRole, currentSkills, language = 'en' } = req.body as {
        missingSkills: string[];
        targetRole: string;
        currentSkills?: string[];
        language?: LanguageCode;
      };

      if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
        res.status(400).json({ error: 'Missing skills list is required.' });
        return;
      }

      const ai = getAiClient();
      const targetLang = getLanguageName(language);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Target Job: ${targetRole}
Current Skills: ${(currentSkills || []).join(', ') || 'Entry level'}
Missing Skills to learn: ${missingSkills.join(', ')}`,
        config: {
          systemInstruction: `You are Udyoga Mitra's practical upskilling mentor for rural youth in India.
Suggest a short, free, realistic learning goal (e.g., "Learn basic Excel & UPI billing in 2 weeks") and a simple 3-step plan that someone with a smartphone or local community center can follow for free (YouTube tutorials in local language, practicing at a nearby shop, PMKVY / Skill India / Diksha free modules).
Write EVERYTHING in simple, encouraging ${targetLang}.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: 'Short 1-line learning goal with timeframe.' },
              estimated_time: { type: Type.STRING, description: 'e.g. 1-2 weeks' },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    detail: { type: Type.STRING },
                    resource_hint: { type: Type.STRING },
                  },
                  required: ['title', 'detail', 'resource_hint'],
                },
              },
            },
            required: ['summary', 'estimated_time', 'steps'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json(parsed);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate upskilling plan.';
      res.status(500).json({ error: message });
    }
  });

  // Vite dev middleware or static production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Udyoga Mitra server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
