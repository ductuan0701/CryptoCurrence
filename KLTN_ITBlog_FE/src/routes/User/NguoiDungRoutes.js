import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NguoiDung from '../../pages/User/NguoiDung';

const NguoiDungRoutes = () => {
  return (
    <Routes>
      <Route path="/:username" element={<NguoiDung />} />
    </Routes>
  );
};

export default NguoiDungRoutes;