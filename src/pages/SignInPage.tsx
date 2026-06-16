import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, LogIn, Tv, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { DotPattern } from '@/components/ui/DotPattern';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

export default function SignInPage() {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <DotPattern opacity={0.3} />

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-elevated border border-border-subtle mb-4 shadow-glow-sm">
            <Tv className="w-8 h-8 text-accent-glow" />
          </div>
          <h1 className="font-display font-bold text-3xl text-text-primary tracking-tight">
            Welcome back
          </h1>
          <p className="text-text-secondary mt-2 text-sm font-body">
            Sign in to continue watching your favorite anime
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-modal p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-label font-medium text-text-secondary uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[1.5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-surface border border-border-subtle rounded-input pl-10 pr-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted font-body transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-border-glow focus:border-accent-primary focus:shadow-glow-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-label font-medium text-text-secondary uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[1.5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-surface border border-border-subtle rounded-input pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted font-body transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-border-glow focus:border-accent-primary focus:shadow-glow-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-accent-rose bg-accent-rose/10 border border-accent-rose/20 rounded-input px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-elevated px-3 text-text-muted font-label">or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleGoogle}
              variant="secondary"
              size="md"
              className="w-full"
              disabled={isLoading}
            >
              <GoogleIcon />
              <span>Google</span>
            </Button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-muted font-body">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-accent-glow hover:text-accent-primary transition-colors font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {[
            { icon: Tv, label: 'Stream HD' },
            { icon: Sparkles, label: 'Free Forever' },
            { icon: Shield, label: 'Secure' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-text-muted">
              <Icon className="w-3.5 h-3.5" />
              <span className="text-xs font-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
