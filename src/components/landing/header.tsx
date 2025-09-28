'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoginModal } from '@/hooks/use-login-modal';
import Logo from '@/components/logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { onOpen } = useLoginModal();

  const navLinks = [
    { href: '#fonctions', label: 'Fonctions' },
    { href: '#prix', label: 'Prix' },
    { href: '#temoignages', label: 'Témoignages' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">{link.label}</a>
            ))}
            <Button onClick={onOpen} className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-colors">
              Se connecter
            </Button>
          </div>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-600 dark:text-gray-300">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">{link.label}</a>
              ))}
              <Button onClick={() => { onOpen(); setIsMenuOpen(false); }} className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition-colors text-left justify-start">
                Se connecter
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
