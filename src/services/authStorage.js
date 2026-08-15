const TOKEN_KEY = 'queueless_token';
const USER_KEY = 'queueless_user';

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function readAuthToken() {
  const storage = getStorage();
  return storage?.getItem(TOKEN_KEY) || '';
}

export function readAuthUser() {
  const storage = getStorage();
  const saved = storage?.getItem(USER_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function writeAuthSession({ token, user }) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(USER_KEY);
}
