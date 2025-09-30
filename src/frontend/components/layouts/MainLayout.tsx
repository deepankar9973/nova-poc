import React, { ReactNode } from 'react';
import Image from 'next/image';

interface MainLayoutProps {
  headerContent?: ReactNode;
  children: ReactNode;
  showLogo?: boolean;
  isLoading?: boolean; // Added to show loading states during LLM responses
}

export function MainLayout({ 
  headerContent, 
  children, 
  showLogo = true,
  isLoading = false 
}: MainLayoutProps) {
  return (
    // Main container with MoneyView background
    <div className="min-h-screen bg-mv-bg flex items-center justify-center p-4">
      {/* Mobile-first container with improved responsive design */}
      <main className="w-full max-w-md bg-white min-h-screen md:min-h-[95vh] md:rounded-3xl shadow-lg flex flex-col relative">
        {/* Loading overlay for LLM responses */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
            <div className="animate-pulse text-emerald-700">
              {/* Add your loading spinner/indicator here */}
              Loading...
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="bg-white border-b border-mv-border px-5 py-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            {/* Left slot - can be used for back button or other controls */}
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Back button or other controls can be injected here */}
            </div>
            
            {/* Logo - centered */}
            {showLogo && (
              <div className="flex-1 flex justify-center">
                <Image 
                  src="/moneyview-logo.png"
                  alt="MoneyView"
                  width={140}
                  height={36}
                  className="h-8 w-auto transition-opacity hover:opacity-90"
                  priority
                />
              </div>
            )}
            
            {/* Right slot - can be used for help/menu */}
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Help/menu button can be injected here */}
            </div>
          </div>
          
          {/* Dynamic header content - typically PersonaSelector or journey progress */}
          {headerContent && (
            <div className="mt-2 animate-fadeIn">
              {headerContent}
            </div>
          )}
        </header>

        {/* Main scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="px-5 py-6">
            {/* Main content - typically DynamicStepRenderer */}
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </div>

        {/* Optional footer area if needed */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-mv-border">
          {/* Footer content can be added here */}
        </div>
      </main>
    </div>
  );
}

// Add these animations to your tailwind.config.js
const tailwindConfig = {
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};