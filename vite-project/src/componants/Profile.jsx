import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, updateTheme } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css'; // Import the CSS file
import axios from 'axios';

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.user.theme);
  const token = useSelector((state) => state.user.token); // Get token from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor);
  const [logo, setLogo] = useState(user.logo); // Handle logo URL
  const [homeAddress, setHomeAddress] = useState(user.homeAddress); // Handle address

  useEffect(() => {
    if (user) {
      setEditableUser(user);
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.secondaryColor);
      setLogo(user.logo); // Set logo from user data
      setHomeAddress(user.homeAddress); // Set address from user data
    }
  }, [user, theme]);
  useEffect(() => {
    // Update CSS variables dynamically when primaryColor or secondaryColor changes
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }, [primaryColor, secondaryColor]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  const handleSave = async () => {
    const updatedData = {
      ...editableUser,
      primaryColor,
      secondaryColor,
      logo, // Include logo as URL
      homeAddress, // Include address
    };

    try {
      // Send updated profile data to the backend
      await axios.put(
        'http://localhost:5000/api/profile',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
          params: {
            email_address: editableUser.email, // Send email as a query param
          },
        }
      );

      // Update state in Redux after successful update
      dispatch(updateUser(updatedData));
      dispatch(updateTheme({ primaryColor, secondaryColor }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-container">
      <Header className='header' />
      <h2>User Profile</h2>
      {isEditing ? (
        <div>
              <div className="profile-form">
          <div className="twosection1">
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={editableUser?.firstName || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={editableUser?.lastName || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={editableUser?.email || ''}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="age">Age:</label>
            <input
              id="age"
              type="number"
              name="age"
              value={editableUser?.age || ''}
              onChange={handleChange}
            />
          </div>

          </div>
          <div className="twosection">
          <div>
            <label htmlFor="primaryColor">Primary Color:</label>
            <input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="secondaryColor">Secondary Color:</label>
            <input
              id="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="homeAddress">Home Address:</label>
            <input
              id="homeAddress"
              type="text"
              name="homeAddress"
              value={homeAddress || ''}
              onChange={(e) => setHomeAddress(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="logo">Logo URL:</label>
            <input
              id="logo"
              type="text"
              name="logo"
              value={logo || ''}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
          </div>
        </div>
        
          

          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' ,backgroundColor:'white'}}>
          {user?.logo ? (
            <img
              src={user.logo}
              alt="User Profile"
              className="profile-image"
            />
          ) : (
            <div>No Profile Picture</div>
          )}
          <div>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <p>Address: {user.homeAddress}</p>
            <button onClick={handleEditToggle}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
