import React from 'react';

interface JourneyGenerationLoaderProps {
  personaName: string;
}

export function JourneyGenerationLoader({ personaName }: JourneyGenerationLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-mv-text-heading">
          Generating the loan journey...
        </h2>
        <p className="text-mv-text-body leading-relaxed mb-8">
          Please wait while we are generating the loan journey for{' '}
          <span className="font-semibold text-mv-text-heading">{personaName}</span>
        </p>
        <div className="flex justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-mv-border"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-mv-green-dark absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}