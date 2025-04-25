import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import TeamMembers from './components/TeamMembers';


function App() {
  return (
    <Router>
      <Routes>
        {/* Default route for registration page */}
        <Route path="/" element={<RegisterForm />} /> 
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teammembers" element={<TeamMembers />} />

      </Routes>
    </Router>
  );
}

export default App;
