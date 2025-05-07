import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from '../../stylings/UserPolicies.module.css';
import { useNavigate } from 'react-router-dom';

const UserPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getPoliciesUrl = import.meta.env.VITE_GET_POLICIES_URL;

  const handleFileClaim = (policyId) => {
    navigate(`/file-claim/${policyId}`);
  };

  const handlePayNow = (policyId) => {
    navigate(`/user/payment/${policyId}`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return styles.statusActive;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast.error('No user ID found. Please log in first.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${getPoliciesUrl}/user/${userId}`);
        setPolicies(response.data);
        toast.success('Policies fetched successfully!');
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch policies. Please try again later.');
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [getPoliciesUrl]);

  if (loading) {
    return (
      <div className={styles.policiesContainer}>
        <h1 className={styles.policiesTitle}>My Policies</h1>
        <div className={styles.loadingMessage}>Loading policies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.policiesContainer}>
        <h1 className={styles.policiesTitle}>My Policies</h1>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Policies</h1>
      {policies.length === 0 ? (
        <div className={styles.noPoliciesMessage}>No policies found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.policiesTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Policy ID</th>
                <th>Vehicle</th>
                <th>Start Date (mm/dd/yyyy)</th>
                <th>End Date (mm/dd/yyyy)</th>
                <th>Premium</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((item) => (
                <tr key={item.policy.policyID}>
                  <td>{item.policy.policyID}</td>
                  <td>{item.registrationNumber} ({item.model})</td>
                  <td>{new Date(item.policy.startDate).toLocaleDateString()}</td>
                  <td>{new Date(item.policy.endDate).toLocaleDateString()}</td>
                  <td>{item.policy.premiumAmount}</td>
                  <td>{item.policy.coverageDetails}</td>
                  <td>
                    <span className={`${styles.policyStatus} ${getStatusColor(item.policy.status)}`}>
                      {item.policy.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.buttonGroup}>
                      {item.policy.status.toLowerCase() === 'active' ? (
                        <div className={styles.buttonStack}>
                          <button
                            className={styles.policyButton}
                            onClick={() => handleFileClaim(item.policy.policyID)}
                            data-action="claim"
                          >
                            File Claim
                          </button>
                          <button
                            className={`${styles.policyButton} ${styles.greenButton}`}
                            onClick={() => handlePayNow(item.policy.policyID)}
                            data-action="renew"
                          >
                            Next Payment
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`${styles.policyButton} ${styles.greenButton}`}
                          onClick={() => handlePayNow(item.policy.policyID)}
                          data-action="pay"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPolicies;