import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/DangNhap/Login';


const DangNhapRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default DangNhapRoutes;