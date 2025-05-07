import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from "../stylings/Auth.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(credentials.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please correct the errors before submitting');
      return;
    }

    try {
      const loginUrl = import.meta.env.VITE_LOGIN_URL;
      const response = await axios.post(loginUrl, credentials);

      const user = response.data;
      console.log(user);
      if (!user || !user.token) {
        throw new Error("Missing user data or token in response");
      }

      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userData.role?.roleName);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userName', userData.name);

      toast.success(`Login successful! Role: ${userData.role?.roleName}`);

      if (userData.role?.roleName === 'admin') {
        navigate('/admin');
      } else if (userData.role?.roleName === 'User') {
        navigate('/user/insurance policies');
      } else {
        toast.error("Unrecognized role");
      }

    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Invalid credentials');
      console.log(error);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authImageContainer}>
        <img 
          src="https://img.freepik.com/free-vector/car-insurance-concept-illustration_114360-22825.jpg?t=st=1746385812~exp=1746389412~hmac=ac23f94e507a6e6befa26f445771709f77b5e92b84cf3f813c0698251458e3fc&w=900" 
          alt="Insurance Illustration" 
          className={styles.authImage}
        />
      </div>
      <div className={styles.authCardContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.authHeading}>Login</h2>
          <form onSubmit={handleLogin} className={styles.authForm} noValidate>
            <input
              className={styles.authInput}
              name="email"
              type="email"
              placeholder="johndoe@vehicleinsurance.com"
              value={credentials.email}
              onChange={handleChange}
            />
            {errors.email && <small className={styles.errorText}>{errors.email}</small>}

            <input
              className={styles.authInput}
              name="password"
              type="password"
              placeholder="********"
              value={credentials.password}
              onChange={handleChange}
            />
            {errors.password && <small className={styles.errorText}>{errors.password}</small>}
            
            

            <button type="submit" className={styles.submitButton}>Login</button>
          </form>
          <p className={styles.authPrompt}>
            Don't have an account?
            <Link to="/signup" className={styles.authLink}> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;