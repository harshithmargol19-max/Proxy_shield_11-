import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInAnonymousUser, loading, error } = useAuth();
  const [localError, setLocalError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLocalError(null);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setLocalError(null);
      await signInAnonymousUser();
      navigate('/');
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in anonymously');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ProxyShield</h1>
          <p className="text-gray-400">Secure Identity Management Platform</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Sign in to continue
          </h2>

          {/* Error Display */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{displayError}</p>
            </div>
          )}

          {/* Sign In Options */}
          <div className="space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-800 border-t-transparent" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-gray-400">or</span>
              </div>
            </div>

            {/* Anonymous Sign In */}
            <button
              onClick={handleAnonymousSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Continue as Guest
                </>
              )}
            </button>
          </div>

          {/* Info Text */}
          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Protected by ProxyShield Security
        </p>
      </div>
    </div>
  );
};

export default SignIn;
