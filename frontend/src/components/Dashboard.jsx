import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.userId) {
    return <p className="text-center mt-5">Please login to view your dashboard.</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };

  const copyUserID = () => {
    navigator.clipboard.writeText(user.userId);
    alert('User ID copied to clipboard!');
  };

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
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        
        <p>
          <strong>Your Refer Code:</strong> {user.referCode}
          </p>

        
         

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
