import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import {Router, BrowserRouter } from 'react-router-dom';
import React, { useState } from 'react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
    <>
      <div className="app">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content"></main>
      </div>
    </>
   
  )
}
