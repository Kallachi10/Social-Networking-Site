import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* This is the login page */}
        <Route path="/home" element={<HomePage />} /> {/* This is the home page */}
      </Routes>
    </Router>
  );
}

export default App;
