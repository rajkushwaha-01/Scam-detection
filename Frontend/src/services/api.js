// API client for ScamShield backend

const API_BASE = '/api';

/**
 * Analyzes an incident message and/or uploaded screenshot or audio file.
 * @param {Object} params
 * @param {string} [params.message]
 * @param {File} [params.screenshot]
 * @param {File} [params.audio]
 */
export async function analyzeIncident({ message, screenshot, audio }) {
  const formData = new FormData();

  if (message && message.trim()) {
    formData.append('message', message.trim());
  }
  if (screenshot) {
    formData.append('screenshot', screenshot);
  }
  if (audio) {
    formData.append('audio', audio);
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Analysis failed. Please check your inputs and try again.');
  }

  return data;
}

/**
 * Generates an official incident case file for cybercrime / bank reporting.
 * Valid when money was lost (incident_stage === 'MONEY_LOST').
 * @param {Object} payload { analysis, user, language }
 */
export async function generateCaseFile(payload) {
  const response = await fetch(`${API_BASE}/casefile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Failed to generate case file.');
  }

  return data;
}

/**
 * Registers a new user.
 */
export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Registration failed.');
  }

  return data;
}

/**
 * Logs in an existing user.
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Invalid email or password.');
  }

  return data;
}

/**
 * Logs out the current user by clearing the auth cookie on the server.
 */
export async function logoutUser() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('Logout request failed:', err);
  }
}

/**
 * Fetches current authenticated user profile.
 */
export async function fetchCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Checks backend health.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

