import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componants/Login';
import Signup from './componants/Signup';
import Calculator from './componants/Calculator';
import Profile from './componants/Profile'; // Import Profile component
import Home from './componants/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logs" element={<Home/>} />
        <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
      </Routes>
    </Router>
  );
};

export default App;
