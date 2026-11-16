export type LanguageCode = 'en' | 'hi' | 'kn';

export type AppView = 'home' | 'youth' | 'employer' | 'matches' | 'directory';

export interface YouthProfile {
  id: string;
  name: string;
  skills: string[];
  education: string;
  location: string;
  languages: string[];
  expected_pay: string;
  availability: string;
  rawTranscript?: string;
  createdAt: string;
}

export interface JobPosting {
  id: string;
  employerName?: string;
  title: string;
  required_skills: string[];
  location: string;
  pay: string;
  urgency: string;
  language: string;
  rawInput?: string;
  createdAt: string;
}

export interface MatchResult {
  targetId: string;
  score: number;
  skill_overlap_score: number;
  distance_score: number;
  pay_fit_score: number;
  language_score: number;
  explanation: string;
  missing_skills: string[];
}

export interface UpskillStep {
  title: string;
  detail: string;
  resource_hint: string;
}

export interface UpskillPlan {
  summary: string;
  estimated_time: string;
  steps: UpskillStep[];
}

export interface RatingRecord {
  id: string;
  targetType: 'youth' | 'job';
  targetId: string;
  reviewerRole: 'employer' | 'youth';
  reviewerName: string;
  stars: number;
  note: string;
  createdAt: string;
}

export interface StoreData {
  youths: YouthProfile[];
  jobs: JobPosting[];
  ratings: RatingRecord[];
}
