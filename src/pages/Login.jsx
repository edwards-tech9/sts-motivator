import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Dumbbell, Users } from 'lucide-react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, resetPassword } from '../services/auth';

const Login = ({ onSuccess, onDemoMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('athlete');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isForgotPassword) {
        const { error: resetError } = await resetPassword(formData.email);
        if (resetError) {
          setError(resetError);
        } else {
          setSuccess('Password reset email sent! Check your inbox.');
          setTimeout(() => setIsForgotPassword(false), 3000);
        }
      } else if (isSignUp) {
        const { user, error: signUpError } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.name,
          selectedRole
        );
        if (signUpError) {
          setError(signUpError);
        } else if (user) {
          onSuccess?.();
        }
      } else {
        const { user, error: signInError } = await signInWithEmail(
          formData.email,
          formData.password
        );
        if (signInError) {
          setError(signInError);
        } else if (user) {
          onSuccess?.();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { user, error: googleError } = await signInWithGoogle(selectedRole);
      if (googleError) {
        setError(googleError);
      } else if (user) {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-carbon-900 via-carbon-950 to-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Massive Watermark Logo Background */}
      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden="true"
      >
        <img
          src="/logo.png"
          alt=""
          className="w-[180vw] max-w-none h-auto opacity-[0.04] select-none"
          style={{
            filter: 'grayscale(20%)',
            transform: 'rotate(-12deg) scale(1.3)',
          }}
        />
      </div>

      {/* Logo */}
      <div className="mb-8 text-center relative z-10">
        <img
          src="/logo.png"
          alt="Scullin Training Systems"
          className="w-32 h-32 object-contain mx-auto mb-4"
        />
        <h1
          className="text-3xl font-black text-white tracking-tight"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          M0TIV8R
        </h1>
        <p className="text-gray-400 text-sm mt-1">Train smarter. Get stronger.</p>
      </div>

      {/* Role Selection (only for sign up) */}
      {isSignUp && !isForgotPassword && (
        <div className="w-full max-w-sm mb-6 relative z-10">
          <p className="text-gray-400 text-sm text-center mb-3">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('athlete')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedRole === 'athlete'
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-carbon-700 bg-carbon-800/50 hover:border-carbon-600'
              }`}
            >
              <Dumbbell
                size={28}
                className={selectedRole === 'athlete' ? 'text-gold-400' : 'text-gray-400'}
              />
              <span className={selectedRole === 'athlete' ? 'text-white font-semibold' : 'text-gray-400'}>
                Athlete
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('coach')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedRole === 'coach'
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-carbon-700 bg-carbon-800/50 hover:border-carbon-600'
              }`}
            >
              <Users
                size={28}
                className={selectedRole === 'coach' ? 'text-gold-400' : 'text-gray-400'}
              />
              <span className={selectedRole === 'coach' ? 'text-white font-semibold' : 'text-gray-400'}>
                Coach
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="w-full max-w-sm bg-carbon-800/50 rounded-3xl p-6 border border-gold-500/20 relative z-10">
        <h2 className="text-xl font-bold text-white text-center mb-6">
          {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && !isForgotPassword && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={isSignUp}
                className="w-full bg-carbon-900/50 border border-carbon-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-carbon-900/50 border border-carbon-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>

          {!isForgotPassword && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-carbon-900/50 border border-carbon-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          {!isSignUp && !isForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-gold-400 text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-carbon-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform shadow-gold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : isForgotPassword ? (
              'Send Reset Link'
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {!isForgotPassword && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-carbon-700" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-carbon-700" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-carbon-900/50 border border-carbon-700 text-white font-semibold py-3 rounded-xl hover:bg-carbon-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center">
          {isForgotPassword ? (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-gold-400 text-sm hover:underline"
            >
              Back to sign in
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gold-400 font-semibold hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Demo Mode Button */}
      {onDemoMode && (
        <button
          type="button"
          onClick={onDemoMode}
          className="mt-6 text-gray-400 hover:text-white text-sm underline relative z-10 transition-colors"
        >
          Continue without account (Demo Mode)
        </button>
      )}

      <p className="text-gray-500 text-xs mt-8 text-center relative z-10">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default Login;
