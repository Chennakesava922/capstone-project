import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from '../../stylings/PaymentHistory.module.css';

const UserPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          toast.error('No user ID found. Please log in first.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8187/api/payments/user/${userId}`);
        setPayments(response.data);
        console.log(response.data);
        toast.success('Payment history loaded successfully!');
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to fetch payment history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className={styles.policiesContainer}>
      <h1 className={styles.policiesTitle}>Payment History</h1>
      {loading ? (
        <div className={styles.loadingMessage}>Loading payment history...</div>
      ) : payments.length === 0 ? (
        <div className={styles.noPoliciesMessage}>No payment history found.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.paymentTable}>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Policy ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentID}</td>
                  <td>{payment.policyID}</td>
                  <td>₹{payment.amountPaid}</td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td className={styles[payment.status.toLowerCase()]}>{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserPaymentHistory;