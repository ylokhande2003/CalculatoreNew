import React from 'react';
import { Avatar, Button, Layout, Menu } from 'antd';
import { UserOutlined ,LogoutOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, updateTheme } from '../redux/userSlice';
import { clearUser } from '../redux/userSlice';
// import { Color } from 'antd/es/color-picker';

const { Header: AntHeader } = Layout;

const Header = ({headerClassName}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');
  const user = useSelector(state => state.user.user.logo);
  const theme = useSelector(state => state.user.theme);
console.log(user);

  const handleAvatarClick = () => {
    navigate('/profile');
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      localStorage.removeItem('authToken');
      dispatch(clearUser()); // Use clearUser to clear user state
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleHome=()=>{
    navigate('/logs');
  }

  return (
    <AntHeader className={headerClassName} style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      backgroundColor: theme.primaryColor || '#56c92' 
    }} >
      <Menu theme={theme.secondaryColor}>
        <img style={{height:'40px',padding:'20px'}} src={user} alt="" />
      </Menu>
      <Menu theme={theme.secondaryColor} mode="horizontal" selectable={false}>
        <Menu.Item key="Home" onClick={handleHome}>Home</Menu.Item>
        <Menu.Item key="profile" onClick={handleAvatarClick}>
          <Avatar
            style={{ backgroundColor: theme.primaryColor || '#f56c92' }}
            icon={<UserOutlined />}
            
          />
        </Menu.Item>
        <Menu.Item key="Logout" onClick={handleLogout}><LogoutOutlined  /></Menu.Item>
      </Menu>
    </AntHeader>
  );
};

export default Header;
