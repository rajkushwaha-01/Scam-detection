import React, { useState } from 'react';
import { Shield, Menu, X, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'detect', label: 'Detect' },
    { id: 'history', label: 'History' },
    { id: 'landing', label: 'Overview' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#EAEAEA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Product Logo & Name */}
        <button
          onClick={() => {
            setActivePage('detect');
            setMobileMenuOpen(false);
          }}
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
                onClick={() => setActivePage(link.id)}
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
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#F7F7F7] border border-[#EAEAEA] text-[13px] text-[#191919]">
                <UserIcon className="w-3.5 h-3.5 text-[#737373]" />
                <span className="font-medium truncate max-w-[120px]">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7] rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[13px] font-medium text-[#737373] hover:text-[#191919] px-2.5 py-1.5 rounded hover:bg-[#F7F7F7] transition-colors"
            >
              Sign In
            </button>
          )}

          {activePage !== 'detect' && (
            <button
              onClick={() => setActivePage('detect')}
              className="px-3 py-1.5 bg-[#2383E2] hover:bg-[#1B6EC2] text-white text-[13px] font-medium rounded transition-colors"
            >
              Start Detection
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {activePage !== 'detect' && (
            <button
              onClick={() => setActivePage('detect')}
              className="px-2.5 py-1 bg-[#2383E2] text-white text-[12px] font-medium rounded"
            >
              Detect
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
              onClick={() => {
                setActivePage(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[14px] font-medium rounded ${
                activePage === link.id
                  ? 'text-[#191919] bg-[#F7F7F7]'
                  : 'text-[#737373] hover:text-[#191919] hover:bg-[#F7F7F7]'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 mt-2 border-t border-[#EAEAEA] flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[13px] text-[#191919] font-medium">{user.name}</span>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[13px] text-[#737373] hover:text-[#191919]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-[14px] font-medium text-[#737373] hover:text-[#191919] rounded hover:bg-[#F7F7F7]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

