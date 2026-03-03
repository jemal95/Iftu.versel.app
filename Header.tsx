
import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';

interface HeaderProps {
  onNavClick: (view: string) => void;
  activeView: string;
  isLoggedIn: boolean;
  userRole?: 'student' | 'teacher' | 'admin';
  onLogout: () => void;
  onLoginClick: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  t: (key: string) => string;
  accessibilitySettings: any;
  onAccessibilityChange: (settings: any) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavClick, activeView, isLoggedIn, userRole, onLogout, onLoginClick, currentLang, onLangChange, t 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNav = (view: string) => {
    onNavClick(view);
    setIsDropdownOpen(false);
  };

  const getNavItems = () => {
    if (!isLoggedIn) return ['home', 'courses', 'news', 'about', 'locator'];
    if (userRole === 'admin') return ['admin', 'courses', 'leaderboard', 'locator'];
    if (userRole === 'teacher') return ['teacher', 'courses', 'exams', 'locator'];
    return ['home', 'courses', 'exams', 'tutor', 'performance', 'leaderboard', 'locator'];
  };

  const navItems = getNavItems();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b-8 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-28 md:h-40">
          {/* Logo Section */}
          <div className="flex items-center gap-6 cursor-pointer group" onClick={() => handleNav('home')}>
            <div className="w-16 h-16 md:w-24 md:h-24 bg-black rounded-[2rem] border-8 border-black flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,208,90,1)] group-active:translate-y-1 transition-transform">
              <span className="text-white text-4xl md:text-6xl font-black italic">I</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none group-hover:text-blue-700 transition-colors">
                IFTU <span className="text-kinetic">LMS</span>
              </h1>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Digital Hub</span>
            </div>
          </div>

          {/* Desktop Central Navigation */}
          <nav className="hidden xl:flex items-center bg-gray-50 border-8 border-black rounded-[3rem] px-10 h-24 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-6">
              {['home', 'courses', 'news', 'about'].map((v) => (
                <button 
                  key={v} 
                  onClick={() => handleNav(v)} 
                  className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all ${activeView === v ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  {t(v)}
                </button>
              ))}
            </div>
          </nav>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* Language Selector */}
            <div className="hidden md:flex gap-1 bg-gray-100 p-2 rounded-xl border-4 border-black">
              {(['en', 'am', 'om'] as Language[]).map(l => (
                <button 
                  key={l} 
                  onClick={() => onLangChange(l)} 
                  className={`px-3 py-1 rounded-lg border-2 border-black text-[9px] font-black uppercase transition-colors ${currentLang === l ? 'bg-[#FFD700]' : 'bg-white hover:bg-gray-200'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Main Action Button (Login or Identity) */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleNav(userRole === 'admin' ? 'admin' : userRole === 'teacher' ? 'teacher' : 'performance')}
                  className="hidden sm:flex h-16 px-6 bg-blue-50 text-blue-700 rounded-2xl border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-100 transition-all items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Portal Access
                </button>
                <button onClick={onLogout} className="h-16 px-6 bg-rose-50 text-rose-600 rounded-2xl border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-rose-100 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="h-16 px-8 bg-black text-white rounded-2xl border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,208,90,1)] hover:-translate-y-0.5 transition-all"
              >
                Login
              </button>
            )}

            {/* Dropdown Menu Toggle (Right side of Login) */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isDropdownOpen ? 'bg-yellow-400 translate-y-1 shadow-none' : 'bg-white hover:bg-gray-100'}`}
                aria-label="Toggle Portal Menu"
              >
                {isDropdownOpen ? '✕' : '☰'}
              </button>

              {/* Portal Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-24 w-[300px] bg-white border-8 border-black rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-scaleIn z-[1000]">
                  <div className="p-6 bg-black text-white flex justify-between items-center border-b-8 border-black">
                    <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Menu</span>
                    <span className="text-xl">🎓</span>
                  </div>
                  <div className="flex flex-col p-4 gap-2">
                    {navItems.map((v) => (
                      <button 
                        key={v} 
                        onClick={() => handleNav(v)} 
                        className={`w-full text-left px-8 py-5 rounded-2xl border-4 border-black font-black uppercase text-xs tracking-widest transition-all ${activeView === v ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-50 hover:translate-x-2'}`}
                      >
                        {t(v)}
                      </button>
                    ))}
                    
                    {/* Logged in info */}
                    {isLoggedIn && (
                      <div className="mt-4 pt-4 border-t-4 border-black/10 flex items-center gap-4 px-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-black flex items-center justify-center text-xl">👤</div>
                        <div className="leading-tight">
                          <p className="text-[9px] font-black uppercase text-gray-400">Authenticated Role</p>
                          <p className="text-xs font-black uppercase italic">{userRole}</p>
                        </div>
                      </div>
                    )}

                    {/* Quick Language Mobile */}
                    <div className="md:hidden mt-4 pt-4 border-t-4 border-black/10 flex gap-2">
                      {(['en', 'am', 'om'] as Language[]).map(l => (
                        <button key={l} onClick={() => onLangChange(l)} className={`flex-1 py-3 rounded-xl border-2 border-black text-[9px] font-black uppercase ${currentLang === l ? 'bg-[#FFD700]' : 'bg-white'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
