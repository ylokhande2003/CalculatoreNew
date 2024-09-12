import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Link from 'antd/es/typography/Link';
// import './Signup.css'; // Import the CSS file

const Signup = () => {
  // Individual state hooks for each form field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000'); // Default color
  const [secondaryColor, setSecondaryColor] = useState('#000000'); // Default color
  const [logo, setLogo] = useState(''); // Store logo URL as string
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'age':
        setAge(value);
        break;
      case 'homeAddress':
        setHomeAddress(value);
        break;
      case 'primaryColor':
        setPrimaryColor(value);
        break;
      case 'secondaryColor':
        setSecondaryColor(value);
        break;
      case 'logo':
        setLogo(value); // Set the logo as a URL (string)
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the data object to send in the POST request
    const userData = {
      firstName,
      lastName,
      email,
      password,
      age,
      homeAddress,
      primaryColor,
      secondaryColor,
      logo, // This is now the URL of the logo
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      alert('User registered successfully');
      navigate('/');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={age}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="homeAddress"
          placeholder="Home Address"
          value={homeAddress}
          onChange={handleChange}
          required
        />
        <input
          type="color"
          name="primaryColor"
          value={primaryColor}
          onChange={handleChange}
          required
        />
        <input
          type="color"
          name="secondaryColor"
          value={secondaryColor}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="logo"
          placeholder="Logo Image URL"
          value={logo}
          onChange={handleChange}
          required
        />
        <button type="submit">Signup</button>
      </form>
      <Link href='/'>login </Link>
    </div>
  );
};

export default Signup;
