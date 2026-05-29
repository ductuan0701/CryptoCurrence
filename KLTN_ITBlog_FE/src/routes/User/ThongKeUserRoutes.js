import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ThongKe from '../../pages/User/ThongKe';


const ThongKeUserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ThongKe />} />
    </Routes>
  );
};

export default ThongKeUserRoutes;
