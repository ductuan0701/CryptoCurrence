import React from 'react';
import { Route, Routes } from 'react-router-dom';
import List from '../pages/ChuyenMuc/List';
import Add from '../pages/ChuyenMuc/Add';
import Show from '../pages/ChuyenMuc/Show';


const ChuyenMucRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="them" element={<Add />} />
      <Route path=":id" element={<Show />} />
    </Routes>
  );
};

export default ChuyenMucRoutes;
