import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TimKiem from '../../pages/User/TimKiem';

const TimKiemRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TimKiem />} />
    </Routes>
  );
};

export default TimKiemRoutes;