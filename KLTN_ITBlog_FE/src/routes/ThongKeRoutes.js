import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Statistic from '../pages/ThongKe/Statistic';


const ThongKeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Statistic />} />
    </Routes>
  );
};

export default ThongKeRoutes;
