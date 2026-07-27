/* STORAGE — leitura/escrita em localStorage. Só é chamado do
   cliente (dentro de useEffect ou handlers), nunca durante SSR. */

export const PC_KEY = "valon-hub-prestacao-v1";
export const SESSION_KEY = "valon_hub_session";

export function loadDB() {
  try {
    const d = JSON.parse(localStorage.getItem(PC_KEY));
    if (d && Array.isArray(d.relatorios)) return d;
  } catch (e) {}
  return { seq: 0, relatorios: [] };
}

export function saveDB(db) {
  localStorage.setItem(PC_KEY, JSON.stringify(db));
}

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
