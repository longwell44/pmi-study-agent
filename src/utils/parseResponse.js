// Finds the first complete JSON object in text starting from index 0.
// Returns { json: string, end: number } or null.
function extractFirstJson(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\' && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (!inString) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) return { json: text.slice(start, i + 1), end: i }; }
    }
  }
  return null;
}

export function parseResponse(text) {
  const ctIdx = text.indexOf('CONCEPT_TOPIC_JSON:');
  if (ctIdx !== -1) {
    const jsonStr = text.slice(ctIdx + 'CONCEPT_TOPIC_JSON:'.length).trim();
    try {
      const data = JSON.parse(jsonStr);
      return { type: 'concept_topic', text: text.slice(0, ctIdx).trim(), data };
    } catch {}
  }

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

  const tmIdx = text.indexOf('TUTOR_META:');
  if (tmIdx !== -1) {
    const afterTag = text.slice(tmIdx + 'TUTOR_META:'.length).trimStart();
    const result = extractFirstJson(afterTag);
    if (result) {
      try {
        const meta = JSON.parse(result.json);
        const remaining = afterTag.slice(result.end + 1).trim();
        return { type: 'tutor_scenario', text: remaining, meta };
      } catch {}
    }
  }

  const tfIdx = text.indexOf('TUTOR_FEEDBACK:');
  if (tfIdx !== -1) {
    const afterTag = text.slice(tfIdx + 'TUTOR_FEEDBACK:'.length).trimStart();
    const result = extractFirstJson(afterTag);
    if (result) {
      try {
        const data = JSON.parse(result.json);
        return { type: 'tutor_feedback', text: text.slice(0, tfIdx).trim(), data };
      } catch {}
    }
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

  const ftIdx = text.indexOf('FLASHCARD_TOPIC_JSON:');
  if (ftIdx !== -1) {
    const jsonStr = text.slice(ftIdx + 'FLASHCARD_TOPIC_JSON:'.length).trim();
    try {
      const data = JSON.parse(jsonStr);
      return { type: 'flashcard_topic', text: text.slice(0, ftIdx).trim(), data };
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
  if (msg.includes('tutor') || msg.includes('help me study')) return 'Tutor Mode';
  if (msg.includes('practice question') || msg.includes('quiz me') || msg.includes('test me')) return 'Practice Questions';
  if (msg.includes('flashcard')) return 'Flashcards';
  if (msg.includes('study plan')) return 'Study Planning';
  if (msg.includes('pmbok') || msg.includes('concept') || msg.includes('explain')) return 'Concept Review';
  if (msg.includes('exam') && (msg.includes('structure') || msg.includes('format') || msg.includes('how'))) return 'Exam Overview';
  return 'General Study';
}

const MODE_CHIPS = {
  'Practice Questions': ['Give me another question', 'Make it harder', 'Explain the PMI reasoning'],
  'Flashcards':         ['Give me more cards on this topic', 'Switch to a different topic', 'Test me on these'],
  'Tutor Mode':         ['Ask me a harder follow-up', 'Move to a different topic', 'How did I do overall?'],
  'Study Planning':     ['Adjust my timeline', 'Focus on my weak area', 'Give me a practice question for week 1'],
  'Exam Overview':      ['What does the ECO cover?', 'How is it scored?', 'Give me a practice question'],
  'Concept Review':     ['Give me an example', 'How does this show up on the exam?', 'Explain another concept'],
};

export function getFollowUps(parsedResponse, mode) {
  if (['study_plan_question', 'tutor_start', 'study_plan', 'flashcard_topic', 'concept_topic', 'tutor_scenario'].includes(parsedResponse.type)) {
    return [];
  }
  if (mode && MODE_CHIPS[mode]) return MODE_CHIPS[mode];
  return [
    'Give me a practice question',
    'Generate flashcards on this topic',
    'What should I prioritize in my study plan?',
  ];
}
