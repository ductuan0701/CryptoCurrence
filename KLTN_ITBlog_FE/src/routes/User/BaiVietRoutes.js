import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BaiViet from '../../pages/User/BaiViet';

const BaiVietRoutes = () => {
  return (
    <Routes>
      <Route path="/:slug" element={<BaiViet />} />
      <Route path="/" element={<BaiViet />} />
    </Routes>
  );
};

export default BaiVietRoutes;