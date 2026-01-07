'use client';

import Link from 'next/link';

interface FooterProps {
  contactEmail?: string;
  headerLogo?: string;
}

export default function Footer({ contactEmail = 'contact@mojuro-manga.online', headerLogo = 'Mojuro Manga' }: FooterProps) {
  return (
    <footer className="bg-surface-primary text-text-secondary border-t border-border-default">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-text-primary">{headerLogo}</h2>
            <p className="text-sm mt-1">
              © 2025 {headerLogo} Online. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <Link href="/" className="text-text-secondary hover:text-text-primary">
              Home
            </Link>
            <Link href="/privacy-policy" className="text-text-secondary hover:text-text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-text-secondary hover:text-text-primary">
              Terms & Conditions
            </Link>
            <Link href="/dmca" className="text-text-secondary hover:text-text-primary">
              DMCA
            </Link>
            {/* # Temporary disabled until implementation
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            */}
            <a
              href={`mailto:${contactEmail}`}
              className="text-text-secondary hover:text-text-primary"
            >
              Contact
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
