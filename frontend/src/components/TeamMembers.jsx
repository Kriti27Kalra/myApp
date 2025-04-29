import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';


const TeamMembers = () => {
  const navigate = useNavigate();

  


  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const referCode = location.state?.referCode || ''; // Get refer code from location state if available

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!referCode) {
        setLoading(false);
        setError("Refer code is missing.");
        return;
      }

      try {
        const response = await fetch(`/api/teammembers/${referCode}`);
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.teamMembers || []);
        } else {
          setError("Failed to fetch team members.");
        }
      } catch (err) {
        setError("An error occurred while fetching team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [referCode]);

  return (
    <div>
        <DashboardNavbar /> {/* Add DashboardNavbar here */}

    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Team Members</h2>

      {loading && <div className="text-center">Loading...</div>}

      {error && <div className="alert alert-danger text-center">{error}</div>}

      {teamMembers.length === 0 && !loading && !error ? (
        <div className="alert alert-info text-center">
          No team members found with your refer code.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.user_id || "N/A"}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back to Dashboard
        </button>
      </div>
    </div>
    </div>


  );
};

export default TeamMembers;
