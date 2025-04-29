// src/pages/EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';

const EditProfile = () => {
  const navigate = useNavigate();


  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // Loading state for update

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEditName(user.name);
    setEditPhone(user.phone);
  }, [user, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    if (!editName || !editPhone) {
      setUpdateMsg('Name and phone are required.');
      setIsUpdating(false);
      return;
    }

    try {
      const response = await fetch('/api/edit-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name: editName, phone: editPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, name: editName, phone: editPhone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setUpdateMsg('Profile updated successfully.');
        navigate('/dashboard'); // Redirect back to the dashboard
      } else {
        setUpdateMsg(data.error || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      setUpdateMsg('Something went wrong.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
       <DashboardNavbar /> {/* Add DashboardNavbar here */}
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Profile</h2>

      <div className="card mx-auto shadow p-4" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-2">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label>Phone:</label>
            <input
              type="text"
              className="form-control"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
            />
          </div>
          {updateMsg && <div className="text-info">{updateMsg}</div>}
          <button type="submit" className="btn btn-success btn-sm me-2" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default EditProfile;
