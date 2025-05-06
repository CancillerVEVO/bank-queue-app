"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-lg text-gray-700">{error.message}</p>
        <button
            onClick={() => reset()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
            Try again
        </button>
        </div>
    );
}