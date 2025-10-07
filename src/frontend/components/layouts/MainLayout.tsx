import React, { ReactNode } from 'react';
import Image from 'next/image';

interface MainLayoutProps {
  headerContent?: ReactNode;
  children: ReactNode;
}

export function MainLayout({ headerContent, children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-mv-bg flex items-center justify-center p-4 md:p-8">
      <main className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white h-[95vh] rounded-3xl shadow-lg flex flex-col">
        <header className="bg-white border-b border-mv-border px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between space-x-2 md:space-x-4">
            <div className="flex-shrink-0">
              <Image
                src="/moneyview-logo.png"
                alt="MoneyView"
                width={120}
                height={30}
                priority
              />
            </div>
            <div className="flex-1 flex justify-center min-w-0">
              {headerContent}
            </div>
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <div className="animate-fadeIn h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}