import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Shield, Lock, Eye, Cookie, Mail, ArrowLeft } from 'lucide-react';

const sections = [
  {
    icon: Lock,
    title: 'Data We Collect',
    content: 'When you use MikuAnime, we may collect minimal information required to provide our service: your watch history and watchlist are stored locally in your browser using localStorage. If you create an account, we store your email address and display name securely via Firebase Authentication.',
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    content: 'Your data is used solely to personalize your experience — remembering your watch progress, maintaining your watchlist, and saving your preferences. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
  },
  {
    icon: Cookie,
    title: 'Cookies & Local Storage',
    content: 'MikuAnime uses localStorage to persist your preferences, watch history, and watchlist. We do not use tracking cookies or third-party analytics. Firebase Authentication may set necessary cookies for session management if you create an account.',
  },
  {
    icon: Shield,
    title: 'Third-Party Services',
    content: 'MikuAnime embeds content from third-party video providers. These providers have their own privacy policies governing data collection. We also use Firebase (Google) for authentication — their privacy policy applies to that portion of our service.',
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: 'If you have questions about this privacy policy or your data, you can reach out to us. We are committed to addressing any concerns regarding your privacy and data protection.',
  },
];

export default function PrivacyPage() {
  return (
    <PageWrapper className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-glow transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-card bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
            <Shield className="w-5 h-5 text-accent-glow stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
              Privacy <span className="text-accent-glow">Policy</span>
            </h1>
            <p className="text-text-secondary text-sm font-body mt-0.5">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm font-body mt-4 leading-relaxed">
          Your privacy matters to us. This policy outlines what information we collect, how we use it, and your rights regarding your data when using MikuAnime.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="glass-card rounded-card p-5 border border-border-subtle">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-card bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-4 h-4 text-accent-glow stroke-[1.5]" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-base text-text-primary mb-1.5">{section.title}</h2>
                  <p className="text-sm text-text-secondary font-body leading-relaxed">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 rounded-card bg-elevated/50 border border-border-subtle text-center">
          <p className="text-sm text-text-muted font-body">
            We are committed to protecting your privacy. If you have any concerns, please reach out.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
