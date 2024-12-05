import { store, type Session } from "../stores/session.store";

class SessionService {
  private localStorageKey: string;
  wasLoaded = false;

  constructor() {
    this.localStorageKey = 'userSession';
  }

  // Obtiene el estado completo de la sesión
  getSession(): Session | undefined {
    return store.getState().session;
  }

  // Actualiza el estado completo de la sesión
  setSession(newSession: Session | undefined): void {
    store.setState({
      ...store.getState(),
      session: newSession,
    });
    this.saveSessionToLocalStorage(newSession); // Persiste en localStorage
  }

  // Suscribirse a cambios en la sesión
  subscribe(callback: (session: Session | undefined) => void): () => void {
    return store.subscribe((state) => {
      callback(state.session);
    });
  }

  // Carga la sesión desde localStorage (si existe)
  tryLoadSessionFromLocalStorage(callback?: () => void): void {
    const sessionData = localStorage.getItem(this.localStorageKey);

    if (sessionData) {
      const session: Session = JSON.parse(sessionData);
      this.setSession(session);
    }
    this.wasLoaded = true;
    console.log("[app] Session loaded from local storage");
    if (callback) {
      callback();
    }
  }

  // Limpia la sesión
  clearSession(): void {
    this.setSession(undefined);
    localStorage.removeItem(this.localStorageKey);
    console.log("[app] Session cleared");
  }

  private saveSessionToLocalStorage(session: Session | undefined): void {
    if (session) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(session));
    } else {
      localStorage.removeItem(this.localStorageKey);
    }
  }
}

// Exporta una instancia única del servicio
export const sessionService = new SessionService();
