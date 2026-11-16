import type { LanguageCode } from '../types';

export const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  speechLang: string;
  aiLanguageName: string;
}[] = [
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    speechLang: 'en-IN',
    aiLanguageName: 'English',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    speechLang: 'hi-IN',
    aiLanguageName: 'Hindi',
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    speechLang: 'kn-IN',
    aiLanguageName: 'Kannada',
  },
];

export const TRANSLATIONS: Record<
  LanguageCode,
  {
    appName: string;
    tagline: string;
    navHome: string;
    navYouth: string;
    navEmployer: string;
    navMatches: string;
    navDirectory: string;
    homeSubtitle: string;
    roleYouthTitle: string;
    roleYouthDesc: string;
    roleYouthCta: string;
    roleEmployerTitle: string;
    roleEmployerDesc: string;
    roleEmployerCta: string;
    quickMatchesTitle: string;
    quickMatchesDesc: string;
    quickDirectoryTitle: string;
    quickDirectoryDesc: string;
    youthRegisteredCount: string;
    jobsPostedCount: string;
    youthPageTitle: string;
    youthPageDesc: string;
    tapToSpeak: string;
    listeningNow: string;
    tapToStop: string;
    speechUnsupported: string;
    orTypeBelow: string;
    youthPlaceholder: string;
    tryExample: string;
    youthExamples: string[];
    understandButton: string;
    analyzingText: string;
    confirmYouthHeading: string;
    confirmSubtext: string;
    fieldName: string;
    fieldNameOptional: string;
    fieldSkills: string;
    fieldSkillsHint: string;
    fieldEducation: string;
    fieldLocation: string;
    fieldLanguages: string;
    fieldExpectedPay: string;
    fieldAvailability: string;
    saveProfileBtn: string;
    savingText: string;
    profileSavedTitle: string;
    profileSavedDesc: string;
    findMyJobsBtn: string;
    createAnotherBtn: string;
    employerPageTitle: string;
    employerPageDesc: string;
    employerPlaceholder: string;
    employerExamples: string[];
    uploadHandwrittenTitle: string;
    uploadHandwrittenDesc: string;
    choosePhotoBtn: string;
    sampleNoteBtn: string;
    removePhotoBtn: string;
    understandJobBtn: string;
    confirmJobHeading: string;
    fieldEmployerName: string;
    fieldJobTitle: string;
    fieldRequiredSkills: string;
    fieldPay: string;
    fieldUrgency: string;
    fieldLanguage: string;
    saveJobBtn: string;
    jobSavedTitle: string;
    jobSavedDesc: string;
    findWorkersBtn: string;
    matchesPageTitle: string;
    matchesPageDesc: string;
    modeWorker: string;
    modeEmployer: string;
    selectYourProfile: string;
    selectYourJob: string;
    findMatchesBtn: string;
    matchingLoading: string;
    matchScoreLabel: string;
    strongMatch: string;
    goodMatch: string;
    partialMatch: string;
    scoreSkills: string;
    scoreDistance: string;
    scorePay: string;
    scoreLanguage: string;
    whyYouMatch: string;
    missingSkillsLabel: string;
    noMissingSkills: string;
    skillGapTitle: string;
    getUpskillPlanBtn: string;
    loadingPlan: string;
    freeLearningPlan: string;
    stepLabel: string;
    rateAfterWorkBtn: string;
    directoryTitle: string;
    directoryDesc: string;
    tabYouths: string;
    tabJobs: string;
    reviewsCount: string;
    noReviewsYet: string;
    leaveRatingBtn: string;
    ratingModalTitle: string;
    yourNameLabel: string;
    yourStarsLabel: string;
    yourNoteLabel: string;
    yourNotePlaceholder: string;
    submitRatingBtn: string;
    cancelBtn: string;
    backHomeBtn: string;
    errorGeneric: string;
    addSkillPlaceholder: string;
    addBtn: string;
  }
> = {
  en: {
    appName: 'Udyoga Mitra',
    tagline: 'Speak Your Skills. Find Your Work.',
    navHome: 'Home',
    navYouth: 'Find Work',
    navEmployer: 'Hire',
    navMatches: 'Matches',
    navDirectory: 'Profiles',
    homeSubtitle:
      'Connect local skills with trusted nearby shops, workshops, clinics, and farms around your taluk — just by speaking.',
    roleYouthTitle: 'I am looking for work',
    roleYouthDesc: 'Speak your skills, education, and village in your own language. No resume needed.',
    roleYouthCta: 'Speak My Skills',
    roleEmployerTitle: 'I want to hire',
    roleEmployerDesc: 'Speak your job need, type it, or take a photo of a handwritten note.',
    roleEmployerCta: 'Post a Job',
    quickMatchesTitle: 'Find Matches',
    quickMatchesDesc: 'See best nearby worker-job matches with skill gap help.',
    quickDirectoryTitle: 'Local Profiles & Trust Ratings',
    quickDirectoryDesc: 'Browse verified local workers, jobs, and star ratings.',
    youthRegisteredCount: 'local youth',
    jobsPostedCount: 'local jobs',
    youthPageTitle: 'Tell us about your work skills',
    youthPageDesc: 'Tap the big microphone and speak naturally, or type below.',
    tapToSpeak: 'Tap Microphone to Speak',
    listeningNow: 'Listening… Speak now',
    tapToStop: 'Tap to Stop',
    speechUnsupported: 'Voice mic is not supported in this browser. Please type or tap an example below.',
    orTypeBelow: 'Or type / edit what you want to say',
    youthPlaceholder:
      'Example: I passed 10th, I can repair mobile phones and know basic Tally, I live near Doddaballapur.',
    tryExample: 'Try an example:',
    youthExamples: [
      'I passed 10th, I can repair mobile phones and know basic Tally, I live near Doddaballapur and expect 12000 rupees.',
      'I know tailoring and sewing machine work, I finished 12th, I stay in Devanahalli and speak Kannada and Telugu.',
    ],
    understandButton: 'Create My Profile Card',
    analyzingText: 'Understanding your skills…',
    confirmYouthHeading: 'Did I understand this correctly?',
    confirmSubtext: 'Check each detail below. You can tap any box to fix or add information.',
    fieldName: 'Your Name',
    fieldNameOptional: 'Optional (e.g. Kiran)',
    fieldSkills: 'Skills',
    fieldSkillsHint: 'Tap × to remove or add another skill',
    fieldEducation: 'Education',
    fieldLocation: 'Village / Town',
    fieldLanguages: 'Languages Spoken',
    fieldExpectedPay: 'Expected Pay',
    fieldAvailability: 'Availability',
    saveProfileBtn: 'Yes, Save My Profile',
    savingText: 'Saving…',
    profileSavedTitle: 'Your profile is saved!',
    profileSavedDesc: 'Now let us find local jobs near you that match your skills.',
    findMyJobsBtn: 'Find Matching Jobs',
    createAnotherBtn: 'Add Another Profile',
    employerPageTitle: 'Describe the worker you need',
    employerPageDesc: 'Speak, type, or upload a photo of your handwritten job note.',
    employerPlaceholder:
      'Example: Need a helper for my mobile shop in Doddaballapur who knows phone repair and basic billing. Pay 13000 per month.',
    employerExamples: [
      'Need a helper for my clinic in Devanahalli for medicine sorting and basic Excel. Pay 12000 per month, urgent.',
      'Looking for two-wheeler mechanic helper in Doddaballapur garage. Salary 13500, Kannada needed.',
    ],
    uploadHandwrittenTitle: 'Upload handwritten note photo',
    uploadHandwrittenDesc: 'Take a picture of a paper note in English, Hindi, or Kannada',
    choosePhotoBtn: 'Upload / Take Photo',
    sampleNoteBtn: 'Try Sample Handwritten Note',
    removePhotoBtn: 'Remove Photo',
    understandJobBtn: 'Read & Create Job Card',
    confirmJobHeading: 'Did I understand this job correctly?',
    fieldEmployerName: 'Shop / Farm / Clinic Name',
    fieldJobTitle: 'Job Title',
    fieldRequiredSkills: 'Required Skills',
    fieldPay: 'Monthly / Daily Pay',
    fieldUrgency: 'How Soon Needed',
    fieldLanguage: 'Language Needed',
    saveJobBtn: 'Yes, Save Job Posting',
    jobSavedTitle: 'Job posting is saved!',
    jobSavedDesc: 'See ranked local youth near your area who fit this work.',
    findWorkersBtn: 'Find Matching Workers',
    matchesPageTitle: 'Find Matches',
    matchesPageDesc: 'AI compares skills, distance near your taluk, pay fit, and language.',
    modeWorker: 'I am a Worker',
    modeEmployer: 'I am Hiring',
    selectYourProfile: 'Choose Youth Profile',
    selectYourJob: 'Choose Job Posting',
    findMatchesBtn: 'Refresh AI Matches',
    matchingLoading: 'Comparing skills, location & pay…',
    matchScoreLabel: 'Match',
    strongMatch: 'Strong Match',
    goodMatch: 'Good Match',
    partialMatch: 'Partial Match',
    scoreSkills: 'Skills',
    scoreDistance: 'Distance',
    scorePay: 'Pay Fit',
    scoreLanguage: 'Language',
    whyYouMatch: 'Why this matches',
    missingSkillsLabel: 'Missing skills',
    noMissingSkills: 'All required skills matched',
    skillGapTitle: 'Skill gap & free learning',
    getUpskillPlanBtn: 'See 3-Step Free Learning Plan',
    loadingPlan: 'Preparing 3-step plan…',
    freeLearningPlan: 'Free 3-Step Learning Plan',
    stepLabel: 'Step',
    rateAfterWorkBtn: 'Rate after work',
    directoryTitle: 'Local Profiles & Trust Ratings',
    directoryDesc: 'Workers and local employers near Bengaluru rural taluks.',
    tabYouths: 'Youth Workers',
    tabJobs: 'Local Jobs',
    reviewsCount: 'reviews',
    noReviewsYet: 'New · No ratings yet',
    leaveRatingBtn: 'Leave Rating',
    ratingModalTitle: 'Share Trust Rating',
    yourNameLabel: 'Your Name',
    yourStarsLabel: 'Rating (1 to 5 Stars)',
    yourNoteLabel: 'Short Note',
    yourNotePlaceholder: 'e.g. Punctual, honest, paid salary on time…',
    submitRatingBtn: 'Save Rating',
    cancelBtn: 'Cancel',
    backHomeBtn: 'Back to Home',
    errorGeneric: 'Something went wrong. Please try again.',
    addSkillPlaceholder: 'Add a skill…',
    addBtn: 'Add',
  },
  hi: {
    appName: 'उद्योग मित्र',
    tagline: 'अपना कौशल बोलें। अपना काम पाएं।',
    navHome: 'होम',
    navYouth: 'काम खोजें',
    navEmployer: 'भर्ती करें',
    navMatches: 'मैच',
    navDirectory: 'प्रोफाइल',
    homeSubtitle:
      'आस-पास की दुकानों, वर्कशॉप, क्लीनिक और खेतों से जुड़ें — बस अपनी भाषा में बोलकर।',
    roleYouthTitle: 'मुझे काम चाहिए',
    roleYouthDesc: 'अपना हुनर, पढ़ाई और गांव का नाम बोलकर बताएं। किसी रिज्यूमे की जरूरत नहीं।',
    roleYouthCta: 'अपना कौशल बोलें',
    roleEmployerTitle: 'मुझे कर्मचारी चाहिए',
    roleEmployerDesc: 'बोलकर बताएं, लिखें या हाथ से लिखे नोट की फोटो अपलोड करें।',
    roleEmployerCta: 'काम पोस्ट करें',
    quickMatchesTitle: 'मैच खोजें',
    quickMatchesDesc: 'नज़दीकी काम और सही कर्मचारियों का AI मिलान देखें।',
    quickDirectoryTitle: 'स्थानीय प्रोफाइल और रेटिंग',
    quickDirectoryDesc: 'आस-पास के कामगार, नौकरियां और भरोसेमंद स्टार रेटिंग देखें।',
    youthRegisteredCount: 'स्थानीय युवा',
    jobsPostedCount: 'स्थानीय काम',
    youthPageTitle: 'अपने काम के कौशल बताएं',
    youthPageDesc: 'बड़े माइक बटन को दबाकर बोलें, या नीचे लिखें।',
    tapToSpeak: 'बोलने के लिए माइक दबाएं',
    listeningNow: 'सुन रहे हैं… अब बोलें',
    tapToStop: 'रोकने के लिए दबाएं',
    speechUnsupported: 'इस ब्राउज़र में आवाज़ रिकॉर्डिंग उपलब्ध नहीं है। कृपया नीचे लिखें या उदाहरण चुनें।',
    orTypeBelow: 'या नीचे लिखें / सुधारें',
    youthPlaceholder:
      'उदाहरण: मैंने 10वीं पास की है, मोबाइल रिपेयर और बेसिक टैली जानता हूं, डोड्डाबल्लापुर के पास रहता हूं।',
    tryExample: 'एक उदाहरण आज़माएं:',
    youthExamples: [
      'मैंने 10वीं पास की है, मोबाइल फोन रिपेयर और बेसिक टैली जानता हूं, डोड्डाबल्लापुर के पास रहता हूं, 12000 वेतन चाहिए।',
      'मुझे सिलाई मशीन और कपड़ों की नाप का काम आता है, 12वीं पास हूं, देवनहल्ली में रहती हूं।',
    ],
    understandButton: 'मेरा प्रोफाइल कार्ड बनाएं',
    analyzingText: 'आपके कौशल समझ रहे हैं…',
    confirmYouthHeading: 'क्या मैंने सही समझा?',
    confirmSubtext: 'नीचे हर जानकारी जांच लें। बदलाव करने के लिए किसी भी बॉक्स पर टैप करें।',
    fieldName: 'आपका नाम',
    fieldNameOptional: 'वैकल्पिक (जैसे किरण)',
    fieldSkills: 'कौशल (हुनर)',
    fieldSkillsHint: 'हटाने के लिए × दबाएं या नया कौशल जोड़ें',
    fieldEducation: 'पढ़ाई / शिक्षा',
    fieldLocation: 'गांव / शहर',
    fieldLanguages: 'भाषाएं',
    fieldExpectedPay: 'अपेक्षित वेतन',
    fieldAvailability: 'कब से उपलब्ध',
    saveProfileBtn: 'हां, मेरा प्रोफाइल सेव करें',
    savingText: 'सेव हो रहा है…',
    profileSavedTitle: 'आपका प्रोफाइल सेव हो गया!',
    profileSavedDesc: 'अब आपके आस-पास आपके कौशल से मिलने वाले काम खोजते हैं।',
    findMyJobsBtn: 'सही काम खोजें',
    createAnotherBtn: 'नया प्रोफाइल जोड़ें',
    employerPageTitle: 'बताएं आपको कैसा कर्मचारी चाहिए',
    employerPageDesc: 'बोलें, लिखें या हाथ से लिखे नोट की फोटो डालें।',
    employerPlaceholder:
      'उदाहरण: डोड्डाबल्लापुर में मेरी मोबाइल दुकान के लिए लड़का चाहिए जिसे फोन रिपेयर और बिलिंग आती हो। वेतन 13000।',
    employerExamples: [
      'देवनहल्ली में मेरे क्लीनिक के लिए दवाइयां छांटने और बेसिक एक्सेल जानने वाला हेल्पर चाहिए। वेतन 12000, तुरंत।',
      'डोड्डाबल्लापुर में टू-व्हीलर गैराज के लिए मैकेनिक हेल्पर चाहिए। वेतन 13500 महीना।',
    ],
    uploadHandwrittenTitle: 'हाथ से लिखे नोट की फोटो अपलोड करें',
    uploadHandwrittenDesc: 'कागज़ पर लिखे नोट की तस्वीर लें (हिंदी, कन्नड़ या अंग्रेज़ी)',
    choosePhotoBtn: 'फोटो चुनें / लें',
    sampleNoteBtn: 'सैंपल हस्तलिखित नोट आज़माएं',
    removePhotoBtn: 'फोटो हटाएं',
    understandJobBtn: 'पढ़ें और जॉब कार्ड बनाएं',
    confirmJobHeading: 'क्या मैंने काम की जानकारी सही समझी?',
    fieldEmployerName: 'दुकान / क्लीनिक / फार्म का नाम',
    fieldJobTitle: 'काम का नाम',
    fieldRequiredSkills: 'ज़रूरी कौशल',
    fieldPay: 'वेतन',
    fieldUrgency: 'कितनी जल्दी चाहिए',
    fieldLanguage: 'ज़रूरी भाषा',
    saveJobBtn: 'हां, काम पोस्ट करें',
    jobSavedTitle: 'काम की जानकारी सेव हो गई!',
    jobSavedDesc: 'अब अपने इलाके के सबसे उपयुक्त युवा उम्मीदवारों की सूची देखें।',
    findWorkersBtn: 'उपयुक्त कामगार खोजें',
    matchesPageTitle: 'सही मैच खोजें',
    matchesPageDesc: 'AI कौशल, दूरी, वेतन और भाषा के आधार पर 0 से 100 तक अंक देता है।',
    modeWorker: 'मैं काम ढूंढ रहा हूं',
    modeEmployer: 'मुझे कर्मचारी चाहिए',
    selectYourProfile: 'युवा प्रोफाइल चुनें',
    selectYourJob: 'जॉब चुनें',
    findMatchesBtn: 'AI मैच फिर से देखें',
    matchingLoading: 'कौशल, दूरी और वेतन का मिलान हो रहा है…',
    matchScoreLabel: 'मैच',
    strongMatch: 'बेहतरीन मैच',
    goodMatch: 'अच्छा मैच',
    partialMatch: 'आंशिक मैच',
    scoreSkills: 'कौशल',
    scoreDistance: 'दूरी',
    scorePay: 'वेतन',
    scoreLanguage: 'भाषा',
    whyYouMatch: 'यह क्यों सही है',
    missingSkillsLabel: 'सीखने योग्य कौशल',
    noMissingSkills: 'सभी ज़रूरी कौशल मौजूद हैं',
    skillGapTitle: 'कौशल अंतर और मुफ्त सीखना',
    getUpskillPlanBtn: '3-चरणीय मुफ्त सीखने की योजना देखें',
    loadingPlan: 'योजना बन रही है…',
    freeLearningPlan: '3-चरणीय मुफ्त सीखने की योजना',
    stepLabel: 'कदम',
    rateAfterWorkBtn: 'काम के बाद रेटिंग दें',
    directoryTitle: 'स्थानीय प्रोफाइल और भरोसेमंद रेटिंग',
    directoryDesc: 'बेंगलुरु के पास ग्रामीण तालुकों के कामगार और स्थानीय रोजगार।',
    tabYouths: 'युवा कामगार',
    tabJobs: 'स्थानीय काम',
    reviewsCount: 'समीक्षाएं',
    noReviewsYet: 'नया · अभी कोई रेटिंग नहीं',
    leaveRatingBtn: 'रेटिंग दें',
    ratingModalTitle: 'भरोसे की रेटिंग दें',
    yourNameLabel: 'आपका नाम',
    yourStarsLabel: 'रेटिंग (1 से 5 स्टार)',
    yourNoteLabel: 'छोटा अनुभव लिखें',
    yourNotePlaceholder: 'जैसे: समय पर काम किया, वेतन समय पर मिला…',
    submitRatingBtn: 'रेटिंग सेव करें',
    cancelBtn: 'रद्द करें',
    backHomeBtn: 'होम पर जाएं',
    errorGeneric: 'कुछ गड़बड़ हो गई। कृपया फिर से प्रयास करें।',
    addSkillPlaceholder: 'नया कौशल लिखें…',
    addBtn: 'जोड़ें',
  },
  kn: {
    appName: 'ಉದ್ಯೋಗ ಮಿತ್ರ',
    tagline: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ ಹೇಳಿ. ನಿಮ್ಮ ಕೆಲಸ ಪಡೆಯಿರಿ.',
    navHome: 'ಮುಖಪುಟ',
    navYouth: 'ಕೆಲಸ ಹುಡುಕಿ',
    navEmployer: 'ನೇಮಕಾತಿ',
    navMatches: 'ಹೊಂದಾಣಿಕೆ',
    navDirectory: 'ಪ್ರೊಫೈಲ್‌ಗಳು',
    homeSubtitle:
      'ನಿಮ್ಮ ತಾಲ್ಲೂಕಿನ ಅಂಗಡಿಗಳು, ವರ್ಕ್‌ಶಾಪ್‌ಗಳು, ಕ್ಲಿನಿಕ್‌ಗಳು ಮತ್ತು ತೋಟಗಳೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ — ಮಾತಿನ ಮೂಲಕ.',
    roleYouthTitle: 'ನನಗೆ ಕೆಲಸ ಬೇಕು',
    roleYouthDesc: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ, ವಿದ್ಯಾಭ್ಯಾಸ ಮತ್ತು ಊರಿನ ಹೆಸರನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಹೇಳಿ. ರೆಸ್ಯೂಮ್ ಬೇಕಿಲ್ಲ.',
    roleYouthCta: 'ಕೌಶಲ್ಯವನ್ನು ಹೇಳಿ',
    roleEmployerTitle: 'ನನಗೆ ಕೆಲಸಗಾರರು ಬೇಕು',
    roleEmployerDesc: 'ಕೆಲಸದ ವಿವರವನ್ನು ಮಾತನಾಡಿ, ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೈಬರಹದ ಚೀಟಿಯ ಫೋಟೋ ಹಾಕಿ.',
    roleEmployerCta: 'ಕೆಲಸವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿ',
    quickMatchesTitle: 'ಹೊಂದಾಣಿಕೆ ಹುಡುಕಿ',
    quickMatchesDesc: 'ಹತ್ತಿರದ ಕೆಲಸಗಳು ಮತ್ತು ಉತ್ತಮ ಕೆಲಸಗಾರರ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ.',
    quickDirectoryTitle: 'ಸ್ಥಳೀಯ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ರೇಟಿಂಗ್‌ಗಳು',
    quickDirectoryDesc: 'ಸ್ಥಳೀಯ ಕೆಲಸಗಾರರು, ಉದ್ಯೋಗಗಳು ಮತ್ತು ನಂಬಿಕೆಯ ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ನೋಡಿ.',
    youthRegisteredCount: 'ಸ್ಥಳೀಯ ಯುವಕರು',
    jobsPostedCount: 'ಸ್ಥಳೀಯ ಕೆಲಸಗಳು',
    youthPageTitle: 'ನಿಮ್ಮ ಕೆಲಸದ ಕೌಶಲ್ಯಗಳನ್ನು ತಿಳಿಸಿ',
    youthPageDesc: 'ದೊಡ್ಡ ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ, ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ.',
    tapToSpeak: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ',
    listeningNow: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ… ಈಗ ಮಾತನಾಡಿ',
    tapToStop: 'ನಿಲ್ಲಿಸಲು ಒತ್ತಿ',
    speechUnsupported: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಸೌಲಭ್ಯ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಉದಾಹರಣೆ ಆಯ್ಕೆಮಾಡಿ.',
    orTypeBelow: 'ಅಥವಾ ಕೆಳಗೆ ಟೈಪ್ / ಸರಿಪಡಿಸಿ',
    youthPlaceholder:
      'ಉದಾಹರಣೆ: ನಾನು 10ನೇ ತರಗತಿ ಪಾಸಾಗಿದ್ದೇನೆ, ಮೊಬೈಲ್ ರಿಪೇರಿ ಮತ್ತು ಬೇಸಿಕ್ ಟ್ಯಾಲಿ ಗೊತ್ತು, ದೊಡ್ಡಬಳ್ಳಾಪುರ ಹತ್ತಿರ ಇರುತ್ತೇನೆ.',
    tryExample: 'ಉದಾಹರಣೆ ಪ್ರಯತ್ನಿಸಿ:',
    youthExamples: [
      'ನಾನು 10ನೇ ತರಗತಿ ಪಾಸಾಗಿದ್ದೇನೆ, ಮೊಬೈಲ್ ರಿಪೇರಿ ಮತ್ತು ಬೇಸಿಕ್ ಟ್ಯಾಲಿ ಗೊತ್ತು, ದೊಡ್ಡಬಳ್ಳಾಪುರ ಹತ್ತಿರ ಇದ್ದೇನೆ, 12000 ಸಂಬಳ ನಿರೀಕ್ಷಿಸುತ್ತೇನೆ.',
      'ನನಗೆ ಟೈಲರಿಂಗ್ ಮತ್ತು ಹೊಲಿಗೆ ಯಂತ್ರ ಕೆಲಸ ಗೊತ್ತು, 12ನೇ ತರಗತಿ ಮುಗಿಸಿದ್ದೇನೆ, ದೇವನಹಳ್ಳಿಯಲ್ಲಿ ಇರುತ್ತೇನೆ.',
    ],
    understandButton: 'ನನ್ನ ಪ್ರೊಫೈಲ್ ಕಾರ್ಡ್ ರಚಿಸಿ',
    analyzingText: 'ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ…',
    confirmYouthHeading: 'ನಾನು ಇದನ್ನು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆಯೇ?',
    confirmSubtext: 'ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಬದಲಾವಣೆ ಬೇಕಾದರೆ ಯಾವುದೇ ಬಾಕ್ಸ್ ಒತ್ತಿ ಸರಿಪಡಿಸಿ.',
    fieldName: 'ನಿಮ್ಮ ಹೆಸರು',
    fieldNameOptional: 'ಐಚ್ಛಿಕ (ಉದಾ: ಕಿರಣ್)',
    fieldSkills: 'ಕೌಶಲ್ಯಗಳು',
    fieldSkillsHint: 'ತೆಗೆಯಲು × ಒತ್ತಿ ಅಥವಾ ಹೊಸ ಕೌಶಲ್ಯ ಸೇರಿಸಿ',
    fieldEducation: 'ವಿದ್ಯಾಭ್ಯಾಸ',
    fieldLocation: 'ಊರು / ಪಟ್ಟಣ',
    fieldLanguages: 'ತಿಳಿದಿರುವ ಭಾಷೆಗಳು',
    fieldExpectedPay: 'ನಿರೀಕ್ಷಿತ ಸಂಬಳ',
    fieldAvailability: 'ಲಭ್ಯತೆ',
    saveProfileBtn: 'ಹೌದು, ನನ್ನ ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
    savingText: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ…',
    profileSavedTitle: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗಿದೆ!',
    profileSavedDesc: 'ಈಗ ನಿಮ್ಮ ಹತ್ತಿರದ ಸೂಕ್ತ ಕೆಲಸಗಳನ್ನು ಹುಡುಕೋಣ.',
    findMyJobsBtn: 'ಹೊಂದಾಣಿಕೆಯ ಕೆಲಸಗಳನ್ನು ಹುಡುಕಿ',
    createAnotherBtn: 'ಮತ್ತೊಂದು ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ',
    employerPageTitle: 'ನಿಮಗೆ ಬೇಕಾದ ಕೆಲಸಗಾರರ ವಿವರ ನೀಡಿ',
    employerPageDesc: 'ಮಾತನಾಡಿ, ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೈಬರಹದ ಚೀಟಿಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
    employerPlaceholder:
      'ಉದಾಹರಣೆ: ದೊಡ್ಡಬಳ್ಳಾಪುರದ ನನ್ನ ಮೊಬೈಲ್ ಅಂಗಡಿಗೆ ಫೋನ್ ರಿಪೇರಿ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ ತಿಳಿದಿರುವ ಹುಡುಗ ಬೇಕು. ತಿಂಗಳಿಗೆ 13000 ಸಂಬಳ.',
    employerExamples: [
      'ದೇವನಹಳ್ಳಿಯ ನಮ್ಮ ಕ್ಲಿನಿಕ್‌ಗೆ ಔಷಧಿ ಜೋಡಿಸುವ ಮತ್ತು ಬೇಸಿಕ್ ಎಕ್ಸೆಲ್ ಬರುವ ಸಹಾಯಕರು ಬೇಕು. ಸಂಬಳ 12000, ತಕ್ಷಣ ಬೇಕು.',
      'ದೊಡ್ಡಬಳ್ಳಾಪುರ ಗ್ಯಾರೇಜ್‌ಗೆ ಟೂ-ವೀಲರ್ ಮೆಕ್ಯಾನಿಕ್ ಸಹಾಯಕ ಬೇಕು. ತಿಂಗಳಿಗೆ 13500 ಸಂಬಳ.',
    ],
    uploadHandwrittenTitle: 'ಕೈಬರಹದ ಚೀಟಿಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    uploadHandwrittenDesc: 'ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಬರೆದ ಚೀಟಿಯ ಫೋಟೋ ತೆಗೆಯಿರಿ',
    choosePhotoBtn: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ / ತೆಗೆಯಿರಿ',
    sampleNoteBtn: 'ಮಾದರಿ ಕೈಬರಹದ ಚೀಟಿ ಪ್ರಯತ್ನಿಸಿ',
    removePhotoBtn: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    understandJobBtn: 'ಓದಿ ಮತ್ತು ಜಾಬ್ ಕಾರ್ಡ್ ರಚಿಸಿ',
    confirmJobHeading: 'ನಾನು ಈ ಕೆಲಸವನ್ನು ಸರಿಯಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆಯೇ?',
    fieldEmployerName: 'ಅಂಗಡಿ / ಕ್ಲಿನಿಕ್ / ತೋಟದ ಹೆಸರು',
    fieldJobTitle: 'ಕೆಲಸದ ಹೆಸರು',
    fieldRequiredSkills: 'ಬೇಕಾದ ಕೌಶಲ್ಯಗಳು',
    fieldPay: 'ಸಂಬಳ',
    fieldUrgency: 'ಎಷ್ಟು ಬೇಗ ಬೇಕು',
    fieldLanguage: 'ಬೇಕಾದ ಭಾಷೆ',
    saveJobBtn: 'ಹೌದು, ಕೆಲಸವನ್ನು ಉಳಿಸಿ',
    jobSavedTitle: 'ಕೆಲಸದ ವಿವರ ಉಳಿಸಲಾಗಿದೆ!',
    jobSavedDesc: 'ಈ ಕೆಲಸಕ್ಕೆ ಸೂಕ್ತವಾದ ನಿಮ್ಮ ಹತ್ತಿರದ ಯುವಕರ ಪಟ್ಟಿಯನ್ನು ನೋಡಿ.',
    findWorkersBtn: 'ಸೂಕ್ತ ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ',
    matchesPageTitle: 'ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಹುಡುಕಿ',
    matchesPageDesc: 'AI ಕೌಶಲ್ಯ, ದೂರ, ಸಂಬಳ ಮತ್ತು ಭಾಷೆಯ ಆಧಾರದಲ್ಲಿ 0 ರಿಂದ 100 ಅಂಕ ನೀಡುತ್ತದೆ.',
    modeWorker: 'ನಾನು ಕೆಲಸ ಹುಡುಕುತ್ತಿದ್ದೇನೆ',
    modeEmployer: 'ನಾನು ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕುತ್ತಿದ್ದೇನೆ',
    selectYourProfile: 'ಯುವ ಪ್ರೊಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
    selectYourJob: 'ಕೆಲಸವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    findMatchesBtn: 'AI ಹೊಂದಾಣಿಕೆ ನವೀಕರಿಸಿ',
    matchingLoading: 'ಕೌಶಲ್ಯ, ದೂರ ಮತ್ತು ಸಂಬಳ ಹೋಲಿಸಲಾಗುತ್ತಿದೆ…',
    matchScoreLabel: 'ಹೊಂದಾಣಿಕೆ',
    strongMatch: 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ',
    goodMatch: 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ',
    partialMatch: 'ಭಾಗಶಃ ಹೊಂದಾಣಿಕೆ',
    scoreSkills: 'ಕೌಶಲ್ಯ',
    scoreDistance: 'ದೂರ',
    scorePay: 'ಸಂಬಳ',
    scoreLanguage: 'ಭಾಷೆ',
    whyYouMatch: 'ಏಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ',
    missingSkillsLabel: 'ಕಲಿಯಬೇಕಾದ ಕೌಶಲ್ಯಗಳು',
    noMissingSkills: 'ಎಲ್ಲಾ ಅಗತ್ಯ ಕೌಶಲ್ಯಗಳು ಹೊಂದಿಕೆಯಾಗಿವೆ',
    skillGapTitle: 'ಕೌಶಲ್ಯ ಕೊರತೆ ಮತ್ತು ಉಚಿತ ಕಲಿಕೆ',
    getUpskillPlanBtn: '3-ಹಂತದ ಉಚಿತ ಕಲಿಕಾ ಯೋಜನೆ ನೋಡಿ',
    loadingPlan: 'ಯೋಜನೆ ಸಿದ್ಧವಾಗುತ್ತಿದೆ…',
    freeLearningPlan: '3-ಹಂತದ ಉಚಿತ ಕಲಿಕಾ ಯೋಜನೆ',
    stepLabel: 'ಹಂತ',
    rateAfterWorkBtn: 'ಕೆಲಸದ ನಂತರ ರೇಟಿಂಗ್ ನೀಡಿ',
    directoryTitle: 'ಸ್ಥಳೀಯ ಪ್ರೊಫೈಲ್‌ಗಳು ಮತ್ತು ನಂಬಿಕೆ ರೇಟಿಂಗ್',
    directoryDesc: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ತಾಲ್ಲೂಕುಗಳ ಕೆಲಸಗಾರರು ಮತ್ತು ಸ್ಥಳೀಯ ಉದ್ಯೋಗಗಳು.',
    tabYouths: 'ಯುವ ಕೆಲಸಗಾರರು',
    tabJobs: 'ಸ್ಥಳೀಯ ಕೆಲಸಗಳು',
    reviewsCount: 'ವಿಮರ್ಶೆಗಳು',
    noReviewsYet: 'ಹೊಸದು · ಇನ್ನೂ ರೇಟಿಂಗ್ ಇಲ್ಲ',
    leaveRatingBtn: 'ರೇಟಿಂಗ್ ನೀಡಿ',
    ratingModalTitle: 'ನಂಬಿಕೆ ರೇಟಿಂಗ್ ಹಂಚಿಕೊಳ್ಳಿ',
    yourNameLabel: 'ನಿಮ್ಮ ಹೆಸರು',
    yourStarsLabel: 'ರೇಟಿಂಗ್ (1 ರಿಂದ 5 ಸ್ಟಾರ್)',
    yourNoteLabel: 'ಸಣ್ಣ ಅಭಿಪ್ರಾಯ',
    yourNotePlaceholder: 'ಉದಾ: ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಕೆಲಸ ಮಾಡಿದರು, ಸಂಬಳ ಸರಿಯಾಗಿ ನೀಡಿದರು…',
    submitRatingBtn: 'ರೇಟಿಂಗ್ ಉಳಿಸಿ',
    cancelBtn: 'ರದ್ದುಮಾಡಿ',
    backHomeBtn: 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    errorGeneric: 'ಏನೋ ತೊಂದರೆಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    addSkillPlaceholder: 'ಹೊಸ ಕೌಶಲ್ಯ ಸೇರಿಸಿ…',
    addBtn: 'ಸೇರಿಸಿ',
  },
};
