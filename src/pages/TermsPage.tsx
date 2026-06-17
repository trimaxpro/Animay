import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FileText, Scale, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

const sections = [
  {
    icon: Scale,
    title: 'Acceptance of Terms',
    content: 'By accessing or using MikuAnime, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service. We reserve the right to update these terms at any time; continued use constitutes acceptance of changes.',
  },
  {
    icon: AlertCircle,
    title: 'Service Description',
    content: 'MikuAnime is a streaming aggregator that provides links to anime content hosted on third-party platforms. We do not host, upload, store, or distribute any video content on our servers. All media is embedded from external sources and we have no control over their availability or legality.',
  },
  {
    icon: Shield,
    title: 'User Responsibilities',
    content: 'You agree to use MikuAnime for personal, non-commercial entertainment purposes only. You must not attempt to bypass any technical measures, scrape the site, or use automated tools to access our service. You are responsible for complying with all applicable laws in your jurisdiction.',
  },
  {
    icon: FileText,
    title: 'Intellectual Property',
    content: 'All anime titles, images, and related media are the property of their respective owners. MikuAnime does not claim ownership of any content displayed on this site. Trademarks, logos, and brand names are used for identification purposes only.',
  },
  {
    icon: Scale,
    title: 'Limitation of Liability',
    content: 'MikuAnime is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use our service. We do not guarantee uninterrupted access, and we are not responsible for content hosted on third-party platforms.',
  },
];

export default function TermsPage() {
  return (
    <PageWrapper className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent-glow transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-card bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
            <FileText className="w-5 h-5 text-accent-glow stroke-[1.5]" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
              Terms of <span className="text-accent-glow">Service</span>
            </h1>
            <p className="text-text-secondary text-sm font-body mt-0.5">
              Last updated: June 2026
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm font-body mt-4 leading-relaxed">
          Please read these terms carefully before using MikuAnime. By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
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
            If you have any questions about these terms, please contact us.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
