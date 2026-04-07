const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

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
    throw new Error(error.message || 'Network error');
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
