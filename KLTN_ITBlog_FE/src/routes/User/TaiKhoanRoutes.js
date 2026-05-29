import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TaiKhoan from '../../pages/User/TaiKhoan';

const TaiKhoanRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TaiKhoan />} />
    </Routes>
  );
};

export default TaiKhoanRoutes;