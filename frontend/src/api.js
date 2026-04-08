const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

const offlineFallbacks = {
  '/resources': [
    {
      id: '1',
      title: 'Understanding Anxiety',
      summary: 'Learn coping strategies and techniques to manage anxiety in daily life.',
      url: 'https://example.com/anxiety',
    },
    {
      id: '2',
      title: 'Sleep Hygiene Guide',
      summary: 'Improve sleep quality with evidence-based practices and routines.',
      url: 'https://example.com/sleep',
    },
    {
      id: '3',
      title: 'Mindfulness for Stress Relief',
      summary: 'Explore meditation and mindfulness techniques to reduce stress.',
      url: 'https://example.com/mindfulness',
    },
  ],
  '/games': [
    {
      id: '1',
      title: 'Memory Match',
      category: 'puzzle',
      description: 'Improve focus and recall with this quick matching game.',
      instructions: 'Tap the cards to match pairs and keep your brain sharp.',
      action: '/games/memory-match',
    },
    {
      id: '2',
      title: 'Word Scramble',
      category: 'puzzle',
      description: 'Solve a quick scramble and exercise your brain.',
      instructions: 'Rearrange the letters into the correct word.',
      action: '/games/word-scramble',
    },
    {
      id: '3',
      title: 'Comedy Quiz',
      category: 'comedy',
      description: 'Answer silly questions in a quick comedy challenge.',
      instructions: 'Pick the funniest answer and see how many you get right.',
      action: '/games/comedy-quiz',
    },
  ],
  '/therapy': [
    {
      id: '1',
      title: 'Cognitive Behavioral Therapy Basics',
      instructor: 'Dr. Sarah Miller',
      description: 'Learn essential CBT techniques for managing negative thoughts.',
      schedule: 'Mondays 3 PM',
      duration: '60 min',
      capacity: 30,
      enrolled: 12,
    },
    {
      id: '2',
      title: 'Stress Management Workshop',
      instructor: 'James Chen',
      description: 'Practical tools to reduce stress and improve resilience.',
      schedule: 'Wednesdays 4 PM',
      duration: '45 min',
      capacity: 25,
      enrolled: 18,
    },
  ],
  '/jokes': [
    {
      id: '1',
      title: 'Why Did the Student Bring a Ladder?',
      description: 'To reach high academic standards!',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2 min',
    },
    {
      id: '2',
      title: 'The Procrastination Song',
      description: 'A hilarious take on student life and deadlines.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3 min',
    },
  ],
  '/groups': [
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'Connect with peers facing similar anxiety challenges.',
      schedule: 'Tuesdays 6 PM',
    },
    {
      id: '2',
      name: 'Academic Pressure Peer Group',
      description: 'Discuss school stress and strategies for balance.',
      schedule: 'Thursdays 7 PM',
    },
  ],
};

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Request failed');
    }

    return response.status === 204 ? null : response.json();
  } catch (error) {
    const message = error.message || 'Network error';
    if (message.toLowerCase().includes('failed to fetch') && offlineFallbacks[path]) {
      console.warn(`API unavailable, using offline fallback for ${path}`);
      return offlineFallbacks[path];
    }
    throw new Error(message);
  }
}

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getResources() {
  return request('/resources');
}

export function bookSession(payload) {
  return request('/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getGroups() {
  return request('/groups');
}

export function joinGroup(groupId, userId) {
  return request(`/groups/${groupId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function getTherapyClasses() {
  return request('/therapy');
}

export function enrollTherapyClass(classId, userId) {
  return request(`/therapy/${classId}/enroll`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function getJokes() {
  return request('/jokes');
}

export function getGames() {
  return request('/games');
}

export function trackMood(payload) {
  return request('/moods', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getUserMoods(userId) {
  return request(`/moods/user/${userId}`);
}
