import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Show from '../pages/CaNhan/Show';
import ChangePassword from '../pages/CaNhan/ChangePassword';


const CaNhanRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Show />} />
      <Route path="/doi-mat-khau" element={<ChangePassword />} />
    </Routes>
  );
};

export default CaNhanRoutes;
