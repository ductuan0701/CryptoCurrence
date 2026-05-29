import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MatKhauMoi from '../../pages/User/MatKhauMoi';

const MatKhauMoiRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MatKhauMoi />} />
    </Routes>
  );
};

export default MatKhauMoiRoutes;