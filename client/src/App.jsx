import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboardcourses from './pages/dashboard-courses';
import Dashboardsettings from './pages/dashboard-settings';

import Dashboardaccount from './pages/dashboard-account';
import Dashboardstudentmanagement from './pages/dashboard-studentmanagement';
import './App.css';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup message={message} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboardcourses" element={<Dashboardcourses />} />
        <Route path="/dashboardsettings" element={<Dashboardsettings />} />
        <Route path="/dashboardaccount" element={<Dashboardaccount />} />
        <Route path="/dashboardstudentmanagement" element={<Dashboardstudentmanagement />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
