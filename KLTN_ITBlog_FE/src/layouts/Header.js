import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/admin/dang-nhap");
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast.success("Đăng xuất thành công");
    navigate("/admin/dang-nhap");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div
      className={`hold-transition sidebar-mini layout-fixed ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <div className="wrapper">
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" onClick={toggleSidebar} role="button">
                <i className="fas fa-bars" />
              </a>
            </li>
          </ul>
        </nav>
        <aside
          className={`main-sidebar sidebar-dark-primary elevation-4 ${
            isSidebarOpen ? "open" : ""
          }`}
          ref={sidebarRef}
        >
          <Link to="/" className="brand-link">
            <img
              src="https://i.imgur.com/dIENKyH.png"
              className="brand-image img-circle elevation-3"
              style={{ opacity: ".8" }}
              alt="Logo"
            />

            <span className="brand-text font-weight-light text-center">
              QUẢN TRỊ VIÊN
            </span>
          </Link>
          <div className="sidebar">
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                <li className="nav-item has-treeview menu-open">
                  <Link to="/admin" className="nav-link active">
                    <i className="nav-icon fas fa-tachometer-alt" />
                    <p>Trang Chủ</p>
                  </Link>
                </li>
                <li className="nav-header">QUẢN LÝ BÀI VIẾT</li>
                <li className="nav-item has-treeview">
                  <Link to="/admin/bai-viet" className="nav-link">
                    <i className="nav-icon fa-solid fa-newspaper" />
                    <p>Bài Viết</p>
                  </Link>
                </li>
                <li className="nav-item has-treeview">
                  <Link to="/admin/chuyen-muc" className="nav-link">
                    <i className="nav-icon fa-solid fa-layer-group" />
                    <p>Chuyên Mục</p>
                  </Link>
                </li>

                <li className="nav-header">QUẢN LÝ NGƯỜI DÙNG</li>
                <li className="nav-item has-treeview">
                  <Link to="/admin/nguoi-dung" className="nav-link">
                    <i className="nav-icon fa-solid fa-users" />
                    <p>Người Dùng</p>
                  </Link>
                </li>
                <li className="nav-item has-treeview">
                  <Link to="/admin/binh-luan" className="nav-link">
                    <i className="nav-icon fa-solid fa-comments" />
                    <p>Bình Luận</p>
                  </Link>
                </li>

                <li className="nav-header">QUẢN LÝ CÁ NHÂN</li>
                <li className="nav-item has-treeview">
                  <Link to="/admin/ca-nhan" className="nav-link">
                    <i className="nav-icon fa-solid fa-lock" />
                    <p>Đổi Thông Tin</p>
                  </Link>
                </li>
                <li className="nav-item has-treeview">
                  <a
                    style={{ cursor: "pointer" }}
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    <i className="nav-icon fa-solid fa-right-from-bracket" />
                    <p>Đăng Xuất</p>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Header;
