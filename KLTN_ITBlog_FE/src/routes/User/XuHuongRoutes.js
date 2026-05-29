import React from 'react';
import { Route, Routes } from 'react-router-dom';
import XuHuong from '../../pages/User/XuHuong';

const XuHuongRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<XuHuong />} />
    </Routes>
  );
};

export default XuHuongRoutes;