import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { ModernHeader } from '../ModernHeader';
import { MobileBottomNav } from '../MobileBottomNav';
import { SearchModal } from '../SearchModal';
import { CommandPalette } from '../CommandPalette';
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';

interface AppShellProps {
  children: React.ReactNode;
  onGoToAdmin: () => void;
  onOpenSeoInspector?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  onGoToAdmin,
  onOpenSeoInspector
}) => {
  const {
    lang,
    setLang,
    darkMode,
    toggleDarkMode,
    setActiveTab,
    setFilters,
    setIsCartDrawerOpen,
    activeFestival,
    openFestivalPage
  } = useStore();

  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Key chord tracking for Linear-style navigation (e.g. 'G' then 'S')
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState<number>(0);

  // Global Keyboard Shortcuts Listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore key shortcuts if user is typing inside an input/textarea/select
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // ⌘K / Ctrl+K Command Palette (always allowed)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // ⌘F / /: Search Modal
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchModalOpen(true);
        return;
      }

      if (isInput) return;

      // ESC: Close open modals
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
        setIsSearchModalOpen(false);
        return;
      }

      // '?' for shortcuts
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsModalOpen(prev => !prev);
        return;
      }

      // 'T' for toggle theme
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleDarkMode();
        return;
      }

      // 'L' for switch language
      if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setLang(lang === 'fa' ? 'en' : 'fa');
        return;
      }

      // 'G' prefix navigation combinations
      const now = Date.now();
      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        const key = e.key.toLowerCase();
        if (key === 's') {
          e.preventDefault();
          setFilters(prev => ({ ...prev, onSaleOnly: false, selectedCategory: 'all' }));
          setActiveTab('shop');
          setLastKey(null);
          return;
        } else if (key === 'd') {
          e.preventDefault();
          setFilters(prev => ({ ...prev, onSaleOnly: true, selectedCategory: 'all' }));
          setActiveTab('shop');
          setLastKey(null);
          return;
        } else if (key === 'f') {
          e.preventDefault();
          openFestivalPage(activeFestival || undefined);
          setLastKey(null);
          return;
        } else if (key === 'c') {
          e.preventDefault();
          setIsCartDrawerOpen(true);
          setLastKey(null);
          return;
        } else if (key === 'w') {
          e.preventDefault();
          setActiveTab('wishlist');
          setLastKey(null);
          return;
        } else if (key === 'a') {
          e.preventDefault();
          setActiveTab('account');
          setLastKey(null);
          return;
        } else if (key === 'm') {
          e.preventDefault();
          onGoToAdmin();
          setLastKey(null);
          return;
        }
      }

      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
        setLastKey('g');
        setLastKeyTime(now);
      }
    },
    [
      lastKey,
      lastKeyTime,
      toggleDarkMode,
      setLang,
      lang,
      setFilters,
      setActiveTab,
      openFestivalPage,
      activeFestival,
      setIsCartDrawerOpen,
      onGoToAdmin
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-150 antialiased selection:bg-[#62DB00]/30 selection:text-black">
      {/* Modern Flagship Header with Glass Blur & Mega Menu */}
      <ModernHeader
        onGoToAdmin={onGoToAdmin}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenSeoInspector={onOpenSeoInspector}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-x-hidden pb-16 md:pb-0 focus:outline-none">
        {children}
      </main>

      {/* Mobile Bottom Thumb Navigation */}
      <MobileBottomNav
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onGoToAdmin={onGoToAdmin}
      />

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onGoToAdmin={onGoToAdmin}
        onOpenSeoInspector={onOpenSeoInspector}
      />

      {/* Keyboard Shortcuts Cheatsheet (?) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
};
