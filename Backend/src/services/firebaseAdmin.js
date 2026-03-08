import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let firebaseApp = null;

const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    const serviceAccountPath = join(__dirname, '..', 'Firebase.secret.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    
    console.log('[Firebase Admin] Initialized successfully for project:', serviceAccount.project_id);
    return firebaseApp;
  } catch (error) {
    console.error('[Firebase Admin] Failed to initialize:', error.message);
    // Don't throw - allow app to run without Firebase for development
    return null;
  }
};

// Initialize on module load
initializeFirebase();

/**
 * Verify a Firebase ID token
 * @param {string} idToken - The ID token to verify
 * @returns {Promise<object|null>} - Decoded token or null if invalid
 */
export const verifyIdToken = async (idToken) => {
  if (!admin.apps.length) {
    console.warn('[Firebase Admin] Not initialized, skipping token verification');
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('[Firebase Admin] Token verification failed:', error.message);
    return null;
  }
};

/**
 * Get Firebase Auth instance
 * @returns {admin.auth.Auth|null}
 */
export const getAuth = () => {
  if (!admin.apps.length) {
    return null;
  }
  return admin.auth();
};

/**
 * Get user by UID from Firebase
 * @param {string} uid - Firebase user UID
 * @returns {Promise<object|null>}
 */
export const getFirebaseUser = async (uid) => {
  const auth = getAuth();
  if (!auth) return null;
  
  try {
    return await auth.getUser(uid);
  } catch (error) {
    console.error('[Firebase Admin] Get user failed:', error.message);
    return null;
  }
};

export default {
  verifyIdToken,
  getAuth,
  getFirebaseUser,
};
