import React from 'react';
import { Route, Routes } from 'react-router-dom';
import List from '../pages/NguoiDung/List';
import Show from '../pages/NguoiDung/Show';


const NguoiDungRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path=":id" element={<Show />} />
    </Routes>
  );
};

export default NguoiDungRoutes;
