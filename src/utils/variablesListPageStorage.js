const STORAGE_KEY = 'page';

export function readVariablesListPage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const n = Math.trunc(Number(raw));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function writeVariablesListPage(page) {
  try {
    const n = Math.trunc(Number(page));
    if (Number.isFinite(n) && n > 0) {
      localStorage.setItem(STORAGE_KEY, String(n));
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearVariablesListPageStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
