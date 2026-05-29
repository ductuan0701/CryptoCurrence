import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TaiKhoanServices from "../../services/User/TaiKhoanServices";
import BaiVietServices from "../../services/User/BaiVietServices";
import { toast } from "react-toastify";
import { Modal, Button, Form, Image, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRss,
  faUserPen,
  faRightFromBracket,
  faPenToSquare,
  faAnglesRight,
  faCamera,
  faCircleExclamation,
  faUserPlus,
  faUserMinus,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";

function getShortDescription(content, length = 100) {
  // Loại bỏ các thẻ HTML
  const plainText = content.replace(/<[^>]+>/g, "");
  // Lấy một số ký tự đầu tiên làm mô tả ngắn
  return plainText.length > length
    ? plainText.substring(0, length) + "..."
    : plainText;
}

const TaiKhoan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [articles, setArticles] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [show, setShow] = useState(false);
  const [fullname, setFullname] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPriview, setAvatarPriview] = useState("");
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPage, setHoveredPage] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [activeTabFollower, setActiveTabFollower] = useState("followers");
  const { theme } = useTheme();
  const fetchUser = async () => {
    try {
      const response = await TaiKhoanServices.profile();
      setUser(response.data.user);
      setFollowerCount(response.data.followerCount);
      setFullname(response.data.user.fullname);
      setAvatarPriview(
        `${process.env.REACT_APP_API_URL}/${response.data.user.avatar_url}`
      );
      setBio(response.data.user.bio);
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

  const handelFollow = async (username) => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để theo dõi!");
      return;
    }

    try {
      const response = await TaiKhoanServices.follow(username);
      const isCurrentlyFollowing = following.some(
        (followed) => followed.username === username
      );
      console.log(isCurrentlyFollowing);
      if (isCurrentlyFollowing === false) {
        const followedUser = followers.find(
          (follower) => follower.username === username
        );
        if (followedUser) {
          setFollowing((prevFollowing) => [...prevFollowing, followedUser]);
        }
        setFollowerCount(followerCount + 1);
      } else {
        setFollowing((prevFollowing) =>
          prevFollowing.filter((followed) => followed.username !== username)
        );
        setFollowerCount(followerCount - 1);
      }
    } catch (error) {
      console.error("Error while making the follow/unfollow API call:", error);
    }
  };

  const fetchArticles = async (page = 1) => {
    try {
      const response = await BaiVietServices.listArticles(page);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/dang-nhap");
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchArticles();
    window.scroll(0, 0);
  }, []);

  const handelLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    toast.success("Đăng xuất thành công");
    navigate("/dang-nhap");
  };

  const handlePageChange = (page) => {
    fetchArticles(page);
    const element = document.getElementById("list-articles-new");
    if (element) {
      element.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setCurrentPage(page);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarUrl(file);
      setAvatarPriview(URL.createObjectURL(file));
    }
  };

  const handleNextChangePassword = () => {
    setIsChangePassword(true);
  };

  const handleChangePassword = async () => {
    const data = {
      password,
      newPassword,
      confirmPassword,
    };
    const changePassword = await TaiKhoanServices.changePassword(data);

    if (changePassword.status === 200) {
      toast.success(changePassword.data.message);
      setShow(false);
    } else {
      toast.success(changePassword.response.data.message);
    }

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("bio", bio);
    formData.append("avatar_url", avatarUrl);

    const update = await TaiKhoanServices.update(formData);

    if (update.status === 200) {
      toast.success(update.data.message);
      fetchUser();
    } else {
      toast.success(update.response.data.message);
    }
    setShow(false);
  };

  const handleBackToInfo = () => {
    setIsChangePassword(false);
  };
  const filterArticles = () => {
    switch (activeTab) {
      case "pending":
        const pendingArticles = articles.filter(
          (article) =>
            article.privacy === "private" && article.is_draft === false
        );
        console.log("Pending Articles:", pendingArticles);
        return pendingArticles;

      case "rejected":
        return articles.filter(
          (article) =>
            article.privacy === "private" &&
            article.is_draft === true &&
            article.slug === "[rejected]"
        );

      case "drafts":
        return articles.filter(
          (article) =>
            article.privacy === "private" &&
            article.is_draft === true &&
            article.slug !== "[rejected]"
        );

      case "approved":
        return articles.filter(
          (article) =>
            article.privacy === "public" && article.is_draft === false
        );

      default:
        return articles;
    }
  };

  const filteredArticles = filterArticles();
  return (
    <>
      <main className="position-relative">
        <div className="container">
          <div className="row mb-50">
            <div className="col-lg-2 d-none d-lg-block" />
            <div className="col-lg-8 col-md-12">
              <div className="author-bio border-radius-10 p-30 mb-50">
                <div className="author-image mb-30">
                  <a href={"/tai-khoan"}>
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${user.avatar_url}`}
                      alt=""
                      className="avatar"
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "50%",
                      }}
                    />
                  </a>
                </div>

                <div className="author-info">
                  <h3>
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
                      color: theme === "dark" ? "#aaa" : "black",
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
                    onClick={handleLinkClick}
                    className="author-bio-link"
                    style={{ textTransform: "unset" }}
                  >
                    <span className="mr-5 font-x-small">
                      <FontAwesomeIcon icon={faRss} />{" "}
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
                                {followers.length === 0 ? (
                                  <p>Không có người theo dõi nào.</p>
                                ) : (
                                  followers.map((follower) => {
                                    const isFollowingBack = following.some(
                                      (followed) =>
                                        followed.user_id === follower.user_id
                                    );

                                    return (
                                      <li
                                        key={follower.user_id}
                                        className="d-flex align-items-center mb-2 mt-20"
                                      >
                                        <Link
                                          className="text-white"
                                          to={`/nguoi-dung/${follower.username}`}
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
                                        <Link
                                          onClick={() =>
                                            handelFollow(follower.username)
                                          }
                                          to="#"
                                          className="ml-auto author-bio-link text-muted"
                                          style={{ textTransform: "unset" }}
                                        >
                                          {isFollowingBack ? (
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
                                      </li>
                                    );
                                  })
                                )}
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
                                      className="d-flex align-items-center mb-2 mt-20"
                                    >
                                      <Link
                                        className="text-white"
                                        to={`/nguoi-dung/${followed.username}`}
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
                                      <Link
                                        onClick={() =>
                                          handelFollow(followed.username)
                                        }
                                        to="#"
                                        className="ml-auto author-bio-link text-muted"
                                        style={{ textTransform: "unset" }}
                                      >
                                        <FontAwesomeIcon icon={faUserMinus} />{" "}
                                        Hủy Theo Dõi
                                      </Link>
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
                    onClick={() => setShow(true)}
                    className="author-bio-link"
                    style={{ textTransform: "unset" }}
                  >
                    <span className="mr-5 font-x-small">
                      <FontAwesomeIcon icon={faUserPen} />{" "}
                    </span>
                    Cập nhật thông tin
                  </Link>
                  <Link
                    to={
                      !localStorage.getItem("token")
                        ? "/dang-nhap"
                        : "/thong-ke"
                    }
                    className="author-bio-link"
                    style={{ textTransform: "unset" }}
                  >
                    <span className="mr-5 font-x-small">
                      <FontAwesomeIcon icon={faChartSimple} />{" "}
                    </span>
                    Thống kê
                  </Link>
                  <a
                    href="author.html"
                    onClick={(e) => handelLogout(e)}
                    className="author-bio-link"
                    style={{ textTransform: "unset" }}
                  >
                    <span className="mr-5 font-x-small">
                      <FontAwesomeIcon icon={faRightFromBracket} />{" "}
                    </span>
                    Đăng xuất
                  </a>
                </div>
              </div>
              <div>
                <div className="tabs">
                  <div
                    className={`tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Tất cả
                  </div>
                  <div
                    className={`tab ${
                      activeTab === "approved" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("approved")}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Được Duyệt
                  </div>
                  <div
                    className={`tab ${activeTab === "pending" ? "active" : ""}`}
                    onClick={() => setActiveTab("pending")}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Chờ Duyệt
                  </div>
                  <div
                    className={`tab ${
                      activeTab === "rejected" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("rejected")}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Bị Từ Chối
                  </div>
                  <div
                    className={`tab ${activeTab === "drafts" ? "active" : ""}`}
                    onClick={() => setActiveTab("drafts")}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Nháp
                  </div>
                </div>

                <div
                  className="tab-content"
                  style={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  {filteredArticles.length === 0 ? (
                    <h2
                      style={{
                        color: theme === "dark" ? "white" : "black",
                      }}
                    >
                      Chưa có bài viết
                    </h2>
                  ) : (
                    <>
                      {activeTab === "all" && (
                        <h2
                          id="list-articles-new"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Danh sách tất cả bài viết
                        </h2>
                      )}
                      {activeTab === "pending" && (
                        <h2
                          id="list-articles-new"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Các bài viết đang chờ duyệt
                        </h2>
                      )}
                      {activeTab === "rejected" && (
                        <h2
                          id="list-articles-new"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Các bài viết bị từ chối
                        </h2>
                      )}
                      {activeTab === "drafts" && (
                        <h2
                          id="list-articles-new"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Các bài viết nháp
                        </h2>
                      )}
                      {activeTab === "approved" && (
                        <h2
                          id="list-articles-new"
                          style={{
                            color: theme === "dark" ? "white" : "black",
                          }}
                        >
                          Các bài viết đã được duyệt
                        </h2>
                      )}
                    </>
                  )}
                </div>

                <main className="latest-post mb-50">
                  <div className="loop-list-style-1">
                    {filteredArticles.length === 0 ? null : (
                      <>
                        <hr className="wp-block-separator is-style-wide" />
                        <div className="latest-post mb-50">
                          <div className="loop-list-style-1">
                            {filteredArticles.map((article, index) =>
                              index === 0 ? (
                                <article
                                  key={article.article_id}
                                  className="first-post p-10 border-radius-10 mb-30 wow fadeIn animated"
                                  style={{
                                    backgroundColor:
                                      theme === "dark" ? "#333" : "white", // Article background color
                                    color: theme === "dark" ? "white" : "black", // Text color for the article
                                  }}
                                >
                                  <div className="img-hover-slide border-radius-15 mb-30 position-relative overflow-hidden">
                                    <span className="top-right-icon bg-dark">
                                      <i className="mdi mdi-flash-on" />
                                    </span>
                                    <Link to={`/bai-viet/${article.slug}`}>
                                      <img
                                        style={{
                                          height: "380px",
                                          width: "100%",
                                        }}
                                        src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                                        alt="post-slider"
                                      />
                                    </Link>
                                  </div>
                                  <div className="pr-10 pl-10">
                                    <h4
                                      className="post-title mb-20"
                                      style={{
                                        color:
                                          theme === "dark" ? "white" : "black", // Title color
                                      }}
                                    >
                                      <Link to={`/bai-viet/${article.slug}`}>
                                        {article.title}
                                      </Link>
                                    </h4>
                                    <p
                                      className="post-exerpt font-medium text-muted mb-30"
                                      style={{
                                        color:
                                          theme === "dark"
                                            ? "lightgray"
                                            : "black", // Description color
                                      }}
                                    >
                                      {getShortDescription(
                                        article.content,
                                        150
                                      )}
                                    </p>
                                    <div className="mb-20 overflow-hidden">
                                      <div className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase">
                                        <span className="post-by">
                                          Đăng bởi{" "}
                                          <Link
                                            to="#"
                                            style={{
                                              color:
                                                theme === "dark"
                                                  ? "lightgray"
                                                  : "black",
                                            }}
                                          >
                                            {user.fullname}
                                          </Link>
                                        </span>
                                        <span
                                          className="post-on"
                                          style={{
                                            color:
                                              theme === "dark"
                                                ? "lightgray"
                                                : "black",
                                          }}
                                        >
                                          {new Date(
                                            article.createdAt
                                          ).toLocaleDateString("vi-VN")}
                                        </span>
                                      </div>
                                      <div className="float-right">
                                        <Link
                                          to={`/chinh-sua/${article.article_id}`}
                                          style={{
                                            color:
                                              theme === "dark"
                                                ? "lightgray"
                                                : "black",
                                          }}
                                        >
                                          {article.slug === "[rejected]" ? (
                                            <>
                                              <span className="mr-10">
                                                <FontAwesomeIcon
                                                  icon={faCircleExclamation}
                                                />
                                              </span>
                                              Bị Từ Chối
                                            </>
                                          ) : (
                                            <>
                                              <span className="mr-10">
                                                <FontAwesomeIcon
                                                  icon={faPenToSquare}
                                                />
                                              </span>
                                              Chỉnh Sửa
                                            </>
                                          )}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </article>
                              ) : (
                                <article
                                  key={article.article_id}
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
                                        />
                                      </Link>
                                    </div>
                                    <div className="post-content media-body">
                                      <div className="entry-meta mb-15 mt-10">
                                        <Link
                                          className="entry-meta meta-2"
                                          to="#"
                                        >
                                          <span
                                            className="post-in text-danger font-x-small"
                                            style={{
                                              color:
                                                theme === "dark"
                                                  ? "lightgray"
                                                  : "black",
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
                                          color:
                                            theme === "dark"
                                              ? "white"
                                              : "black",
                                        }}
                                      >
                                        <Link to={`/bai-viet/${article.slug}`}>
                                          {article.title}
                                        </Link>
                                      </h5>
                                      <p
                                        className="post-exerpt font-medium text-muted mb-30 d-none d-lg-block"
                                        style={{
                                          color:
                                            theme === "dark"
                                              ? "lightgray"
                                              : "black",
                                        }}
                                      >
                                        {getShortDescription(
                                          article.content,
                                          150
                                        )}
                                      </p>
                                      <div className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase">
                                        <span className="post-by">
                                          Đăng bởi{" "}
                                          <Link
                                            to="#"
                                            style={{
                                              color:
                                                theme === "dark"
                                                  ? "lightgray"
                                                  : "black",
                                            }}
                                          >
                                            {user.fullname}
                                          </Link>
                                        </span>
                                        <Link to={`/bai-viet/${article.slug}`}>
                                          <span
                                            className="mr-10"
                                            style={{
                                              color:
                                                theme === "dark"
                                                  ? "white"
                                                  : "black",
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faAnglesRight}
                                            />{" "}
                                            Xem Thêm
                                          </span>
                                        </Link>
                                      </div>
                                    </div>
                                    <div className="float-right">
                                      <Link
                                        to={`/chinh-sua/${article.article_id}`}
                                        style={{
                                          color:
                                            theme === "dark"
                                              ? "lightgray"
                                              : "black",
                                        }}
                                      >
                                        {article.slug === "[rejected]" ? (
                                          <>
                                            <span className="mr-10">
                                              <FontAwesomeIcon
                                                icon={faCircleExclamation}
                                              />
                                            </span>
                                            Bị Từ Chối
                                          </>
                                        ) : (
                                          <>
                                            <span className="mr-10">
                                              <FontAwesomeIcon
                                                icon={faPenToSquare}
                                              />
                                            </span>
                                            Chỉnh Sửa
                                          </>
                                        )}
                                      </Link>
                                    </div>
                                  </div>
                                </article>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </main>
              </div>
              {filteredArticles.length !== 0 ? (
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
        <Modal show={show} onHide={() => setShow(false)} size="lg">
          <Modal.Header>
            <Modal.Title>
              {isChangePassword ? "Đổi Mật Khẩu" : "Cập Nhật Thông Tin"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isChangePassword ? (
              <Form>
                <Form.Group controlId="oldPassword" className="mb-3">
                  <Form.Label>Mật khẩu cũ</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ"
                  />
                </Form.Group>
                <Form.Group controlId="newPassword" className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </Form.Group>
              </Form>
            ) : (
              <Form>
                <div className="text-center mb-4">
                  <Image
                    src={avatarPriview}
                    roundedCircle
                    alt="Avatar"
                    className="avatar-preview"
                  />
                  <Form.Group controlId="avatarUrl" className="mt-3">
                    <Form.Label className="btn-upload">
                      <FontAwesomeIcon icon={faCamera} /> Chọn ảnh
                      <Form.Control
                        type="file"
                        className="d-none"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Form.Label>
                  </Form.Group>
                </div>

                <Form.Group controlId="fullname" className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="bio" className="mb-3">
                  <Form.Label>Tiểu sử</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập tiểu sử ngắn gọn"
                    value={bio ?? ""}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            {!isChangePassword && (
              <>
                <Button
                  className="btn-profile-update"
                  onClick={handleNextChangePassword}
                >
                  Đổi Mật Khẩu
                </Button>
                <Button
                  className="btn-profile-update"
                  onClick={(e) => handleSaveInfo(e)}
                >
                  Lưu Thông Tin
                </Button>
              </>
            )}
            {isChangePassword && (
              <>
                <Button
                  className="btn-profile-update"
                  onClick={handleBackToInfo}
                >
                  Quay lại
                </Button>
                <Button
                  className="btn-profile-update"
                  onClick={handleChangePassword}
                >
                  Đổi Mật Khẩu
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

export default TaiKhoan;
