import { verifyIdToken } from '../services/firebaseAdmin.js';

/**
 * Firebase Authentication Middleware
 * Verifies the Firebase ID token in the Authorization header
 * Sets req.user with the decoded token data
 */
export const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];
  
  if (!idToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No token provided',
    });
  }

  try {
    const decodedToken = await verifyIdToken(idToken);
    
    if (!decodedToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      isAnonymous: decodedToken.provider_id === 'anonymous',
      firebase: decodedToken,
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error.message);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed',
    });
  }
};

/**
 * Optional Firebase Authentication Middleware
 * Attempts to verify token but doesn't block if missing/invalid
 * Sets req.user if valid, otherwise req.user = null
 */
export const optionalFirebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];
  
  if (!idToken) {
    req.user = null;
    return next();
  }

  try {
    const decodedToken = await verifyIdToken(idToken);
    
    if (decodedToken) {
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        emailVerified: decodedToken.email_verified || false,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
        isAnonymous: decodedToken.provider_id === 'anonymous',
        firebase: decodedToken,
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};

export default firebaseAuth;
