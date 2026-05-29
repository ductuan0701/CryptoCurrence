import React from 'react';
import { Route, Routes } from 'react-router-dom';
import List from '../pages/BinhLuan/List';

const BinhLuanRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
    </Routes>
  );
};

export default BinhLuanRoutes;