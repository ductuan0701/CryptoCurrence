import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TaiKhoanServices from "../../services/User/TaiKhoanServices";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Nav } from "react-bootstrap";
import {
  faRss,
  faAnglesRight,
  faUserPlus,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
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
const NguoiDung = () => {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [followerCount, setFollowerCount] = useState(0);
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFollower, setIsFollower] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [activeTabFollower, setActiveTabFollower] = useState("followers");
  const { theme } = useTheme();
  const [isAuthor, setIsAuthor] = useState(-1);
  const [authorFollowing, setAuthorFollowing] = useState([]);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuthorFollowData = async () => {
    try {
      const response = await TaiKhoanServices.listFollowersAndFollowings(
        isAuthor
      );
      if (response && response.following) {
        setAuthorFollowing(response.following);
      } else {
        console.error("No following data found in the response:", response);
      }
    } catch (error) {
      console.error("Error fetching author followers and followings:", error);
    }
  };

  const isFollowedByAuthor = (userId) => {
    return authorFollowing.some((followed) => followed.user_id === userId);
  };

  const handleFollow = async (username, userId) => {
    try {
      const response = await TaiKhoanServices.follow(username);

      if (response.status === 201) {
        setAuthorFollowing((prevFollowing) => [
          ...prevFollowing,
          { username, user_id: userId },
        ]);
      } else {
        console.error("Failed to follow user:", response);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const response = await TaiKhoanServices.checkFollowed(username);
      if (response.status === 200 && response.data.isFollowing) {
        const unfollowResponse = await TaiKhoanServices.follow(username);
        if (unfollowResponse.status === 200) {
          setAuthorFollowing((prevFollowing) =>
            prevFollowing.filter((followed) => followed.username !== username)
          );
        }
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  useEffect(() => {
    fetchAuthorFollowData();
  }, [isAuthor]);

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

  const fetchUser = async () => {
    try {
      const response = await TaiKhoanServices.userByUsername(username);
      setUser(response.data.user);
      setFollowerCount(response.data.followerCount);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchArticles = async (page = 1) => {
    try {
      const response = await TaiKhoanServices.getArticlesByUsername(
        username,
        page
      );
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchFollowed = async () => {
    try {
      const response = await TaiKhoanServices.checkFollowed(username);
      setIsFollower(response.data.isFollowing);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchFollowersData = async () => {
    try {
      setLoading(true);
      const response = await TaiKhoanServices.listFollowersAndFollowings(
        user.user_id
      );
      if (response && response.followers && response.following) {
        setFollowers(response.followers);
        setFollowing(response.following);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching followers and following data:", error);
    } finally {
      setLoading(false);
      setShowFollowers(true);
    }
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    fetchFollowersData();
  };

  const handlePageChange = (page) => {
    fetchArticles(page);
    const element = document.getElementById("list-articles-new");
    if (element) {
      element.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (localStorage.getItem("token")) {
      fetchFollowed();
    }

    fetchUser();
    fetchArticles();
  }, [username]);

  const handelFollow = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để theo dõi!");
    } else {
      try {
        const response = await TaiKhoanServices.follow(username);
        setIsFollower(!isFollower);
        isFollower === true
          ? setFollowerCount(followerCount - 1)
          : setFollowerCount(followerCount + 1);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  };

  return (
    <>
      <main className="position-relative">
        <div className="container">
          <div className="row mb-50">
            <div className="col-lg-2 d-none d-lg-block" />
            <div className="col-lg-8 col-md-12">
              <div className="author-bio border-radius-10 p-30 mb-50">
                <div className="author-image mb-30">
                  <Link to="#">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${user.avatar_url}`}
                      alt=""
                      className="avatar"
                      style={{ width: "90px", height: "90px" }}
                    />
                  </Link>
                </div>
                <div className="author-info">
                  <h3
                    style={{
                      color: theme === "dark" ? "white" : "black", // Adjust text color
                    }}
                  >
                    <span className="vcard author">
                      <span className="fn">
                        <Link
                          to="#"
                          title={`Posts by ${user.fullname}`}
                          rel="author"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          {user.fullname}
                        </Link>
                      </span>
                    </span>
                  </h3>
                  <h5
                    className="text-muted"
                    style={{
                      color: theme === "dark" ? "black" : "white",
                    }}
                  >
                    <span className="mr-15">{user.email}</span>
                  </h5>
                  <div
                    className="author-description"
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    {user.bio == null
                      ? "Chưa có thông tin giới thiệu."
                      : user.bio}
                  </div>

                  <Link
                    to="#"
                    className="author-bio-link"
                    onClick={handleLinkClick}
                  >
                    <span className="mr-5 font-x-small">
                      <FontAwesomeIcon icon={faRss} />
                    </span>
                    {followerCount} người theo dõi
                  </Link>
                  <Modal
                    show={showFollowers}
                    onHide={() => setShowFollowers(false)}
                    size="lg"
                  >
                    <Modal.Header>
                      <Modal.Title>
                        Danh sách người theo dõi và người đang theo dõi
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <>
                          <Nav
                            variant="tab-follower"
                            defaultActiveKey="followers"
                          >
                            <Nav.Item>
                              <Nav.Link
                                eventKey="followers"
                                onClick={() =>
                                  setActiveTabFollower("followers")
                                }
                                active={activeTabFollower === "followers"}
                                className={`tab-fol ${
                                  activeTabFollower === "followers"
                                    ? "active"
                                    : ""
                                }`}
                              >
                                Người theo dõi ({followers.length})
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link
                                eventKey="following"
                                onClick={() =>
                                  setActiveTabFollower("following")
                                }
                                active={activeTabFollower === "following"}
                                className={`tab-fol ${
                                  activeTabFollower === "following"
                                    ? "active"
                                    : ""
                                }`}
                              >
                                Đang theo dõi ({following.length})
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>

                          {activeTabFollower === "followers" && (
                            <>
                              <ul>
                                {followers.map((follower) => (
                                  <li
                                    key={follower.user_id}
                                    className="d-flex align-items-center justify-content-between mb-2 mt-20"
                                  >
                                    <div className="d-flex align-items-center">
                                      <Link
                                        className="text-white"
                                        to={
                                          follower.user_id === isAuthor
                                            ? "/tai-khoan"
                                            : `/nguoi-dung/${follower.username}`
                                        }
                                        onClick={() => setShowFollowers(false)}
                                      >
                                        <img
                                          src={`${process.env.REACT_APP_API_URL}/${follower.avatar_url}`}
                                          alt={follower.fullName}
                                          className="rounded-circle"
                                          width="50"
                                          height="50"
                                        />
                                      </Link>
                                      <div className="ml-2">
                                        <strong>{follower.username}</strong>
                                        <div>{follower.fullName}</div>
                                      </div>
                                    </div>
                                    {follower.user_id !== isAuthor && (
                                      <div className="d-flex align-items-center">
                                        <Link
                                          onClick={() => {
                                            if (
                                              isFollowedByAuthor(
                                                follower.user_id
                                              )
                                            ) {
                                              handleUnfollow(follower.username);
                                            } else {
                                              handleFollow(
                                                follower.username,
                                                follower.user_id
                                              );
                                            }
                                          }}
                                          to="#"
                                          className="ml-auto author-bio-link text-muted"
                                          style={{ textTransform: "unset" }}
                                        >
                                          {isFollowedByAuthor(
                                            follower.user_id
                                          ) ? (
                                            <>
                                              <FontAwesomeIcon
                                                icon={faUserMinus}
                                              />{" "}
                                              Hủy Theo Dõi
                                            </>
                                          ) : (
                                            <>
                                              <FontAwesomeIcon
                                                icon={faUserPlus}
                                              />{" "}
                                              Theo Dõi
                                            </>
                                          )}
                                        </Link>
                                      </div>
                                    )}

                                    {follower.user_id === isAuthor && (
                                      <span className="text-danger mr-8 font-weight-bold">
                                        YOU
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {activeTabFollower === "following" && (
                            <>
                              <ul>
                                {following.length === 0 ? (
                                  <p>Không có ai đang theo dõi.</p>
                                ) : (
                                  following.map((followed) => (
                                    <li
                                      key={followed.user_id}
                                      className="d-flex align-items-center justify-content-between mb-2 mt-20"
                                    >
                                      <div className="d-flex align-items-center">
                                        <Link
                                          className="text-white"
                                          to={
                                            followed.user_id === isAuthor
                                              ? "/tai-khoan"
                                              : `/nguoi-dung/${followed.username}`
                                          }
                                          onClick={() =>
                                            setShowFollowers(false)
                                          }
                                        >
                                          <img
                                            src={`${process.env.REACT_APP_API_URL}/${followed.avatar_url}`}
                                            alt={followed.fullName}
                                            className="rounded-circle"
                                            width="50"
                                            height="50"
                                          />
                                        </Link>
                                        <div className="ml-2">
                                          <strong>{followed.username}</strong>
                                          <div>{followed.fullName}</div>
                                        </div>
                                      </div>
                                      {followed.user_id !== isAuthor && (
                                        <div className="d-flex align-items-center">
                                          <Link
                                            onClick={() => {
                                              if (
                                                isFollowedByAuthor(
                                                  followed.user_id
                                                )
                                              ) {
                                                handleUnfollow(
                                                  followed.username
                                                );
                                              } else {
                                                handleFollow(
                                                  followed.username,
                                                  followed.user_id
                                                );
                                              }
                                            }}
                                            to="#"
                                            className="ml-auto author-bio-link text-muted"
                                            style={{ textTransform: "unset" }}
                                          >
                                            {isFollowedByAuthor(
                                              followed.user_id
                                            ) ? (
                                              <>
                                                <FontAwesomeIcon
                                                  icon={faUserMinus}
                                                />{" "}
                                                Hủy Theo Dõi
                                              </>
                                            ) : (
                                              <>
                                                <FontAwesomeIcon
                                                  icon={faUserPlus}
                                                />{" "}
                                                Theo Dõi
                                              </>
                                            )}
                                          </Link>
                                        </div>
                                      )}

                                      {followed.user_id === isAuthor && (
                                        <span className="text-danger mr-8 font-weight-bold">
                                          YOU
                                        </span>
                                      )}
                                    </li>
                                  ))
                                )}
                              </ul>
                            </>
                          )}
                        </>
                      )}
                    </Modal.Body>

                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowFollowers(false)}
                      >
                        Đóng
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Link
                    to="#"
                    className="author-bio-link"
                    onClick={handelFollow}
                  >
                    {isFollower === true ? (
                      <>
                        <span className="mr-5 font-x-small">
                          <FontAwesomeIcon icon={faUserMinus} />
                        </span>
                        Hủy Theo Dõi
                      </>
                    ) : (
                      <>
                        <span className="mr-5 font-x-small">
                          <FontAwesomeIcon icon={faUserPlus} />
                        </span>
                        Theo Dõi
                      </>
                    )}
                  </Link>
                  <div className="author-social">
                    <ul
                      className="author-social-icons"
                      style={{ display: "flex", gap: "10px" }}
                    >
                      <li className="author-social-link-facebook">
                        <Link
                          to="#"
                          style={{
                            color: theme === "dark" ? "#4267B2" : "#3b5998",
                          }}
                        >
                          <i className="ti-facebook" />
                        </Link>
                      </li>
                      <li className="author-social-link-twitter">
                        <Link
                          to="#"
                          style={{
                            color: theme === "dark" ? "#1DA1F2" : "#00acee",
                          }}
                        >
                          <i className="ti-twitter-alt" />
                        </Link>
                      </li>
                      <li className="author-social-link-pinterest">
                        <Link
                          to="#"
                          style={{
                            color: theme === "dark" ? "#E60023" : "#BD081C",
                          }}
                        >
                          <i className="ti-pinterest" />
                        </Link>
                      </li>
                      <li className="author-social-link-instagram">
                        <Link
                          to="#"
                          style={{
                            color: theme === "dark" ? "#E1306C" : "#C13584",
                          }}
                        >
                          <i className="ti-instagram" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {articles.length === 0 ? (
                <h2
                  style={{
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  Chưa có bài viết
                </h2>
              ) : (
                <h2
                  id="list-articles-new"
                  style={{
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  Danh sách bài viết
                </h2>
              )}

              <hr className="wp-block-separator is-style-wide" />
              <div className="latest-post mb-50">
                <div className="loop-list-style-1">
                  {articles.map((article, index) =>
                    index === 0 ? (
                      <article
                        key={index}
                        className="first-post mb-30 wow fadeIn animated"
                        style={{
                          color: theme === "dark" ? "#f0f0f0" : "#000",
                        }}
                      >
                        <div className="img-hover-slide border-radius-15 mb-30 position-relative overflow-hidden">
                          <span
                            className="top-right-icon"
                            style={{
                              color: theme === "dark" ? "#fff" : "#f0f0f0",
                            }}
                          >
                            <i className="mdi mdi-flash-on" />
                          </span>
                          <Link to={`/bai-viet/${article.slug}`}>
                            <img
                              style={{ height: "380px", width: "100%" }}
                              src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                              alt="post-slider"
                            />
                          </Link>
                        </div>
                        <div className="pr-10 pl-10">
                          <h4 className="post-title mb-20">
                            <Link
                              to={`/bai-viet/${article.slug}`}
                              style={{
                                color: theme === "dark" ? "#e0e0e0" : "#000",
                              }}
                            >
                              {article.title}
                            </Link>
                          </h4>
                          <p
                            className="post-exerpt font-medium mb-30"
                            style={{
                              color: theme === "dark" ? "#ccc" : "#6c757d",
                            }}
                          >
                            {getShortDescription(article.content, 150)}
                          </p>
                          <div className="mb-20 overflow-hidden">
                            <div
                              className="entry-meta meta-1 font-x-small float-left text-uppercase"
                              style={{
                                color: theme === "dark" ? "#999" : "#6c757d",
                              }}
                            >
                              <span className="post-by">
                                Đăng bởi{" "}
                                <Link
                                  to="#"
                                  style={{
                                    color: theme === "dark" ? "#fff" : "#000",
                                  }}
                                >
                                  {user.fullname}
                                </Link>
                              </span>
                              <span className="post-on">
                                {new Date(article.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            <div className="float-right">
                              <Link to={`/bai-viet/${article.slug}`}>
                                <span className="mr-10">
                                  <FontAwesomeIcon
                                    icon={faAnglesRight}
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#000",
                                    }}
                                  />
                                </span>
                                <span
                                  style={{
                                    color: theme === "dark" ? "#fff" : "#000",
                                  }}
                                >
                                  ĐỌC THÊM
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <article
                        key={index}
                        className="mb-30 wow fadeIn animated"
                        style={{
                          color: theme === "dark" ? "#e0e0e0" : "#000",
                        }}
                      >
                        <div className="d-md-flex d-block">
                          <div className="post-thumb post-thumb-big d-flex mr-15 border-radius-15 img-hover-scale">
                            <Link
                              className="color-white"
                              to={`/bai-viet/${article.slug}`}
                              style={{
                                color: theme === "dark" ? "#fff" : "#000",
                              }}
                            >
                              <img
                                className="border-radius-15"
                                src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="post-content media-body">
                            <div className="entry-meta mb-15 mt-10">
                              <Link
                                className="entry-meta meta-2"
                                to="#"
                                style={{
                                  color:
                                    theme === "dark" ? "#ff6666" : "#dc3545",
                                }}
                              >
                                <span className="post-in font-x-small">
                                  {new Date(
                                    article.createdAt
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </Link>
                            </div>
                            <h5 className="post-title mb-15 text-limit-2-row">
                              <Link
                                to={`/bai-viet/${article.slug}`}
                                style={{
                                  color: theme === "dark" ? "#e0e0e0" : "#000",
                                }}
                              >
                                {article.title}
                              </Link>
                            </h5>
                            <p
                              className="post-exerpt font-medium mb-30 d-none d-lg-block"
                              style={{
                                color: theme === "dark" ? "#ccc" : "#6c757d",
                              }}
                            >
                              {getShortDescription(article.content, 150)}
                            </p>
                            <div className="entry-meta meta-1 font-x-small float-left text-uppercase">
                              <span className="post-by">
                                Đăng bởi{" "}
                                <Link
                                  to="#"
                                  style={{
                                    color: theme === "dark" ? "#fff" : "#000",
                                  }}
                                >
                                  {user.fullname}
                                </Link>
                              </span>
                              <Link to={`/bai-viet/${article.slug}`}>
                                <span className="mr-10">
                                  <FontAwesomeIcon
                                    icon={faAnglesRight}
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#000",
                                    }}
                                  />
                                </span>
                                <span
                                  style={{
                                    color: theme === "dark" ? "#fff" : "#000",
                                  }}
                                >
                                  Xem Thêm
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  )}
                </div>
              </div>
              {articles.length !== 0 ? (
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
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NguoiDung;
