'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  await signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<any> {
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<any> {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Google sign-in with a popup. */
export function initiateGoogleSignIn(authInstance: Auth): Promise<any> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(authInstance, provider);
}

/** Initiate Apple sign-in with a popup. */
export function initiateAppleSignIn(authInstance: Auth): Promise<any> {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(authInstance, provider);
}

/** Initiate Instagram (via Facebook) sign-in with a popup. */
export function initiateInstagramSignIn(authInstance: Auth): Promise<any> {
    const provider = new FacebookAuthProvider();
    // Firebase uses the Facebook provider for Instagram login
    return signInWithPopup(authInstance, provider);
}
