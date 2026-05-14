export function parseResponse(text) {
  const planIdx = text.indexOf('STUDY_PLAN_JSON:');
  if (planIdx !== -1) {
    const jsonStr = text.slice(planIdx + 'STUDY_PLAN_JSON:'.length).trim();
    try {
      const data = JSON.parse(jsonStr);
      return { type: 'study_plan', text: text.slice(0, planIdx).trim(), data };
    } catch {}
  }

  const tsIdx = text.indexOf('TUTOR_START_JSON:');
  if (tsIdx !== -1) {
    const jsonStr = text.slice(tsIdx + 'TUTOR_START_JSON:'.length).trim();
    try {
      const data = JSON.parse(jsonStr);
      return { type: 'tutor_start', text: text.slice(0, tsIdx).trim(), data };
    } catch {}
  }

  const spIdx = text.indexOf('STUDY_PLAN_QUESTION_JSON:');
  if (spIdx !== -1) {
    const jsonStr = text.slice(spIdx + 'STUDY_PLAN_QUESTION_JSON:'.length).trim();
    try {
      const data = JSON.parse(jsonStr);
      return { type: 'study_plan_question', text: text.slice(0, spIdx).trim(), data };
    } catch {}
  }

  const qIdx = text.indexOf('QUESTION_JSON:');
  if (qIdx !== -1) {
    const jsonStr = text.slice(qIdx + 'QUESTION_JSON:'.length).trim();
    try {
      const question = JSON.parse(jsonStr);
      return { type: 'question', text: text.slice(0, qIdx).trim(), data: question };
    } catch {}
  }

  const fIdx = text.indexOf('FLASHCARD_JSON:');
  if (fIdx !== -1) {
    const jsonStr = text.slice(fIdx + 'FLASHCARD_JSON:'.length).trim();
    try {
      const flashcards = JSON.parse(jsonStr);
      return { type: 'flashcards', text: text.slice(0, fIdx).trim(), data: flashcards };
    } catch {}
  }

  return { type: 'text', text };
}

export function detectMode(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('practice question') || msg.includes('quiz me') || msg.includes('test me')) return 'Practice Questions';
  if (msg.includes('flashcard')) return 'Flashcards';
  if (msg.includes('study plan')) return 'Study Planning';
  if (msg.includes('pmbok') || msg.includes('concept') || msg.includes('explain')) return 'Concept Review';
  if (msg.includes('exam') && (msg.includes('structure') || msg.includes('format') || msg.includes('how'))) return 'Exam Overview';
  return 'General Study';
}

export function getFollowUps(parsedResponse) {
  if (parsedResponse.type === 'study_plan_question' || parsedResponse.type === 'tutor_start' || parsedResponse.type === 'study_plan') {
    return [];
  }
  if (parsedResponse.type === 'question') {
    const domain = parsedResponse.data?.domain;
    return [
      'Give me another practice question',
      domain ? `More questions from the ${domain} domain` : 'Explain the concept behind this question',
      'What are common traps on questions like this?',
    ].filter(Boolean);
  }
  if (parsedResponse.type === 'flashcards') {
    return [
      'Generate more flashcards on this topic',
      'Give me a practice question on this topic',
      'Explain the most important concept from these cards',
    ];
  }
  return [
    'Give me a practice question',
    'Generate flashcards on this topic',
    'What should I prioritize in my study plan?',
  ];
}
