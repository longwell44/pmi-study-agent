const KEY = 'pmi-progress';

function createDefault() {
  return {
    questionsAttempted: 0,
    correctCount: 0,
    domains: {
      People: { attempted: 0, correct: 0 },
      Process: { attempted: 0, correct: 0 },
      'Business Environment': { attempted: 0, correct: 0 },
    },
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw);
    const def = createDefault();
    return {
      questionsAttempted: parsed.questionsAttempted ?? def.questionsAttempted,
      correctCount: parsed.correctCount ?? def.correctCount,
      domains: {
        People: parsed.domains?.People ?? def.domains.People,
        Process: parsed.domains?.Process ?? def.domains.Process,
        'Business Environment': parsed.domains?.['Business Environment'] ?? def.domains['Business Environment'],
      },
    };
  } catch {
    return createDefault();
  }
}

export function recordAnswer(domain, isCorrect) {
  const progress = loadProgress();
  progress.questionsAttempted += 1;
  if (isCorrect) progress.correctCount += 1;

  const domainKey = Object.keys(progress.domains).find(
    (k) => k.toLowerCase() === (domain ?? '').toLowerCase(),
  );
  if (domainKey) {
    progress.domains[domainKey].attempted += 1;
    if (isCorrect) progress.domains[domainKey].correct += 1;
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {}
  return progress;
}

export function getDotsFilled(domainData) {
  return Math.min(6, domainData.correct);
}

export function getStatusLabel(filled) {
  if (filled === 0) return 'Not Started';
  if (filled <= 2) return 'Beginner';
  if (filled <= 4) return 'Developing';
  return 'Intermediate';
}

const HISTORY_KEY = 'pmi-history';

function defaultHistory() {
  return { tutorSessions: 0, flashcardDecks: 0 };
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return defaultHistory();
    const parsed = JSON.parse(raw);
    return {
      tutorSessions: parsed.tutorSessions ?? 0,
      flashcardDecks: parsed.flashcardDecks ?? 0,
    };
  } catch {
    return defaultHistory();
  }
}

export function recordTutorSession() {
  const h = loadHistory();
  h.tutorSessions += 1;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {}
}

export function recordFlashcardDeck() {
  const h = loadHistory();
  h.flashcardDecks += 1;
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {}
}
