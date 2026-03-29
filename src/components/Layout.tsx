import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbfd_0%,_#eef4f7_100%)] text-slate-950">
        <header className="border-b border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <img
                src="/blockchain-logo.svg"
                alt="Blockchain Logo"
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Blockchain Learning Lab</p>
                <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">区块链协同实验室</h1>
              </div>
            </div>
            <p className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 md:inline-flex">
              任务驱动 / 主舞台解释 / 因果说明
            </p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
