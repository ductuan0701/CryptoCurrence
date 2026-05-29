import React from 'react';
import { Route, Routes } from 'react-router-dom';
import List from '../pages/BaiViet/List';
import Add from '../pages/BaiViet/Add';
import Show from '../pages/BaiViet/Show';


const BaiVietRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="them" element={<Add />} />
      <Route path=":id" element={<Show />} />
    </Routes>
  );
};

export default BaiVietRoutes;