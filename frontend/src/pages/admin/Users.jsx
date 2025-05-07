import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../../stylings/User.module.css';

const Users = () => {
  const [users, setUsers] = useState([]);

  const NON_ADMINS_URL = import.meta.env.VITE_GET_NON_ADMINS_URL;
  const DELETE_USER_URL = import.meta.env.VITE_DELETE_USER_URL;

  useEffect(() => {
    fetchUsers();
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(NON_ADMINS_URL);
      setUsers(res.data);
      console.log("Fetched users:", res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load users');
    }
  };
  const confirmToast = (message, onConfirm) => {
    toast.custom((t) => (
      <div style={{
        background: '#fff',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '280px',
        gap: '10px'
      }}>
        <span>{message}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }} style={{ background: '#d33', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>
            Yes
          </button>
          <button onClick={() => toast.dismiss(t.id)} style={{ background: '#ccc', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>
            No
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };
  

  const handleDelete = (userId) => {
    confirmToast('Are you sure you want to delete this user?', async () => {
      try {
        await axios.delete(`${DELETE_USER_URL}/${userId}`);
        toast.success('User deleted successfully');
        setUsers(users.filter(user => user.userId !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    });
  };
  
  

  return (
    <div className={styles.usersContainer}>
      <h2 className={styles.heading}>👥 All Users</h2>

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Phone</th>
            <th className={styles.th}>Role</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId}>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.email}</td>
              <td className={styles.td}>{user.phone}</td>
              <td className={styles.td}>{user.role?.roleName || 'N/A'}</td>
              <td className={styles.td}>
                <button
                  onClick={() => handleDelete(user.userId)}
                  className={styles.actionsButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;