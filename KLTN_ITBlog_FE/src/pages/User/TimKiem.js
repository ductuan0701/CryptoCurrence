import { useEffect, useState } from "react";
import TrangChuServices from "../../services/User/TrangChuServices";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";

function getShortDescription(content, length = 100) {
  const plainText = content.replace(/<[^>]+>/g, "");
  return plainText.length > length
    ? plainText.substring(0, length) + "..."
    : plainText;
}

const TimKiem = () => {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResult, setTotalResult] = useState(0);
  const [hoveredPage, setHoveredPage] = useState(null);
  const { theme } = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("s");

  const fetchArticles = async (page = 1) => {
    try {
      const response = await TrangChuServices.getListArticles(page, search);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
      setTotalResult(response.data.totalArticles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search]);

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
          <div
            className="archive-header text-center mb-50"
            style={{
              color: theme === "dark" ? "#bbb" : "#777",
            }}
          >
            <div className="container">
              <h2>
                <span className="text-success">Tìm kiếm cho "{search}"</span>
              </h2>
              <div
                className="breadcrumb"
                style={{
                  color: theme === "dark" ? "#ddd" : "#555",
                }}
              >
                {articles.length === 0 ? (
                  <span className="no-arrow">Không tìm thấy bài viết nào</span>
                ) : (
                  <span className="no-arrow">
                    Có{" "}
                    <strong
                      className="text-black font-large"
                      style={{
                        color: theme === "dark" ? "#eee" : "#000",
                      }}
                    >
                      {totalResult}
                    </strong>{" "}
                    bài viết được tìm thấy phù hợp với kết quả tìm kiếm
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-9 order-1 order-md-2">
              <div className="row mb-50">
                <div className="col-lg-8 col-md-12">
                  <div
                    className={
                      articles.length === 0
                        ? "latest-post"
                        : "latest-post mb-50"
                    }
                    style={{
                      color: theme === "dark" ? "#ccc" : "#444",
                    }}
                  >
                    <div className="loop-list-style-1">
                      {articles.map((article, index) => (
                        <article
                          key={index}
                          className="p-10 border-radius-10 mb-30 wow fadeIn animated"
                          style={{
                            color: theme === "dark" ? "#fff" : "#000",
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
                                />
                              </Link>
                            </div>
                            <div className="post-content media-body">
                              <div
                                className="entry-meta mb-15 mt-10"
                                style={{
                                  color: theme === "dark" ? "#aaa" : "#555",
                                }}
                              >
                                <Link
                                  className="entry-meta meta-2"
                                  to="#"
                                  style={{
                                    color: theme === "dark" ? "#ddd" : "#777",
                                  }}
                                >
                                  <span className="post-in text-danger font-x-small">
                                    {new Date(
                                      article.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                </Link>
                              </div>
                              <h5
                                className="post-title mb-15 text-limit-2-row"
                                style={{
                                  color: theme === "dark" ? "#f5f5f5" : "#000",
                                }}
                              >
                                <Link to={`/bai-viet/${article.slug}`}>
                                  {article.title}
                                </Link>
                              </h5>
                              <p
                                className="post-exerpt font-medium text-muted mb-30 d-none d-lg-block"
                                style={{
                                  color: theme === "dark" ? "#ccc" : "#888",
                                }}
                              >
                                {getShortDescription(article.content, 150)}
                              </p>
                              <div
                                className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase"
                                style={{
                                  color: theme === "dark" ? "#aaa" : "#666",
                                }}
                              >
                                <span className="post-by">
                                  Đăng bởi{" "}
                                  <Link
                                    to={`/nguoi-dung/${article.fullname}`}
                                    style={{
                                      color:
                                        theme === "dark" ? "#f5f5f5" : "#000",
                                    }}
                                  >
                                    {article.user.fullname}
                                  </Link>
                                </span>
                                <Link to={`/bai-viet/${article.slug}`}>
                                  <span
                                    className="mr-10 "
                                    style={{
                                      color:
                                        theme === "dark" ? "#f5f5f5" : "#000",
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
                                    ? "#bbb"
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
                <div
                  className={
                    articles.length === 0
                      ? "col-lg-12 col-md-12 sidebar-right"
                      : "col-lg-4 col-md-12 sidebar-right"
                  }
                >
                  <div
                    className="sidebar-widget p-20 border-radius-15 widget-text wow fadeIn animated"
                    style={{
                      visibility: "visible",
                      animationName: "fadeIn",
                    }}
                  >
                    <div className="widget-header mb-30">
                      <h5
                        className="widget-title "
                        style={{
                          color: theme === "dark" ? "#f5f5f5" : "#000",
                        }}
                      >
                        Mẹo <span>tìm kiếm</span>
                      </h5>
                    </div>
                    <div>
                      <h6
                        style={{
                          color: theme === "dark" ? "#f5f5f5" : "#000",
                        }}
                      >
                        1. Sử dụng các tab
                      </h6>
                      <p className="font-small text-muted">
                        Đầu tiên, hãy tận dụng các tab khi tìm kiếm trên Google.
                        Ở trên thanh tìm kiếm sẽ có các tab như Web, Hình ảnh,
                        Tin tức... Bạn có thể chọn tab phù hợp để Google tập
                        trung vào kiểu nội dung bạn cần.
                      </p>
                      <h6
                        style={{
                          color: theme === "dark" ? "#f5f5f5" : "#000",
                        }}
                      >
                        2. Sử dụng dấu ngoặc kép
                      </h6>
                      <p className="font-small text-muted">
                        Khi bạn cần tìm kiếm chính xác một cụm từ nào đó, hãy
                        dùng dấu ngoặc kép. Điều này sẽ giúp Google chỉ tìm kiếm
                        những kết quả chứa chính xác cụm từ bạn muốn, giúp tiết
                        kiệm thời gian và cho ra kết quả chính xác hơn.
                      </p>
                      <h6
                        style={{
                          color: theme === "dark" ? "#f5f5f5" : "#000",
                        }}
                      >
                        3. Loại trừ từ với dấu gạch ngang
                      </h6>
                      <p className="font-small text-muted">
                        Đôi khi bạn muốn tìm kiếm một từ nhưng lại có quá nhiều
                        nghĩa. Ví dụ, khi tìm "Mustang", bạn có thể nhận được
                        kết quả về xe Ford hoặc loài ngựa hoang. Để loại trừ một
                        trong hai, hãy thêm dấu gạch ngang trước từ bạn muốn bỏ
                        qua, như "Mustang -xe" hoặc "Mustang -ngựa".
                      </p>
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

export default TimKiem;
