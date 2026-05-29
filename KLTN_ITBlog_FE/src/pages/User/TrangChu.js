import { useEffect, useState } from "react";
import TrangChuServices from "../../services/User/TrangChuServices";
import { Link } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useTheme } from "../../context/ThemeContext";

function getShortDescription(content, length = 100) {
  const plainText = content.replace(/<[^>]+>/g, "");
  return plainText.length > length
    ? plainText.substring(0, length) + "..."
    : plainText;
}

const TrangChu = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [topTrendings, setTopTrendings] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [lastComments, setLastComments] = useState([]);
  const [topInteracts, setTopInteracts] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [topPopularToday, setTopPopularToday] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [weather, setWeather] = useState({ temp: null, description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isAuthor, setIsAuthor] = useState(-1);
  const { theme } = useTheme();
  const [title, setTitle] = useState("Bài Viết Mới");

  const fetchWeatherData = async () => {
    const city = "Ho Chi Minh City";

    try {
      const response = await axios.get(`https://wttr.in/${city}?format=%t+%C`);
      const data = response.data.split(" ");
      const temp = data[0];
      const description = data.slice(1).join(" ");

      setWeather({ temp, description });
    } catch (err) {
      setError("Could not fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  const currentDate = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchArticles = async (page = 1) => {
    try {
      let response;

      // Kiểm tra xem người dùng có token (đã đăng nhập) hay không
      if (localStorage.getItem("token")) {
        // Nếu có token, gọi API getListArticlesRecomend
        response = await TrangChuServices.getListArticlesRecomend(page);
        setTitle("Đề xuất cho bạn");
      } else {
        // Nếu không có token, gọi API getListArticles
        response = await TrangChuServices.getListArticles(page);
        setTitle("Bài Viết Mới");
      }
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const decodeJWT = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("JWT không hợp lệ");
    }

    const payload = parts[1];
    const decoded = CryptoJS.enc.Base64.parse(payload);
    return JSON.parse(decoded.toString(CryptoJS.enc.Utf8));
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decoded = decodeJWT(localStorage.getItem("token"));
      setIsAuthor(decoded.userId);
    }
    fetchArticles();
    window.scroll(0, 0);
  }, []);

  const fetchTopTrendings = async () => {
    try {
      const response = await TrangChuServices.getTopTrending();
      setTopTrendings(response.data.articles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchMostPopular = async () => {
    try {
      const response = await TrangChuServices.getMostPopular();
      setMostPopular(response.data.articles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchLastComments = async () => {
    try {
      const response = await TrangChuServices.getLastComment();
      setLastComments(response.data.comments);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchTopInteracts = async () => {
    try {
      const response = await TrangChuServices.getTopInteract();
      setTopInteracts(response.data.articles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchNewUsers = async () => {
    try {
      const response = await TrangChuServices.getNewUser();
      setNewUsers(response.data.users);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchTopCategories = async () => {
    try {
      const response = await TrangChuServices.getTopCategories();
      setTopCategories(response.data.categories);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchTopPopularToday = async () => {
    try {
      const response = await TrangChuServices.getTopPopularToday();
      setTopPopularToday(response.data.article);
      console.log(response.data.article);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchTopTrendings();
    fetchMostPopular();
    fetchLastComments();
    fetchTopInteracts();
    fetchNewUsers();
    fetchTopCategories();
    fetchTopPopularToday();
  }, []);

  const handlePageChange = async (page) => {
    try {
      await fetchArticles(page);
      const element = document.getElementById("list-articles-new");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  return (
    <>
      <div
        className={`main-wrap ${
          theme === "dark" ? "dark-theme" : "light-theme"
        }`}
      >
        <main className="position-relative">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 order-1 order-md-2">
                <div className="row">
                  <div className="col-lg-2 col-md-3 primary-sidebar sticky-sidebar sidebar-left">
                    <h4
                      className="widget-title mb-30"
                      style={{
                        color: theme === "dark" ? "white" : "black",
                      }}
                    >
                      Thời Tiết
                    </h4>

                    <div className="sidebar-widget widget-weather border-radius-10 bg-white mb-30">
                      <p className="text-success mb-10">
                        <strong>Thành Phố Hồ Chí Minh</strong>
                      </p>
                      <p>{currentDate}</p>
                      <p>{currentTime}</p>
                      {loading ? (
                        <p>Loading...</p>
                      ) : error ? (
                        <p>{error}</p>
                      ) : (
                        <>
                          <h2>{weather.temp}</h2>
                          <p>{weather.description}</p>
                        </>
                      )}
                    </div>

                    <div className="animated-text-container mt-50 d-none d-lg-block">
                      {Array.from("Welcome to ITBLOG").map((char, index) => (
                        <span
                          key={index}
                          className="animated-text"
                          style={{
                            color: `hsl(${(index * 30) % 360}, 100%, 50%)`,
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    {/* Featured posts */}
                    <div className="featured-post mb-50">
                      <h4
                        className="widget-title mb-30"
                        style={{
                          color: theme === "dark" ? "white" : "black",
                        }}
                      >
                        Nổi Bật{" "}
                        <span
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Trong Ngày
                        </span>
                      </h4>

                      <div className="featured-slider-1 border-radius-10">
                        <div className="featured-slider-1-items">
                          <div className="slider-single p-10">
                            <div className="img-hover-slide border-radius-15 mb-30 position-relative overflow-hidden">
                              <span className="top-right-icon bg-dark">
                                <i className="mdi mdi-camera-alt" />
                              </span>
                              <Link to={`/bai-viet/${topPopularToday.slug}`}>
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${topPopularToday.image_url}`}
                                  alt="post-slider"
                                />
                              </Link>
                            </div>
                            <div className="pr-10 pl-10">
                              <h4 className="post-title mb-20">
                                <Link to={`/bai-viet/${topPopularToday.slug}`}>
                                  {topPopularToday.title}
                                </Link>
                              </h4>
                              <div className="mb-20 overflow-hidden">
                                <div className="entry-meta meta-2 float-left">
                                  <a
                                    className="float-left mr-10 author-img"
                                    href={`/nguoi-dung/${topPopularToday.username}`}
                                    tabIndex={0}
                                  >
                                    <img
                                      src={`${process.env.REACT_APP_API_URL}/${topPopularToday.avatar_url}`}
                                      alt=""
                                    />
                                  </a>
                                  <Link
                                    to={`/nguoi-dung/${topPopularToday.username}`}
                                    tabIndex={0}
                                  >
                                    <span className="author-name text-grey">
                                      {topPopularToday.fullname}
                                    </span>
                                  </Link>
                                  <br />
                                  <span className="author-add color-grey">
                                    {new Date(
                                      topPopularToday.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                <div className="float-right">
                                  <Link
                                    to={`/bai-viet/${topPopularToday.slug}`}
                                    className="read-more"
                                  >
                                    <span className="mr-10">
                                      <i
                                        className="fa fa-thumbtack"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    Đọc Thêm
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*Videos*/}
                    <div className="sidebar-widget">
                      <div className="widget-header position-relative mb-20">
                        <div className="row">
                          <div className="col-7">
                            <h5
                              className="widget-title mb-0"
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              Top{" "}
                              <span
                                style={{
                                  color: theme === "dark" ? "white" : "black",
                                }}
                              >
                                Chuyên Mục
                              </span>
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="block-tab-item post-module-1 post-module-4">
                        <div className="row">
                          {topCategories.map((category, index) => (
                            <div
                              key={index}
                              className="slider-single col-md-6 mb-30"
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              <div className="img-hover-scale border-radius-10">
                                <span
                                  className="top-right-icon background10"
                                  style={{
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  <i className="mdi mdi-share" />
                                </span>
                                <Link to={`/chuyen-muc/${category.slug}`}>
                                  <img
                                    className="border-radius-10"
                                    src={`${process.env.REACT_APP_API_URL}/${category.image_url}`}
                                    alt="post-slider"
                                    style={{
                                      height: "250px",
                                      width: "100%",
                                    }}
                                  />
                                </Link>
                              </div>
                              <h5
                                className="post-title pr-5 pl-5 mb-10 mt-15 text-limit-2-row"
                                style={{
                                  color: theme === "dark" ? "white" : "black",
                                }}
                              >
                                <Link
                                  to={`/chuyen-muc/${category.slug}`}
                                  style={{
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  {category.name}
                                </Link>
                              </h5>
                              <div className="entry-meta meta-1 font-x-small mt-10 pr-5 pl-5 text-muted">
                                <span>
                                  Số bài viết: {category.article_count} bài
                                </span>
                                <a
                                  className="float-right"
                                  href="#"
                                  style={{
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  <i className="ti-bookmark" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12 sidebar-right">
                    {/*Post aside style 1*/}
                    <div className="sidebar-widget mb-30">
                      <div className="widget-header position-relative mb-30">
                        <div className="row">
                          <div className="col-7">
                            <h4
                              className="widget-title mb-0"
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              Top{" "}
                              <span
                                style={{
                                  color: theme === "dark" ? "white" : "black",
                                }}
                              >
                                Tương Tác
                              </span>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="post-aside-style-1 border-radius-10 p-20">
                        <ul className="list-post">
                          {topInteracts.map((article, index) => (
                            <li key={index} className="mb-20">
                              <div className="d-flex align-items-center">
                                <div className="post-thumb d-flex mr-15 border-radius-5 img-hover-scale">
                                  <Link
                                    className="color-white"
                                    to={
                                      article.user_id === isAuthor
                                        ? "/tai-khoan"
                                        : `/nguoi-dung/${article.username}`
                                    }
                                  >
                                    <img
                                      style={{ height: "50px", width: "50px" }}
                                      src={`${process.env.REACT_APP_API_URL}/${article.avatar_url}`}
                                      alt=""
                                    />
                                  </Link>
                                </div>
                                <div className="post-content media-body">
                                  <h6
                                    className="post-title mb-5 mt-2 text-limit-2-row"
                                    style={{
                                      color:
                                        theme === "dark" ? "white" : "black",
                                    }}
                                  >
                                    <Link to={`/bai-viet/${article.slug}`}>
                                      {article.title}
                                    </Link>
                                  </h6>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/*Top authors*/}
                    <div className="sidebar-widget mb-30">
                      <div className="widget-top-auhor border-radius-10 p-20">
                        <div
                          className="widget-header widget-header-style-1 position-relative mb-15"
                          style={{
                            borderBottom:
                              theme === "dark"
                                ? "1px solid #444"
                                : "1px solid #ddd",
                          }}
                        >
                          <h5
                            className="widget-title pl-5"
                            style={{
                              color: theme === "dark" ? "white" : "black",
                            }}
                          >
                            Tác Giả{" "}
                            <span
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              Mới
                            </span>
                          </h5>
                        </div>
                        {newUsers.map((user, index) => (
                          <Link
                            className="red-tooltip"
                            to={`/nguoi-dung/${user.username}`}
                            data-toggle="tooltip"
                            data-placement="top"
                            title={user.fullname}
                            key={index}
                          >
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${user.avatar_url}`}
                              alt=""
                              style={{
                                borderRadius: "50%",
                              }}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/*Newsletter*/}
                    <div
                      className={`sidebar-widget widget_newsletter border-radius-10 p-20 mb-30 ${
                        theme === "dark" ? "dark-theme" : "light-theme"
                      }`}
                    >
                      <div className="widget-header widget-header-style-1 position-relative mb-15">
                        <h5
                          className="widget-title"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Đăng Ký Nhận Tin
                        </h5>
                      </div>
                      <div className="newsletter">
                        <p
                          className="font-medium"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Đăng ký để không bỏ lỡ tin tức mới
                        </p>
                        <form
                          target="_blank"
                          action="#"
                          method="get"
                          className="subscribe_form relative mail_part"
                        >
                          <div className="form-newsletter-cover">
                            <div className="form-newsletter position-relative">
                              <input
                                type="email"
                                name="EMAIL"
                                placeholder="Nhập email của bạn"
                                required=""
                                style={{
                                  backgroundColor:
                                    theme === "dark" ? "#333" : "white",
                                  color: theme === "dark" ? "white" : "black",
                                  borderColor:
                                    theme === "dark" ? "white" : "#ccc",
                                }}
                              />
                              <button
                                type="submit"
                                style={{
                                  color: theme === "dark" ? "white" : "red",
                                }}
                              >
                                <i className="ti ti-email" />
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="sidebar-widget">
                      <div className="widget-header mb-30">
                        <h5
                          className="widget-title pl-5"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Đang <span>Xu Hướng</span>
                        </h5>
                      </div>
                      <div className="post-aside-style-2">
                        <ul className="list-post">
                          {topTrendings.map((article, index) => (
                            <li
                              key={index}
                              className="mb-30 wow fadeIn animated"
                            >
                              <div className="d-flex align-items-center">
                                <div className="post-thumb d-flex mr-15 border-radius-5 img-hover-scale">
                                  <Link
                                    className="color-white"
                                    to={`/bai-viet/${article.slug}`}
                                  >
                                    <img
                                      style={{ height: "150px" }}
                                      src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                      alt=""
                                    />
                                  </Link>
                                </div>
                                <div className="post-content media-body">
                                  <h6
                                    className="post-title mb-10 text-limit-2-row"
                                    style={{
                                      color:
                                        theme === "dark" ? "white" : "#333",
                                    }}
                                  >
                                    <Link to={`/bai-viet/${article.slug}`}>
                                      {article.title}
                                    </Link>
                                  </h6>
                                  <div
                                    className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase"
                                    style={{
                                      color: theme === "dark" ? "#bbb" : "#777",
                                    }}
                                  >
                                    <span className="post-by">
                                      Bởi{" "}
                                      <Link
                                        to={
                                          article.user_id === isAuthor
                                            ? "/tai-khoan"
                                            : `/nguoi-dung/${article.username}`
                                        }
                                        style={{
                                          color:
                                            theme === "dark" ? "#fff" : "#333", // User link color
                                        }}
                                      >
                                        {article.fullname}
                                      </Link>
                                    </span>
                                    <span className="post-on">
                                      {new Date(
                                        article.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-12">
                    <div className="latest-post mb-50">
                      <div className="widget-header position-relative mb-30">
                        <div className="row">
                          <div className="col-7">
                            <h4
                              className="widget-title mb-0"
                              id="list-articles-new"
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              {title}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="loop-list-style-1">
                        {articles.map((article, index) => (
                          <article
                            key={index}
                            className="p-10 background-white border-radius-10 mb-30 wow fadeIn animated"
                            style={{
                              backgroundColor:
                                theme === "dark" ? "#333" : "white",
                              color: theme === "dark" ? "white" : "black",
                            }}
                          >
                            <div className="d-flex">
                              <div className="post-thumb d-flex mr-15 border-radius-15 img-hover-scale">
                                <Link
                                  className="color-white"
                                  to={`/bai-viet/${article.slug}`}
                                >
                                  <img
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                    }}
                                    className="border-radius-15"
                                    src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                    alt={article.title}
                                  />
                                </Link>
                              </div>
                              <div className="post-content media-body">
                                <div className="entry-meta mb-15 mt-10">
                                  <Link className="entry-meta meta-2" to="#">
                                    <span
                                      className="post-in text-danger font-x-small"
                                      style={{
                                        color:
                                          theme === "dark" ? "#bbb" : "#777",
                                      }}
                                    >
                                      {new Date(
                                        article.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </Link>
                                </div>
                                <h5
                                  className="post-title mb-15 text-limit-2-row"
                                  style={{
                                    color: theme === "dark" ? "white" : "#333",
                                  }}
                                >
                                  <Link
                                    to={`/bai-viet/${article.slug}`}
                                    style={{
                                      color:
                                        theme === "dark" ? "white" : "#333",
                                    }}
                                  >
                                    {article.title}
                                  </Link>
                                </h5>
                                <p
                                  className="post-exerpt font-medium text-muted mb-30 d-none d-lg-block"
                                  style={{
                                    color: theme === "dark" ? "#bbb" : "#777",
                                  }}
                                >
                                  {getShortDescription(article.content, 150)}
                                </p>
                                <div
                                  className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase"
                                  style={{
                                    color: theme === "dark" ? "#bbb" : "#777",
                                  }}
                                >
                                  <span className="post-by">
                                    Đăng bởi{" "}
                                    <Link
                                      to={
                                        article.user_id === isAuthor
                                          ? "/tai-khoan"
                                          : `/nguoi-dung/${article.user.username}`
                                      }
                                      style={{
                                        color:
                                          theme === "dark" ? "#fff" : "#333",
                                      }}
                                    >
                                      {article.user.fullname}
                                    </Link>
                                  </span>
                                  <span className="post-on">
                                    {article.views.length === 0
                                      ? 0
                                      : article.views[0].view_count}{" "}
                                    lượt xem
                                  </span>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                      <div className="pagination-area mb-30">
                        <nav aria-label="Page navigation example">
                          <ul
                            style={{
                              padding: "0",
                              margin: "0",
                              listStyle: "none",
                              display: "flex",
                            }}
                          >
                            {Array.from({ length: totalPages }, (_, index) => (
                              <li key={index} style={{ margin: "0 5px" }}>
                                <a
                                  onClick={() => handlePageChange(index + 1)}
                                  onMouseEnter={() => setHoveredPage(index + 1)}
                                  onMouseLeave={() => setHoveredPage(null)}
                                  style={{
                                    display: "inline-flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40px",
                                    height: "40px",
                                    padding: "0",
                                    backgroundColor:
                                      currentPage === index + 1
                                        ? "#FF2E2E"
                                        : hoveredPage === index + 1
                                        ? "#FF4C4C"
                                        : "transparent",
                                    color:
                                      currentPage === index + 1 ||
                                      theme === "dark"
                                        ? "white"
                                        : "black",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    textDecoration: "none",
                                  }}
                                >
                                  {index + 1}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12 sidebar-right">
                    <div className="sidebar-widget mb-50">
                      <div className="widget-header mb-30">
                        <h5
                          className="widget-title"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Đang <span>Phổ Biến</span>
                        </h5>
                      </div>
                      <div className="post-aside-style-3">
                        {mostPopular.map((article, index) => (
                          <article
                            key={index}
                            className="border-radius-15 mb-30 p-10 wow fadeIn animated"
                            style={{
                              color: theme === "dark" ? "white" : "black",
                            }}
                          >
                            <div className="post-thumb d-flex mb-15 border-radius-15 img-hover-scale">
                              <Link
                                to={`/bai-viet/${article.slug}`}
                                style={{ width: "100%" }}
                              >
                                <img
                                  style={{
                                    height: "250px",
                                    width: "100%",
                                    filter:
                                      theme === "dark"
                                        ? "brightness(0.7)"
                                        : "none",
                                  }}
                                  src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                  alt={article.title}
                                />
                              </Link>
                            </div>
                            <div className="pl-10 pr-10">
                              <h5
                                className="post-title mb-15"
                                style={{
                                  color: theme === "dark" ? "white" : "#333",
                                }}
                              >
                                <Link to={`/bai-viet/${article.slug}`}>
                                  {article.title}
                                </Link>
                              </h5>
                              <div
                                className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase mb-10"
                                style={{
                                  color: theme === "dark" ? "#bbb" : "#777",
                                }}
                              >
                                <span className="post-in">TOP {index + 1}</span>
                                <span className="post-by">
                                  Bởi{" "}
                                  <Link
                                    to={
                                      article.user_id === isAuthor
                                        ? "/tai-khoan"
                                        : `/nguoi-dung/${article.username}`
                                    }
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#333",
                                    }}
                                  >
                                    {article.fullname}
                                  </Link>
                                </span>
                                <span className="post-on">
                                  {article.total_views} lượt xem
                                </span>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                    <div className="sidebar-widget p-20 border-radius-15 widget-latest-comments wow fadeIn animated">
                      <div className="widget-header mb-30">
                        <h5
                          className="widget-title"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Bình Luận <span>Mới</span>
                        </h5>
                      </div>
                      <div className="post-block-list post-module-6">
                        {lastComments.map((comment, index) => (
                          <div
                            key={index}
                            className="last-comment mb-20 d-flex wow fadeIn animated"
                            style={{
                              color: theme === "dark" ? "white" : "black",
                            }}
                          >
                            <span className="item-count vertical-align">
                              <Link
                                className="red-tooltip author-avatar"
                                to={
                                  comment.user_id === isAuthor
                                    ? "/tai-khoan"
                                    : `/nguoi-dung/${comment.user.username}`
                                }
                                data-toggle="tooltip"
                                data-placement="top"
                                title={comment.user.fullname}
                              >
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${comment.user.avatar_url}`}
                                  alt=""
                                  style={{
                                    borderRadius: "50%",
                                    width: "40px",
                                    height: "40px",
                                  }}
                                />
                              </Link>
                            </span>
                            <div className="alith_post_title_small">
                              <p
                                className="font-medium mb-10"
                                style={{
                                  color: theme === "dark" ? "white" : "#333",
                                }}
                              >
                                <Link
                                  to={`/bai-viet/${comment.article.slug}`}
                                  style={{
                                    color: theme === "dark" ? "white" : "#333",
                                  }}
                                >
                                  {comment.content}
                                </Link>
                              </p>
                              <div
                                className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase mb-10"
                                style={{
                                  color: theme === "dark" ? "#bbb" : "#777",
                                }}
                              >
                                <span className="post-by">
                                  Bởi{" "}
                                  <Link
                                    to={
                                      comment.user_id === isAuthor
                                        ? "/tai-khoan"
                                        : `/nguoi-dung/${comment.user.username}`
                                    }
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#333",
                                    }}
                                  >
                                    {comment.user.fullname}
                                  </Link>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TrangChu;
