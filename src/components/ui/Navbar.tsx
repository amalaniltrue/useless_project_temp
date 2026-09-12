'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tablet,
  Languages,
  Camera,
  MessageCircle,
  Heart,
  Search,
  Monitor,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'PawPad', icon: Tablet },
  { href: '/pawscript', label: 'PawScript', icon: Languages },
  { href: '/petgram', label: 'PetGram', icon: Camera },
  { href: '/pawchat', label: 'PawChat', icon: MessageCircle },
  { href: '/pawmatch', label: 'PawMatch', icon: Heart },
  { href: '/pawsearch', label: 'PawSearch', icon: Search },
];

export function Navbar() {
  const pathname = usePathname();
  const isPawOS = pathname === '/pawos';

  // If on home page (which is the iPad UI) or PawOS, hide the standard website navbar
  if (pathname === '/' || isPawOS) {
    return null;
  }

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-2.5 bg-white/85 backdrop-blur-md border-b border-amber-200 sticky top-0 z-50 shadow-xs">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🐾</span>
          <span className="text-xl font-extrabold gradient-text tracking-tight">PawLingo</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-md border border-amber-200">
            Cross-Species
          </span>
        </Link>

        {/* Center navigation links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
                }`}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side CTA: Launch PawOS */}
        <div className="flex items-center gap-2">
          <Link
            href="/pawos"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isPawOS
                ? 'bg-gray-900 text-amber-400 border border-amber-400/50'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-md hover:scale-105'
            }`}
          >
            <Monitor size={15} />
            <span>{isPawOS ? 'PawOS Active 🐾' : '🖥️ Launch PawOS'}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile bottom navbar (hidden if in PawOS for native desktop look) */}
      {!isPawOS && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-amber-200 z-50 px-1 py-1 safe-area-bottom shadow-lg">
          <div className="flex items-center justify-around">
            {[
              ...navItems,
              { href: '/pawos', label: 'PawOS', icon: Monitor },
            ].map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] transition-all ${
                    isActive
                      ? 'text-amber-600 font-bold'
                      : 'text-gray-400 hover:text-amber-500 font-medium'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-amber-500' : ''} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
