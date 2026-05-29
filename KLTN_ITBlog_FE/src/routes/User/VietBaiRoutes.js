import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VietBai from '../../pages/User/VietBai';

const VietBaiRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VietBai />} />
    </Routes>
  );
};

export default VietBaiRoutes;