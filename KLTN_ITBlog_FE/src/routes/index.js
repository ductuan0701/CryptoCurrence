import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BaiVietRoutes from './BaiVietRoutes';
import ChuyenMucRoutes from './ChuyenMucRoutes';
import NguoiDungRoutes from './NguoiDungRoutes';
import CaNhanRoutes from './CaNhanRoutes';
import BinhLuanRoutes from './BinhLuanRoutes';
import DangNhapRoutes from './DangNhapRoutes';
import ThongKeRoutes from './ThongKeRoutes';

import TrangChuRoutes from './User/TrangChuRoutes'
import UserDangNhapRoutes from './User/DangNhapRoutes'
import DangKyRoutes from './User/DangKyRoutes'
import TaiKhoanRoutes from './User/TaiKhoanRoutes'
import UserBaiVietRoutes from './User/BaiVietRoutes'
import UserNguoiDungRoutes from './User/NguoiDungRoutes'
import XuHuongRoutes from './User/XuHuongRoutes'
import TimKiemRoutes from './User/TimKiemRoutes'
import VietBaiRoutes from './User/VietBaiRoutes'
import ChinhSuaRoutes from './User/ChinhSuaRoutes'
import TheoDoiRoutes from './User/TheoDoiRoutes'
import UserChuyenMucRoutes from './User/ChuyenMucRoutes'
import Page404Routes from './User/Page404Routes'
import QuenMatKhauRoutes from './User/QuenMatKhauRoutes'
import MatKhauMoiRoutes from './User/MatKhauMoiRoutes'
import ThongKeUserRoutes from './User/ThongKeUserRoutes';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="admin/bai-viet/*" element={<BaiVietRoutes />} />
      <Route path="admin/chuyen-muc/*" element={<ChuyenMucRoutes />} />
      <Route path="admin/nguoi-dung/*" element={<NguoiDungRoutes />} />
      <Route path="admin/ca-nhan/*" element={<CaNhanRoutes />} />
      <Route path="admin/binh-luan/*" element={<BinhLuanRoutes />} />
      <Route path="admin/dang-nhap/" element={<DangNhapRoutes />} />
      <Route path="admin/*" element={<ThongKeRoutes />} />

      <Route path="/" element={<TrangChuRoutes />} />
      <Route path="/dang-nhap" element={<UserDangNhapRoutes />} />
      <Route path="/dang-ky" element={<DangKyRoutes />} />
      <Route path="/tai-khoan/*" element={<TaiKhoanRoutes />} />
      <Route path="/bai-viet/*" element={<UserBaiVietRoutes />} />
      <Route path="/nguoi-dung/*" element={<UserNguoiDungRoutes />} />
      <Route path="/xu-huong/*" element={<XuHuongRoutes />} />
      <Route path="/tim-kiem/*" element={<TimKiemRoutes />} />
      <Route path="/viet-bai/*" element={<VietBaiRoutes />} />
      <Route path="/chinh-sua/*" element={<ChinhSuaRoutes />} />
      <Route path="/theo-doi/*" element={<TheoDoiRoutes />} />
      <Route path="/chuyen-muc/*" element={<UserChuyenMucRoutes />} />
      <Route path="/quen-mat-khau/*" element={<QuenMatKhauRoutes />} />
      <Route path="/doi-mat-khau/*" element={<MatKhauMoiRoutes />} />
      <Route path="/404/*" element={<Page404Routes />} />
      <Route path="/thong-ke/*" element={<ThongKeUserRoutes />} />

    </Routes>
  );
};

export default AppRoutes;
