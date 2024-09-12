import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import Link from 'antd/es/typography/Link';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, primaryColor, secondaryColor, ...user } = response.data;

      // Save token to localStorage
      localStorage.setItem('authToken', token);

      // Dispatch full user data and theme to Redux store
      dispatch(setUser({ user, token, primaryColor, secondaryColor }));

      alert('Login successful');
      navigate('/logs');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-div">
   
    <div className="login-container">
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='loginbutton' type="submit">Login</button>
      </form>

      <Link href={'/signup'}>sigin up</Link>
    </div>
    </div>
  );
};

export default Login;
