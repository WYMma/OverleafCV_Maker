import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
    return (
        <div className="h-screen bg-mesh flex flex-col overflow-hidden selection:bg-primary-100 selection:text-primary-900">
            <Navbar />
            <main className="flex-1 flex flex-col min-h-0 overflow-y-auto relative">
                <Outlet />
            </main>
        </div>
    );
};
