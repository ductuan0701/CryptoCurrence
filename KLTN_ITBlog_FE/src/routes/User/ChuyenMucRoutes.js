import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChuyenMuc from '../../pages/User/ChuyenMuc';

const ChuyenMucRoutes = () => {
  return (
    <Routes>
      <Route path="/:slug" element={<ChuyenMuc />} />
    </Routes>
  );
};

export default ChuyenMucRoutes;