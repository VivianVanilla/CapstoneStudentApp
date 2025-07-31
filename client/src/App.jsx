import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboardcourses from './pages/dashboard-courses';


import Dashboardaccount from './pages/dashboard-account';
import Dashboardstudentmanagement from './pages/dashboard-studentmanagement';
import './App.css';

export default function App() {




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboardcourses" element={<Dashboardcourses />} />
        
        <Route path="/dashboardaccount" element={<Dashboardaccount />} />
        <Route path="/dashboardstudentmanagement" element={<Dashboardstudentmanagement />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
