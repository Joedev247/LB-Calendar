'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useApp } from '../../lib/context';
import { useMobileNav } from '../../lib/mobileNavContext';
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  CalendarDays, 
  CheckSquare, 
  MessageSquare, 
  Settings,
  LogOut,
  Users,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useApp();
  const { isMobileMenuOpen, closeMobileMenu } = useMobileNav();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Events', href: '/events', icon: CalendarDays },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Team Chat', href: '/team-chat', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[280px] lg:w-[230px] 
        flex flex-col h-screen py-5 lg:py-4 text-white 
        bg-gradient-to-b from-[#00bf63] to-[#008c47]
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl lg:shadow-none
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between px-5 mb-15">
          <div className="relative w-45 h-16 flex-shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-5 shadow-2xl">
            <Image 
              src="/logo.png" 
              alt="LB Logo" 
              fill
              sizes="128px"
              className="object-contain p-2"
              priority
            />
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Logo - Desktop */}
        <div className="hidden lg:flex mb-10 lg:mb-6 items-center justify-center flex-shrink-0">
          <div className="relative w-40 h-16 flex-shrink-0 bg-black/30 backdrop-blur-sm rounded-lg px-6 shadow-2xl">
            <Image 
              src="/logo.png" 
              alt="LB Logo" 
              fill
              sizes="160px"
              className="object-contain p-2"
              priority
            />
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-2 lg:px-3 overflow-y-auto lg:overflow-visible lg:overflow-y-hidden hide-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-2.5 lg:gap-4 px-2.5 lg:px-3 py-2 lg:py-2.5 rounded-full transition-colors ${
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="text-sm lg:text-[15px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto lg:mt-4 bg-black/10 rounded-lg mx-4 lg:mx-3 p-2.5 lg:p-3 flex-shrink-0">
        <div className="flex items-center gap-2 lg:gap-2.5 mb-2 lg:mb-2.5">
          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-[#00a655] to-[#008c47] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] lg:text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-[11px] lg:text-sm truncate">{user?.name || 'User'}</h3>
            <p className="text-[9px] lg:text-xs text-white/80 truncate">{user?.department || user?.role || 'Member'}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            closeMobileMenu();
            logout();
          }}
          className="w-full bg-gradient-to-br from-[#FF6B6B] to-[#E55353] rounded-lg text-white py-1.5 lg:py-2 text-[10px] lg:text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5 lg:gap-2"
        >
          <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
          Logout
        </button>
        
        {/* Illustration - Hidden on desktop to save space, smaller on mobile */}
        <div className="flex justify-center lg:hidden mt-1.5">
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            {/* Person sitting */}
            <g>
              {/* Shadow */}
              <ellipse cx="50" cy="85" rx="25" ry="4" fill="#3D2F5F" opacity="0.4"/>
              
              {/* Legs */}
              <rect x="40" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              <rect x="52" y="60" width="8" height="22" rx="4" fill="#6B5A9C"/>
              
              {/* Body */}
              <rect x="38" y="40" width="24" height="24" rx="3" fill="#00a655"/>
              
              {/* Arms */}
              <rect x="30" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              <rect x="62" y="45" width="8" height="16" rx="4" fill="#D4A574"/>
              
              {/* Head */}
              <circle cx="50" cy="28" r="9" fill="#D4A574"/>
              
              {/* Hair */}
              <path d="M 42 25 Q 42 18 50 18 Q 58 18 58 25 Q 58 32 50 33 Q 42 32 42 25 Z" fill="#3D2F60"/>
              
              {/* Laptop */}
              <rect x="38" y="56" width="24" height="14" rx="2" fill="#7B6BA8"/>
              <rect x="40" y="58" width="20" height="10" rx="1" fill="#9D8DC8"/>
              
              {/* Laptop base highlight */}
              <rect x="42" y="60" width="16" height="6" rx="0.5" fill="#B8A8D8" opacity="0.5"/>
            </g>
          </svg>
        </div>
      </div>
    </aside>
    </>
  );
}


