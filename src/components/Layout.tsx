import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-slate-50 text-slate-950">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
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
