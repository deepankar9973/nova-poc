import React from 'react'; // Essential for JSX

interface ErrorScreenProps {
  error: string;
  retry: () => void;
}

export function ErrorScreen({ error, retry }: ErrorScreenProps) {
  return (
    <div className="text-center p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-red-600 mb-4">An Error Occurred</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={retry}
        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold"
      >
        Try Again
      </button>
    </div>
  );
}