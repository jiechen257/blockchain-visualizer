import React from 'react';
import { ThemeProvider } from "@/components/ThemeProvider"

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
                src="/logo.svg" 
                alt="Blockchain Logo" 
                className="h-10 w-10 mr-4"
              />
              <h1 className="text-3xl font-bold text-foreground">区块链可视化系统</h1>
            </div>
          </div>
        </header>
        <main>
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;