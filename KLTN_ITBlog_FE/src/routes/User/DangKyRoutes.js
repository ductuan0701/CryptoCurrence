import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DangKy from '../../pages/User/DangKy';

const DangKyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DangKy />} />
    </Routes>
  );
};

export default DangKyRoutes;