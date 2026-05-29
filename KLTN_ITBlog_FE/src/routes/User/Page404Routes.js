import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Page404 from '../../pages/User/Page404';

const Page404Routes = () => {
  return (
    <Routes>
      <Route path="/" element={<Page404 />} />
    </Routes>
  );
};

export default Page404Routes;