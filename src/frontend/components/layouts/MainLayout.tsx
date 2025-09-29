import React, { ReactNode } from 'react';
// Assume you have the MoneyView logo SVG. Place it in your `public` folder.
import Image from 'next/image';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side can be empty or have a title */}
            <div className="w-1/3"></div>
            
            {/* Center content will be passed as children to the Header */}
            <div className="w-1/3 flex justify-center">
              {/* This is where the UserSelector will go */}
            </div>

            {/* Right side for the logo */}
            <div className="w-1/3 flex justify-end">
              <Image 
               src="/moneyview-logo.png" // Path is relative to the `public` folder
               alt="MoneyView Logo" 
               width={150} 
               height={40} 
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl p-4">
          {children}
        </div>
      </main>
    </div>
  );
}