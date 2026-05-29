import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TheoDoi from '../../pages/User/TheoDoi';

const TheoDoiRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TheoDoi />} />
    </Routes>
  );
};

export default TheoDoiRoutes;