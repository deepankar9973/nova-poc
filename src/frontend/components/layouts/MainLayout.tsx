import React, { ReactNode } from 'react';
import Image from 'next/image';

interface MainLayoutProps {
  headerContent?: ReactNode;
  children: ReactNode;
}

export function MainLayout({ headerContent, children }: MainLayoutProps) {
  return (
    // Sets the overall page background and font from tailwind.config.ts
    <div className="min-h-screen bg-mv-bg font-sans text-mv-text-body flex items-center justify-center p-4">
      
      {/* Main content container mimicking a phone screen */}
      <main className="w-full max-w-md bg-white min-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header Section */}
        <div className="p-4 border-b border-mv-border">
          <div className="flex justify-end mb-4">
            <Image 
              src="/moneyview-logo.png" // Path relative to the `public` folder
              alt="MoneyView Logo" 
              width={120}
              height={32} 
            />
          </div>
          {/* The UserSelector component will be rendered here */}
          {headerContent}
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-6 pt-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}