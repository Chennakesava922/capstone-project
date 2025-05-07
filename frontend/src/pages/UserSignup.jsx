import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../stylings/Auth.module.css";
import { Home } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: 2,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Name: only letters and at least 3 characters
    const namePattern = /^[A-Za-z]{3,}$/;
    if (!namePattern.test(formData.name.trim())) {
      newErrors.name = 'Name must be at least 3 letters and contain only alphabets';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    } else if (/[A-Z]/.test(formData.email)) {
      newErrors.email = 'Email must be in lowercase only';
    }

    // Phone validation
    const phonePattern = /^[1-9]\d{9}$/;
    if (!phonePattern.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits and not start with 0';
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const registerUrl = import.meta.env.VITE_REGISTER_URL;

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: {
          roleId: parseInt(formData.roleId),
        },
      };

      await axios.post(registerUrl, payload);
      toast.success('User registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        roleId: 2,
      });

    } catch (error) {
      console.error(error);
      toast.error('Failed to register user');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authImageContainer}>
        <img 
          src="https://img.freepik.com/premium-vector/auto-insurance-concept-car-safety-assistance-protection-woman-buying-renting-car-signi_333239-479.jpg?w=1380" 
          alt="Signup Illustration" 
          className={styles.authImage}
        />
      </div>
      <div className={styles.authCardContainer}>
        <div className={styles.authCard}>
          <div className={styles.homeIconContainer}>
            <Link to="/" className={styles.homeLink}>
              <Home size={24} className={styles.homeIcon} />
            </Link>
          </div>
          <h2 className={styles.authHeading}>Sign Up</h2>
          <form onSubmit={handleSubmit} className={styles.authForm} noValidate>
            <input
              className={styles.authInput}
              name="name"
              placeholder="John"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <small className={styles.errorText}>{errors.name}</small>}

            <input
              className={styles.authInput}
              name="email"
              type="email"
              placeholder="johndoe@vehicleinsurance.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className={styles.errorText}>{errors.email}</small>}

            <input
              className={styles.authInput}
              name="phone"
              placeholder="9765432109"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <small className={styles.errorText}>{errors.phone}</small>}

            <input
              className={styles.authInput}
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <small className={styles.errorText}>{errors.password}</small>}

            <button type="submit" className={styles.submitButton}>Sign Up</button>
          </form>
          
          <p className={styles.authPrompt}>
            Already have an account? 
            <Link to="/login" className={styles.authLink}> Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
