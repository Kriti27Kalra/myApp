import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import TeamMembers from './components/TeamMembers';
import EditProfile from './components/EditProfile';
import FrontPage from './components/FrontPage';
import './style.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  return (
    <Router>
      <Routes>
        {/* Default route for registration page */}
        <Route path="/" element={<FrontPage />} />
        <Route path="/register" element={<RegisterForm />} /> 
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teammembers" element={<TeamMembers />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        

      </Routes>
    </Router>
  );
}

export default App;
