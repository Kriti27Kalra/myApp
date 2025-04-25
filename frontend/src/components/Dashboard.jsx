import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [teamCount, setTeamCount] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEditName(user.name);
    setEditPhone(user.phone);

    const fetchTeamMembers = async () => {
      if (!user.referCode) {
        setLoading(false);
        setError('No refer code found.');
        return;
      }

      try {
        // Fetching the team members using the referCode
        const response = await fetch(`/api/teammembers/${user.referCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team details');
        }
        const data = await response.json();

        // Set the team details
        setTeamCount(data.count || 0); // Set the count of referred members
        setTeamMembers(data.members || []); // Set the array of team members
      } catch (error) {
        console.error('Error fetching team details:', error);
        setError(error.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user, navigate]);

  const copyUserID = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      alert('User ID copied to clipboard!');
    }
  };

  const viewTeamMembers = () => {
    navigate('/teammembers', { state: { teamMembers } });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!editName || !editPhone) {
      setUpdateMsg('Name and phone are required.');
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
        setIsEditing(false);
      } else {
        setUpdateMsg(data.error || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      setUpdateMsg('Something went wrong.');
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome, {user.name || 'User'}!</h2>

      <div className="card mx-auto shadow p-4" style={{ maxWidth: '500px' }}>
        <h5 className="card-title text-center mb-4">User Dashboard</h5>

        <p>
          <strong>User ID:</strong> {user.userId}
          <button className="btn btn-sm btn-outline-secondary ms-2" onClick={copyUserID}>
            Copy
          </button>
        </p>

        {!isEditing ? (
          <>
            <p><strong>Name:</strong> {user.name || 'N/A'}
            <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            </p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
          </>
        ) : (
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
            <button type="submit" className="btn btn-success btn-sm me-2">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        )}

        <p className="mt-3"><strong>Your Refer Code:</strong> {user.referCode}</p>

        {loading && <div className="text-center">Loading team details...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <p>
          <strong>Total Team Members with your Refer Code:</strong> {teamCount}
          <button className="btn btn-sm btn-outline-primary ms-2" onClick={viewTeamMembers}>
            View Team
          </button>
        </p>

        <div className="text-center mt-4">
          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
