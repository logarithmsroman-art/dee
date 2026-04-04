"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { LogoMark } from '@/components/global/LogoMark';
import { createBrowserClient } from '@supabase/ssr';

export function GlobalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const menuLinks = [
    { name: 'The Library', href: '/shelf', index: '01' },
    { name: 'The Journal', href: '/blog', index: '02' },
    { name: 'About Me', href: '/about', index: '03' },
    { name: 'Expertise', href: '/services', index: '04' },
    { name: 'Consultation', href: '/contact', index: '05' },
  ];

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onClick={() => setIsMenuOpen(false)}
        >
          <LogoMark size="md" />
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 items-center">
          {menuLinks.slice(0, 4).map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="/contact" 
            className="text-[10px] font-semibold text-white bg-slate-900 px-6 py-3 tracking-[0.2em] uppercase hover:bg-slate-800 transition-all" 
            style={{ borderRadius: '1px' }}
          >
            Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-900 transition-transform active:scale-90 relative z-[110]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>

        {/* Mobile Slide-out Menu - SIMPLIFIED WITHOUT FRAMER MOTION */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-[100] md:hidden flex flex-col p-10 pt-32 h-screen overflow-y-auto italic">
            <div className="relative z-10 w-full">
              <div className="text-[10px] uppercase font-semibold text-amber-600 tracking-[0.4em] mb-12 flex items-center justify-between">
                <span>Table of Contents</span>
                <button onClick={handleLogout} className="text-slate-400 hover:text-amber-600 flex items-center gap-2">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>

              <div className="flex flex-col space-y-12">
                {menuLinks.map((link, i) => (
                  <div key={link.name}>
                    <Link 
                      href={link.href} 
                      className="group flex flex-col items-start gap-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-[10px] font-serif italic text-slate-300 ml-1">{link.index}</span>
                      <span className="text-5xl font-serif text-slate-900 group-hover:text-amber-700 transition-colors leading-none tracking-tight">
                        {link.name}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pb-12 relative z-10">
              <div className="w-16 h-px bg-slate-100 mb-8" />
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-slate-400">
                Dee's Pen House -- Established Legacy
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
