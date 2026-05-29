import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TrangChu from '../../pages/User/TrangChu';



const TrangChuRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TrangChu />} />
    </Routes>
  );
};

export default TrangChuRoutes;