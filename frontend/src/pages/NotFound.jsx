import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="text-center py-12">
      <div className="inline-block p-6 bg-white dark:bg-dark-light rounded-lg shadow-md">
        <div className="text-6xl text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link 
          to="/dashboard" 
          className="btn-primary inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;