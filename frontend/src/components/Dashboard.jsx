import React from 'react';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <p className="text-center mt-5">Please login to view your dashboard.</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome, {user.name}!</h2>
      <div className="card mx-auto" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h5 className="card-title">User Profile</h5>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Refer Code:</strong> {user.refer_code}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
