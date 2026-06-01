import React from 'react';
import { Link } from 'wouter';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12 text-center">
      <div>
        <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-secondary-900 mb-4">Page Not Found</h2>
        <p className="text-secondary-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white font-semibold hover:bg-primary-700 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
