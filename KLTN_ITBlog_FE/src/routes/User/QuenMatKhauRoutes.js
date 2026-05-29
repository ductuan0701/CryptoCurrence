import React from 'react';
import { Route, Routes } from 'react-router-dom';
import QuenMatKhau from '../../pages/User/QuenMatKhau';

const QuenMatKhauRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<QuenMatKhau />} />
    </Routes>
  );
};

export default QuenMatKhauRoutes;