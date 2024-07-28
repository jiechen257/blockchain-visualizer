import React from 'react';
import { ThemeProvider } from "@/components/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <img 
                src="/blockchain-logo.svg" 
                alt="Blockchain Logo" 
                className="h-8 w-8 mr-4 sm:h-10 sm:w-10"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">区块链可视化系统</h1>
            </div>
          </div>
        </header>
        <main className="py-6">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;