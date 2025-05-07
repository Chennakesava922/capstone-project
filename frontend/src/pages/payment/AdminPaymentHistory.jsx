import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from '../../stylings/AdminPayment.module.css';

const AdminPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:8187/api/payments/all');
        setPayments(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to fetch payment history. Please try again later.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading payment history...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.adminPolicies}>
      <h1>All Payments</h1>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>User ID</th>
              <th>Policy ID</th>
              <th>Amount</th>
              <th>Date(DD/MM/YYYY)</th>
              <th>Status</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentID}</td>
                <td>{payment.
userID}</td>
                <td>{payment.policyID}</td>
                <td>₹{payment.amountPaid
                }</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.status}</td>
                <td>{payment.
razorpayOrderId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentHistory; 