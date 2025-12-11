// app/not-found.js
"use client"; // Mark this as a Client Component

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="mt-2 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
        <a
          href="/"
          className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}