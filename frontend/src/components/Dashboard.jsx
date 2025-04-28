// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';


  const Dashboard = () => {   // EditProfile.jsx mein bhi same logic lagega
    const navigate = useNavigate();
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        // Agar user localStorage me nahi mila to login page pe bhej do
        navigate('/login');
      }
    }, [navigate]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [teamCount, setTeamCount] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTeamMembers = async () => {
      if (!user.referCode) {
        setLoading(false);
        setError('No refer code found.');
        return;
      }

      try {
        const response = await fetch(`/api/teammembers/${user.referCode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team details');
        }
        const data = await response.json();

        setTeamCount(data.count || 0);
        setTeamMembers(data.members || []);
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div>
       <DashboardNavbar /> {/* Add DashboardNavbar here */}
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome, {user.name || 'User'}!</h2>

      <div className="card mx-auto shadow p-4" style={{ maxWidth: '500px' }}>
        <h5 className="card-title text-center mb-4">User Profile</h5>

        <p>
          <strong>User ID:</strong> {user.userId}
          <button className="btn btn-sm btn-outline-secondary ms-2" onClick={copyUserID}>
            Copy
          </button>
        </p>

        <p><strong>Name:</strong> {user.name || 'N/A'}
        <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </button>

        </p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>

        
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
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
    </div>


  );
};

export default Dashboard;
