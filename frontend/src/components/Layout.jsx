import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-light dark:bg-dark flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-light-dark dark:bg-dark-light p-4 text-center text-sm">
        <p>© 2025 E-Procurement Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;