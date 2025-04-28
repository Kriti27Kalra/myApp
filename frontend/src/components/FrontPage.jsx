// src/pages/FrontPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FrontPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div 
      className="container-fluid" 
      style={{ 
        backgroundImage: 'url("/images/image2.jpg")', 
        backgroundSize: 'cover', 
        minHeight: '100vh', 
        color: '#fff', 
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' // added text-shadow for better visibility
      }}
    >
      <div className="row align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="col-md-6 text-center">
          <h1 className="display-4 mb-4">Welcome to Our Platform</h1>
          <p className="lead mb-4" style={{ fontSize: '1.25rem' }}>The best place to manage your profile, refer your friends, and more!</p>
          <div className="d-flex justify-content-center">
            <button onClick={goToRegister} className="btn btn-primary btn-lg mx-2">
              Register
            </button>
            <button onClick={goToLogin} className="btn btn-secondary btn-lg mx-2">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
