import React, { useState } from 'react';
import { Shield, Menu, X, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Overview' },
    { id: 'detect', label: 'Detect' },
    { id: 'history', label: 'History' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#EAEAEA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Product Logo & Name */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-6 h-6 rounded flex items-center justify-center bg-[#191919] text-white">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-[#191919]">
            ScamShield
          </span>
        </button>

        {/* Centre: Minimal Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded transition-colors ${
                  isActive
                    ? 'text-[#191919] bg-[#F7F7F7]'
                    : 'text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions & Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F7F7] border border-[#EAEAEA] text-[13px] text-[#191919]">
                <UserIcon className="w-3.5 h-3.5 text-[#737373]" />
                <span className="font-medium truncate max-w-[130px]">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="flex items-center gap-1 px-2.5 py-1 text-[13px] text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7] rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-[13px] font-medium text-[#737373] hover:text-[#191919] px-3 py-1.5 rounded hover:bg-[#F7F7F7] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('detect')}
                className="px-3.5 py-1.5 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors shadow-subtle"
              >
                Start Detection
              </button>
            </div>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <button
              onClick={onOpenAuth}
              className="text-[12px] font-medium text-[#737373] hover:text-[#191919] px-2 py-1 rounded hover:bg-[#F7F7F7]"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7] rounded"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Dropdown Menu (Strictly NO sidebar, compact horizontal accordion) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-[#FFFFFF] px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-3 py-2 text-[14px] font-medium rounded ${
                activePage === link.id
                  ? 'text-[#191919] bg-[#F7F7F7]'
                  : 'text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 mt-2 border-t border-[#EAEAEA] flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between w-full px-1 py-1">
                <div className="flex items-center gap-2 text-[13px] text-[#191919] font-medium">
                  <UserIcon className="w-4 h-4 text-[#737373]" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[13px] text-[#737373] hover:text-[#991B1B] font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 pt-1">
                <button
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-3 py-2 text-[13px] font-medium text-[#191919] border border-[#EAEAEA] rounded hover:bg-[#F7F7F7]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('detect')}
                  className="w-full text-center px-3 py-2 text-[13px] font-medium bg-[#2383E2] hover:bg-[#1B6EC2] text-white rounded"
                >
                  Start Detection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
