'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare, Mail, LayoutGrid, FileText, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: "To-Do's", href: '/', icon: CheckSquare },
  { name: 'Email', href: '/email', icon: Mail },
  { name: 'Task', href: '/tasks', icon: LayoutGrid },
  { name: 'Notes', href: '/notes', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111111] border border-[#1a1a1a] rounded-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-[280px] h-screen bg-black border-r border-[#1a1a1a] 
        flex flex-col p-6 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 mt-12 lg:mt-0">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-serif font-bold text-white">Prodly</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                    ? 'bg-[#a4fc3c] text-black font-medium'
                    : 'text-[#a1a1a1] hover:text-white hover:bg-[#1a1a1a]'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile */}
        <Link 
          href="/profile" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 p-4 rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <User size={20} className="text-[#a1a1a1]" />
          <span className="text-[#a1a1a1]">Profile</span>
        </Link>
      </div>
    </>
  );
}