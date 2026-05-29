import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChinhSua from '../../pages/User/ChinhSua';

const ChinhSuaRoutes = () => {
  return (
    <Routes>
      <Route path="/:id" element={<ChinhSua />} />
    </Routes>
  );
};

export default ChinhSuaRoutes;