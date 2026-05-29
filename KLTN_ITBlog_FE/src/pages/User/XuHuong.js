import { useEffect, useState } from "react";
import TrangChuServices from "../../services/User/TrangChuServices";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import CryptoJS from "crypto-js";
import { useTheme } from "../../context/ThemeContext";

function getShortDescription(content, length = 100) {
  // Loại bỏ các thẻ HTML
  const plainText = content.replace(/<[^>]+>/g, "");
  // Lấy một số ký tự đầu tiên làm mô tả ngắn
  return plainText.length > length
    ? plainText.substring(0, length) + "..."
    : plainText;
}

const XuHuong = () => {
  const [articles, setArticles] = useState([]);
  const [newArticles, setNewArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [lastComments, setLastComments] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [topTrendings, setTopTrendings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [isAuthor, setIsAuthor] = useState(-1);
  const { theme } = useTheme();
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

  const fetchArticles = async (page = 1) => {
    try {
      const response = await TrangChuServices.getTopMonth(page);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
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

  const fetchNewArticles = async (page = 1) => {
    try {
      const response = await TrangChuServices.getListArticles(page);
      setNewArticles(response.data.articles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchLastComments();
    fetchMostPopular();
    fetchNewArticles();
    fetchTopTrendings();
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
      <main className="position-relative">
        <div className="archive-header text-center mb-50">
          <div className="container">
            <h2>
              <span className="text-success">Xu Hướng</span>
            </h2>
            <div className="breadcrumb">
              <span className="no-arrow">Bạn đang xem:</span>
              <Link to="/" rel="nofollow">
                Trang Chủ
              </Link>
              <span />
              Xu Hướng
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-9 order-1 order-md-2">
              <div className="row mb-50">
                <div className="col-lg-8 col-md-12">
                  <div className="latest-post mb-50">
                    <div className="loop-list-style-1">
                      {articles.map((article, index) => (
                        <article
                          key={index}
                          className="p-10 border-radius-10 mb-30 wow fadeIn animated"
                          style={{
                            backgroundColor:
                              theme === "dark" ? "#333" : "white",
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          <div className="d-md-flex d-block">
                            <div className="post-thumb post-thumb-big d-flex mr-15 border-radius-15 img-hover-scale">
                              <Link
                                className="color-white"
                                to={`/bai-viet/${article.slug}`}
                              >
                                <img
                                  className="border-radius-15"
                                  src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                  alt=""
                                  style={{
                                    filter:
                                      theme === "dark"
                                        ? "brightness(0.7)"
                                        : "none",
                                  }}
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
                                        theme === "dark" ? "white" : "black",
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
                                  color: theme === "dark" ? "white" : "black",
                                }}
                              >
                                <Link to={`/bai-viet/${article.slug}`}>
                                  {article.title}
                                </Link>
                              </h5>
                              <p
                                className="post-exerpt font-medium text-muted mb-30 d-none d-lg-block"
                                style={{
                                  color: theme === "dark" ? "#bbb" : "grey",
                                }}
                              >
                                {getShortDescription(article.content, 150)}
                              </p>
                              <div
                                className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase"
                                style={{
                                  color: theme === "dark" ? "#bbb" : "grey",
                                }}
                              >
                                <span className="post-by">
                                  Đăng bởi{" "}
                                  <Link
                                    to={
                                      article.user_id === isAuthor
                                        ? "/tai-khoan"
                                        : `/nguoi-dung/${article.username}`
                                    }
                                    style={{
                                      color:
                                        theme === "dark" ? "white" : "black",
                                    }}
                                  >
                                    {article.fullname}
                                  </Link>
                                </span>
                                <Link to={`/bai-viet/${article.slug}`}>
                                  <span
                                    className="mr-10"
                                    style={{
                                      color:
                                        theme === "dark" ? "white" : "black",
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faAnglesRight} /> Xem
                                    Thêm
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
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
                                  currentPage === index + 1
                                    ? "white"
                                    : theme === "dark"
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

                <div className="col-lg-4 col-md-12 sidebar-right">
                  <div className="sidebar-widget mb-50">
                    <div
                      className="widget-header mb-30 border-radius-10 p-15"
                      style={{
                        backgroundColor: theme === "dark" ? "#333" : "white",
                        color: theme === "dark" ? "white" : "black",
                      }}
                    >
                      <h5
                        className="widget-title mb-0"
                        style={{
                          color: theme === "dark" ? "white" : "black",
                        }}
                      >
                        Bài Viết <span>Mới</span>
                      </h5>
                    </div>
                    <div className="post-aside-style-2">
                      <ul className="list-post">
                        {newArticles.map((article, index) => (
                          <li
                            className="mb-30 wow fadeIn animated"
                            style={{
                              visibility: "visible",
                              animationName: "fadeIn",
                              backgroundColor:
                                theme === "dark" ? "#333" : "white",
                              color: theme === "dark" ? "white" : "black",
                            }}
                            key={index}
                          >
                            <div className="d-flex">
                              <div
                                className="post-thumb d-flex mr-15 border-radius-5 img-hover-scale"
                                style={{
                                  filter:
                                    theme === "dark"
                                      ? "brightness(0.7)"
                                      : "none",
                                }}
                              >
                                <Link
                                  className="color-white"
                                  to={`/bai-viet/${article.slug}`}
                                >
                                  <img
                                    src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                    style={{ height: "80px", width: "80px" }}
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <div className="post-content media-body">
                                <h6
                                  className="post-title mb-10 text-limit-2-row"
                                  style={{
                                    color: theme === "dark" ? "white" : "black",
                                  }}
                                >
                                  <Link to={`/bai-viet/${article.slug}`}>
                                    {article.title}
                                  </Link>
                                </h6>
                                <div
                                  className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase"
                                  style={{
                                    color: theme === "dark" ? "#bbb" : "grey",
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
                                          theme === "dark" ? "white" : "black",
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
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="sidebar-widget mb-50">
                    <div className="widget-header mb-30">
                      <h5
                        className="widget-title"
                        style={{
                          color: theme === "dark" ? "white" : "black",
                        }}
                      >
                        Phổ <span>Biến</span>
                      </h5>
                    </div>
                    <div className="post-aside-style-3">
                      {mostPopular.map((article, index) => (
                        <article
                          key={index}
                          className=" border-radius-15 mb-30 p-10 wow fadeIn animated"
                          style={{
                            backgroundColor:
                              theme === "dark" ? "#333" : "white",
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          <div
                            className="post-thumb d-flex mb-15 border-radius-15 img-hover-scale"
                            style={{
                              filter:
                                theme === "dark" ? "brightness(0.7)" : "none",
                            }}
                          >
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
                              />
                            </Link>
                          </div>
                          <div className="pl-10 pr-10">
                            <h5
                              className="post-title mb-15"
                              style={{
                                color: theme === "dark" ? "white" : "black",
                              }}
                            >
                              <Link to={`/bai-viet/${article.slug}`}>
                                {article.title}
                              </Link>
                            </h5>
                            <div
                              className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase mb-10"
                              style={{
                                color: theme === "dark" ? "#bbb" : "grey",
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
                                    color: theme === "dark" ? "white" : "black",
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
    </>
  );
};

export default XuHuong;
