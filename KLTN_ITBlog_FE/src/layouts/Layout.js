import React, { useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from '../routes';
import CryptoJS from 'crypto-js';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook

const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));
const UserHeader = lazy(() => import('./User/Header'));
const UserFooter = lazy(() => import('./User/Footer'));

const decodeJWT = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT không hợp lệ');
  }

  const payload = parts[1];
  const decoded = CryptoJS.enc.Base64.parse(payload);
  return JSON.parse(decoded.toString(CryptoJS.enc.Utf8));
};

const Layout = () => {
  const location = useLocation();
  let isDangNhap = false;
  let isAdmin = false;

  // Ensure theme is correctly destructured from the context
  const { theme } = useTheme(); // Access theme from context

  if (location.pathname === '/admin/dang-nhap' || location.pathname === '/admin/dang-nhap/') {
    isDangNhap = true;
  }

  if (location.pathname.split('/')[1] === 'admin') {
    isAdmin = true;
  }

  useEffect(() => {
    if (isAdmin) {
      import('../assets/admin.css');
      if (localStorage.getItem('token')) {
        const decoded = decodeJWT(localStorage.getItem('token'));
        if (decoded.role === 'user') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    } else {
      import('../assets/user.css');
      if (localStorage.getItem('token')) {
        const decoded = decodeJWT(localStorage.getItem('token'));
        if (decoded.role === 'admin') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    }
  }, [isAdmin]);

  // Define theme styles
  const lightTheme = {
    backgroundColor: '#fff',
    color: '#000',
  };

  const darkTheme = {
    backgroundColor: '#333',
    color: '#fff',
  };

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Suspense>
      <div style={currentTheme} className="layout">
        {isAdmin ? (
          <>
            {!isDangNhap && <Header />}
            <main className="content">
              <AppRoutes />
            </main>
            {!isDangNhap && <Footer />}
          </>
        ) : (
          <>
            <UserHeader />
            <main className="content">
              <AppRoutes />
            </main>
            <UserFooter />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Layout;
