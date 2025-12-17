import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            <Navbar />
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                <Outlet />
            </div>
        </div>
    );
};
