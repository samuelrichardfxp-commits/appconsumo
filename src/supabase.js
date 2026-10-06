const STORAGE_KEYS = {
  user: 'equilibrio-user',
  profile: 'equilibrio-profile',
  consumption: 'equilibrio-consumption',
};

const fallbackProfile = {
  name: 'Usuário',
  email: 'usuario@equilibrio.app',
  city: 'São Paulo',
  goal: 'Entender meus hábitos',
  budget: 300,
  preferences: ['Impacto ambiental', 'Durabilidade'],
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStoredUser() {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export function saveStoredUser(user) {
  if (!isBrowser()) return user;
  window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export function clearStoredUser() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEYS.user);
}

export function getProfile() {
  if (!isBrowser()) return { ...fallbackProfile };
  const raw = window.localStorage.getItem(STORAGE_KEYS.profile);
  const base = { ...fallbackProfile, ...(raw ? JSON.parse(raw) : {}) };
  if (!base.name && getStoredUser()?.name) {
    base.name = getStoredUser().name;
  }
  if (!base.email && getStoredUser()?.email) {
    base.email = getStoredUser().email;
  }
  return base;
}

export function saveProfile(profile) {
  if (!isBrowser()) return profile;
  window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  return profile;
}

export function getConsumptionRecords() {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEYS.consumption);
  return raw ? JSON.parse(raw) : [];
}

export function saveConsumptionRecord(record) {
  if (!isBrowser()) return [];
  const records = getConsumptionRecords();
  records.unshift(record);
  window.localStorage.setItem(STORAGE_KEYS.consumption, JSON.stringify(records));
  return records;
}

export function loginUser({ name, email, password }) {
  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
    name: name || 'Usuário',
    email: email || 'usuario@equilibrio.app',
    password: password || '',
  };

  saveStoredUser(user);
  const profile = getProfile();
  profile.name = user.name;
  profile.email = user.email;
  saveProfile(profile);
  return user;
}

export function logoutUser() {
  clearStoredUser();
}
