import React from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="main-content">{/* Your page content */}</main>
      </div>

    </BrowserRouter>
  )
}
