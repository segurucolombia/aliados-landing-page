import type { FirebaseApp } from 'firebase/app';

/**
 * Firebase solo se usa para "Entrar con Google". Se carga perezosamente para no
 * sumar el SDK al bundle de las páginas que no lo usan.
 */
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado = (): boolean =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

let app: FirebaseApp | null = null;

const obtenerApp = async (): Promise<FirebaseApp> => {
  if (app) return app;
  const { initializeApp, getApps } = await import('firebase/app');
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
};

/** La persona cerró o canceló el popup: no es un error que haya que mostrar */
export class PopupCerradoError extends Error {
  constructor() {
    super('Popup de Google cerrado');
    this.name = 'PopupCerradoError';
  }
}

const CODIGOS_POPUP_CERRADO = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled'];

export interface ResultadoGoogle {
  idToken: string;
  email: string | null;
}

/**
 * Abre el popup de Google y entrega el ID token de Firebase. La sesión de Firebase
 * se cierra en el `finally` que use el llamador (`cerrarSesionGoogle`): la landing
 * solo usa Firebase para obtener el token, la sesión real es la del backend.
 */
export const obtenerTokenGoogle = async (): Promise<ResultadoGoogle> => {
  if (!firebaseConfigurado()) {
    throw new Error('El inicio de sesión con Google no está disponible en este momento.');
  }
  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const auth = getAuth(await obtenerApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const { user } = await signInWithPopup(auth, provider);
    const idToken = await user.getIdToken();
    return { idToken, email: user.email };
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code && CODIGOS_POPUP_CERRADO.includes(code)) throw new PopupCerradoError();
    if (code === 'auth/popup-blocked') {
      throw new Error('Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes e intenta de nuevo.');
    }
    throw new Error('No pudimos conectar con Google. Intenta de nuevo.');
  }
};

export const cerrarSesionGoogle = async (): Promise<void> => {
  if (!app) return;
  try {
    const { getAuth, signOut } = await import('firebase/auth');
    await signOut(getAuth(app));
  } catch {
    // no importa: la sesión de la landing no depende de Firebase
  }
};
