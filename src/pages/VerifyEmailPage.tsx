import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const { sendVerificationEmail } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setError('');
    try {
      await sendVerificationEmail();
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Mail className="w-12 h-12 mx-auto text-accent-primary mb-4" />
        <h1 className="font-display font-bold text-2xl text-text-primary mb-3">Verify your email</h1>
        <p className="text-sm text-text-secondary mb-6">
          We sent a verification email. Click the link in the email to activate your account.
        </p>
        {sent && <p className="text-xs text-accent-primary mb-4">Verification email sent! Check your inbox.</p>}
        {error && <p className="text-xs text-accent-rose mb-4">{error}</p>}
        <Button onClick={handleResend} variant="secondary" size="md" className="w-full mb-3">Resend email</Button>
        <Link to="/signin" className="block text-sm text-accent-glow hover:underline">Go to sign in</Link>
      </div>
    </div>
  );
}
