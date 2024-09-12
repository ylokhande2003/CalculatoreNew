import React from 'react';
// import { useSelector } from 'react-redux';
import Calculator from './Calculator';
import Header from './Header';

const Home = () => {
  // const profile = useSelector((state) => state.profile);

  return (
    <div>
      <Header/>
      <Calculator />
      {/* Add logs table here */}
    </div>
  );
};

export default Home;
