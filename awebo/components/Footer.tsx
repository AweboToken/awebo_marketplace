import Link from 'next/link';
import {
  Share2,
  MessageCircle,
  Link as LinkIcon,
  Globe,
  Send,
  Feather,
} from 'lucide-react';

const LANDING_LINKS = [
  { title: 'Marketplace', href: '/marketplace' },
  { title: 'Drops', href: '/drops' },
  { title: 'Ecosystem', href: '/ecosystem' },
  { title: 'About', href: '/about' },
  { title: 'Content (Studio)', href: '/studio' },
  { title: 'Privacy', href: '/privacy' },
  { title: 'Terms', href: '/terms' },
];

const SOCIAL_LINKS = [
  { href: 'https://twitter.com/awebo', label: 'Twitter', icon: Share2 },
  { href: 'https://discord.gg/awebo', label: 'Discord', icon: MessageCircle },
  { href: '#', label: 'Link', icon: LinkIcon },
  { href: 'https://awebo.wtf', label: 'Website', icon: Globe },
  { href: '#', label: 'Send', icon: Send },
  { href: '#', label: 'Feed', icon: Feather },
];

type FooterVariant = 'app' | 'landing';

function FooterLinksBlock({ dark = false, showCopyright = true }: { dark?: boolean; showCopyright?: boolean }) {
  const linkClass = dark
    ? 'text-white/80 hover:text-white block duration-150'
    : 'text-gray-500 hover:text-air-force-blue block duration-150';
  const iconClass = dark ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-air-force-blue';
  const copyClass = dark ? 'text-white/70' : 'text-gray-500';

  return (
    <div className={dark ? 'py-12 md:py-16' : 'py-16 md:py-32'}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {LANDING_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {SOCIAL_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
              className={iconClass + ' block duration-150'}
            >
              <link.icon className="size-6" />
            </Link>
          ))}
        </div>

        {showCopyright && (
          <span className={'block text-center text-sm ' + copyClass}>
            © {new Date().getFullYear()} AWEBO Labs. All rights reserved.
          </span>
        )}
      </div>
    </div>
  );
}

export default function Footer({ variant = 'app' }: { variant?: FooterVariant }) {
  if (variant === 'landing') {
    return (
      <footer role="contentinfo" className="w-full border-t border-black bg-black">
        {/* Links above the big title (no copyright here) */}
        <div className="relative z-10 bg-black">
          <FooterLinksBlock dark showCopyright={false} />
        </div>

        {/* Big AWEBO title – full-bleed container, no horizontal margin */}
        <div className="relative flex min-h-[50vh] w-full max-w-full flex-col items-center justify-end overflow-hidden bg-black pb-8 pt-4 mx-0 px-0">
          <div className="absolute inset-0 cta-dither-overlay pointer-events-none" aria-hidden />
          <p
            className="footer-ascii-text relative z-10 font-rapid-response select-none leading-none text-white text-center"
            aria-hidden
          >
            AWEBO
          </p>
        </div>

        {/* Copyright in bottom gap above border */}
        <div className="bg-black py-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} AWEBO Labs. All rights reserved.
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white">
      <FooterLinksBlock />
    </footer>
  );
}
