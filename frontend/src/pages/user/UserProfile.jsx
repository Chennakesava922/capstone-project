import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from "../../stylings/UserProfile.module.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const GET_PROFILE_URL = import.meta.env.VITE_GET_PROFILE_URL;
  const UPDATE_PROFILE_URL = import.meta.env.VITE_UPDATE_PROFILE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        const storedRole = localStorage.getItem('userRole');
        const token = localStorage.getItem('token');

        if (!storedEmail || !token) {
          toast.error("Missing authentication information");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${GET_PROFILE_URL}?email=${encodeURIComponent(storedEmail)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser({ ...res.data, role: storedRole });
        setFormData({
          name: res.data.name,
          phone: res.data.phone,
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setFormData({
      name: user.name,
      phone: user.phone,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(UPDATE_PROFILE_URL, {
        email: user.email,
        name: formData.name,
        phone: formData.phone,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Profile updated successfully!");
      setUser((prev) => ({ ...prev, name: formData.name, phone: formData.phone }));
      setEditingField(null);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (!user) return <div className={styles.error}>No user profile found.</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h2 className={styles.profileTitle}>👤 User Profile</h2>
        
        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Name</span>
            {editingField === 'name' ? (
              <div className={styles.editField}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inlineInput}
                  autoFocus
                />
                <div className={styles.inlineButtons}>
                  <button onClick={handleSubmit} className={styles.inlineSave}>✓</button>
                  <button onClick={handleCancelClick} className={styles.inlineCancel}>✕</button>
                </div>
              </div>
            ) : (
              <div className={styles.valueContainer}>
                <span className={styles.detailValue}>{user.name}</span>
                <button onClick={() => handleEditClick('name')} className={styles.inlineEdit}>✎</button>
              </div>
            )}
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>{user.email}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Phone</span>
            {editingField === 'phone' ? (
              <div className={styles.editField}>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.inlineInput}
                  autoFocus
                />
                <div className={styles.inlineButtons}>
                  <button onClick={handleSubmit} className={styles.inlineSave}>✓</button>
                  <button onClick={handleCancelClick} className={styles.inlineCancel}>✕</button>
                </div>
              </div>
            ) : (
              <div className={styles.valueContainer}>
                <span className={styles.detailValue}>{user.phone || 'Not provided'}</span>
                <button onClick={() => handleEditClick('phone')} className={styles.inlineEdit}>✎</button>
              </div>
            )}
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Role</span>
            <span className={styles.detailValue}>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
