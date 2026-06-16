import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center gap-3 md:gap-0">
        <p className="text-xs md:text-sm text-text-secondary md:w-1/3 text-left leading-relaxed">
          Animay does not store any files on our server. We only link to media hosted on third-party services.
        </p>
        <p className="text-sm text-text-secondary md:w-1/3 text-center">
          &copy; Animay. All rights reserved.
        </p>
        <div className="md:w-1/3 text-right flex items-center justify-end gap-3 text-xs md:text-sm text-text-secondary">
          <Link to="/terms" className="hover:text-accent-glow transition-colors flex items-center gap-1"><FileText className="w-3.5 h-3.5 stroke-[1.5]" /> Terms of Service</Link>
          <span className="text-border-subtle">|</span>
          <Link to="/privacy" className="hover:text-accent-glow transition-colors flex items-center gap-1"><Shield className="w-3.5 h-3.5 stroke-[1.5]" /> Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
