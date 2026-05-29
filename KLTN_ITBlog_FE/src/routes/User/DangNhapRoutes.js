import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DangNhap from '../../pages/User/DangNhap';

const DangNhapRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DangNhap />} />
    </Routes>
  );
};

export default DangNhapRoutes;