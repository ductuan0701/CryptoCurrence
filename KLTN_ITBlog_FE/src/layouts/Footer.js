import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <strong className='float-left'>&copy; {currentYear} - Trang dành cho <Link to="/admin">Quản trị viên</Link>.</strong>
      <div className="float-right d-none d-sm-inline-block">
        <b>Phiên bản</b> 1.0.0
      </div>
    </footer>
  );
};

export default Footer;