import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.18),_transparent_32%),linear-gradient(180deg,_#f8fbfd_0%,_#eef4f7_100%)] text-slate-950">
        <header className="border-b border-white/60 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <img
                src="/blockchain-logo.svg"
                alt="Blockchain Logo"
                className="mr-4 h-8 w-8 sm:h-10 sm:w-10"
              />
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">区块链可视化系统</h1>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
