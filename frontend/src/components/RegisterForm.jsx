import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referCode: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate email format
    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    // Prepare the data to send to the backend
    const { name, phone, email, password, referCode } = formData;

    try {
      // Send the data to backend
      const res = await axios.post('http://localhost:5000/api/register', {
        name,
        phone,
        email,
        password,
        referCode: referCode || null  // Include referCode only if it's provided
      });

      console.log("Registration successful:", res.data.message);
      alert(res.data.message || 'Registration successful!');

      // Clear form data
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        referCode: ''
      });

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      // Check if there's a specific error message from the backend
      const errorMessage = error.response?.data?.message || 'Registration failed';
      console.error("Registration failed:", errorMessage);
      alert(errorMessage); // Display error message
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'phone', 'email'].map(field => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field[0].toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                className="form-control"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {['password', 'confirmPassword'].map(field => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field === 'confirmPassword' ? 'Confirm Password' : 'Password'}</label>
              <input
                type="password"
                name={field}
                className="form-control"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Refer Code</label>
            <input
              type="text"
              name="referCode"
              className="form-control"
              value={formData.referCode}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
