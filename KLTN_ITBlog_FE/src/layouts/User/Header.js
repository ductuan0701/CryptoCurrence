import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChungServices from "../../services/ChungServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faArrowTrendUp,
  faFire,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import {
  faPenToSquare,
  faBell,
  faUser,
  faSun,
  faMoon,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (isDropdownOpen) {
      fetchNotifications();
    }
  }, [isDropdownOpen]);

  const fetchNotifications = async () => {
    try {
      const response = await ChungServices.notification();
      if (response.status === 200) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleDropdown = () => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleHiddenNoti = () => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    setIsDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/tim-kiem?s=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const textStyle = {
    color: theme === "dark" ? "white" : "black",
  };
  const handleDeleteNotification = async (id) => {
    try {
      const response = await ChungServices.deleteNotificationById(id);
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.notification_id !== id
          )
        );
        toast.success("Thông báo đã được xóa");
      } else {
        toast.error("Không thể xóa thông báo");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa thông báo");
    }
  };
  const handleDeleteAllNotifications = async () => {
    try {
      const response = await ChungServices.deleteAllNotificationsByUser();
      if (response.status === 200) {
        setNotifications([]);
        toast.success("Tất cả thông báo đã được xóa");
      } else {
        toast.error("Không thể xóa tất cả thông báo");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa tất cả thông báo");
    }
  };
  return (
    <header
      className={`main-header header-style-2 mb-40 ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
      style={{
        marginLeft: 0,
        position: "sticky",
        top: 0,
        zIndex: 999,
        backgroundColor: theme === "dark" ? "#121212" : "white",
      }}
    >
      <div className="header-bottom header-sticky text-center">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-2 col-md-3 d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
              }}
            >
              <div className="header-logo">
                <Link to="/">
                  <img
                    className="logo-img d-inline"
                    src={
                      theme === "dark"
                        ? "https://i.imgur.com/wQivGlw.jpeg"
                        : "https://i.imgur.com/LshhZtk.png"
                    }
                    alt="Logo"
                    style={{ height: "60px", objectFit: "contain" }}
                  />
                </Link>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="menu-toggle d-lg-none"
                style={{
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                <FontAwesomeIcon icon={faBars} size="lg" />
              </button>
            </div>

            <div className="col-lg-10 col-md-9 main-header-navigation d-none d-lg-flex">
              <div className="main-nav text-left float-lg-left float-md-right">
                <nav>
                  <ul className="main-menu float-right">
                    <li>
                      <Link to="/" style={textStyle}>
                        <span className="mr-15">
                          <FontAwesomeIcon icon={faHouse} />
                        </span>
                        TRANG CHỦ
                      </Link>
                    </li>
                    <li>
                      <Link to="/xu-huong" style={textStyle}>
                        <span className="mr-15">
                          <FontAwesomeIcon icon={faArrowTrendUp} />
                        </span>
                        XU HƯỚNG
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={
                          !localStorage.getItem("token")
                            ? "/dang-nhap"
                            : "/theo-doi"
                        }
                        style={textStyle}
                      >
                        <span className="mr-15">
                          <FontAwesomeIcon icon={faFire} />
                        </span>
                        THEO DÕI
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="off-canvas-toggle-cover d-none d-lg-flex">
                <form
                  action="#"
                  method="get"
                  className="search-form position-relative mr-20 border-radius-10"
                  onClick={handleHiddenNoti}
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    className="search_field"
                    placeholder="Nhập tên bài viết"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    name="s"
                    style={{
                      color: theme === "dark" ? "black" : "black",
                      border:
                        theme === "dark" ? "1px solid #444" : "1px solid #ccc",
                    }}
                  />
                  <span
                    className="search-icon"
                    style={{
                      color: theme === "dark" ? "black" : "black",
                    }}
                  >
                    <i className="ti-search mr-5" />
                  </span>
                </form>

                <div className="d-inline tools-icon">
                  <Link
                    className="red-tooltip text-danger"
                    to="/viet-bai"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Viết bài mới"
                    onClick={handleHiddenNoti}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="ml-15"
                      style={{ fontSize: 20 }}
                    />
                  </Link>
                  <Link
                    className="red-tooltip text-success"
                    to="#"
                    onClick={toggleDropdown}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Thông báo"
                  >
                    <FontAwesomeIcon
                      icon={faBell}
                      className="ml-15"
                      style={{ fontSize: 20 }}
                    />
                  </Link>
                  {isDropdownOpen && (
                    <div
                      className="notification-dropdown"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        background: "white",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: 4,
                        width: 330,
                        zIndex: 1000,
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ margin: 0 }}>Thông báo</h4>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ff0000",
                            fontSize: 14,
                            cursor: "pointer",
                          }}
                          onClick={handleDeleteAllNotifications}
                        >
                          Xóa tất cả
                        </button>
                      </div>
                      {notifications.length > 0 ? (
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {notifications.map((notification) => (
                            <li
                              key={notification.notification_id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px 0",
                                justifyContent: "space-between",
                                borderBottom: "1px solid #f0f0f0",
                              }}
                            >
                              <img
                                src={
                                  notification.type === "comment" ||
                                  notification.type === "like"
                                    ? `${process.env.REACT_APP_API_URL}/${notification.article.image_url}`
                                    : `${process.env.REACT_APP_API_URL}/${notification.user.avatar_url}`
                                }
                                alt={notification.user.fullname}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: "100%",
                                  marginRight: 10,
                                }}
                              />
                              <Link
                                style={{ padding: 0, lineHeight: "30px" }}
                                to={
                                  notification.type === "comment" ||
                                  notification.type === "like"
                                    ? `/bai-viet/${notification.article.slug}`
                                    : `/tai-khoan`
                                }
                                onClick={handleHiddenNoti}
                              >
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 14,
                                    textAlign: "left",
                                  }}
                                >
                                  <strong>
                                    <Link
                                      style={{ padding: 0 }}
                                      to={`/nguoi-dung/${notification.user.username}`}
                                      onClick={handleHiddenNoti}
                                    >
                                      {notification.user.fullname}
                                    </Link>
                                  </strong>
                                  {notification.type === "comment"
                                    ? " đã bình luận!"
                                    : null}
                                  {notification.type === "like"
                                    ? " đã thích bài viết!"
                                    : null}
                                  {notification.type === "follow"
                                    ? " đã theo dõi bạn!"
                                    : null}
                                </p>

                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: 12,
                                    color: "#888",
                                    textAlign: "left",
                                  }}
                                >
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </p>
                              </Link>
                              <button
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ff0000",
                                  fontSize: 14,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleDeleteNotification(
                                    notification.notification_id
                                  )
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="ml-15"
                                  style={{ fontSize: 20 }}
                                />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ textAlign: "center", margin: 0 }}>
                          Không có thông báo nào.
                        </p>
                      )}
                    </div>
                  )}

                  <Link
                    className="red-tooltip text-primary"
                    to={
                      !localStorage.getItem("token")
                        ? "/dang-nhap"
                        : "/tai-khoan"
                    }
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Tài khoản"
                    onClick={handleHiddenNoti}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="ml-15"
                      style={{ fontSize: 20 }}
                    />
                  </Link>
                  <Link
                    onClick={toggleTheme}
                    className="red-tooltip ml-15"
                    title="Toggle Theme"
                    style={{
                      color: theme === "light" ? "black" : "white",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={theme === "light" ? faMoon : faSun}
                      style={{
                        fontSize: 20,
                        color: theme === "light" ? "black" : "white",
                      }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div
              className={`mobile-menu ${isMobileMenuOpen ? "active" : ""} ${
                theme === "dark" ? "dark-theme" : "light-theme"
              }`}
              style={{
                backgroundColor: theme === "dark" ? "#333" : "#fff",
                color: theme === "dark" ? "white" : "black",
              }}
            >
              <nav>
                <ul className="main-menu">
                  <li>
                    <Link to="/" style={textStyle}>
                      <span className="mr-15">
                        <FontAwesomeIcon icon={faHouse} />
                      </span>
                      TRANG CHỦ
                    </Link>
                  </li>
                  <li>
                    <Link to="/xu-huong" style={textStyle}>
                      <span className="mr-15">
                        <FontAwesomeIcon icon={faArrowTrendUp} />
                      </span>
                      XU HƯỚNG
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={
                        !localStorage.getItem("token")
                          ? "/dang-nhap"
                          : "/theo-doi"
                      }
                      style={textStyle}
                    >
                      <span className="mr-15">
                        <FontAwesomeIcon icon={faFire} />
                      </span>
                      THEO DÕI
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="red-tooltip text-danger"
                      to="/viet-bai"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Viết bài mới"
                    >
                      <span className="mr-15">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ fontSize: 20 }}
                        />
                      </span>
                      Viết bài mới
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="red-tooltip text-success"
                      to="/thong-bao"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Thông báo"
                    >
                      <span className="mr-15">
                        <FontAwesomeIcon
                          icon={faBell}
                          style={{ fontSize: 20 }}
                        />
                      </span>
                      Thông báo
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="red-tooltip text-primary"
                      to={
                        !localStorage.getItem("token")
                          ? "/dang-nhap"
                          : "/tai-khoan"
                      }
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tài khoản"
                    >
                      <span className="mr-15">
                        <FontAwesomeIcon
                          icon={faUser}
                          style={{ fontSize: 20 }}
                        />
                      </span>
                      Tài khoản
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
