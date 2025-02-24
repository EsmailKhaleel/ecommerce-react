import React from 'react';
import NavBar from '../Components/NavBar/NavBar';
import Footer from '../Components/Footer/Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-600">
      <NavBar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />

    </div>
  )
}

export default Layout;
