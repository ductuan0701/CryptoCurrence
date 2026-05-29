import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BaiVietServices from "../../services/User/BaiVietServices";
import TaiKhoanServices from "../../services/User/TaiKhoanServices";
import BinhLuanServices from "../../services/BinhLuanServices";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faRss,
  faUserPlus,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useTheme } from "../../context/ThemeContext";
const decodeJWT = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("JWT không hợp lệ");
  }

  const payload = parts[1];
  const decoded = CryptoJS.enc.Base64.parse(payload);
  return JSON.parse(decoded.toString(CryptoJS.enc.Utf8));
};

const colors = [
  "bg-warning",
  "bg-primary",
  "bg-success",
  "bg-danger",
  "bg-info",
  "bg-dark",
];
const BaiViet = () => {
  const [data, setData] = useState([]);
  const [article, setArticle] = useState({});
  const [author, setAuthor] = useState({});
  const [view, setView] = useState(0);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [user, setUser] = useState({});
  const [isAuthor, setIsAuthor] = useState(-1);
  const [isFollower, setIsFollower] = useState(false);
  const [comments, setComments] = useState([]);
  const [postComment, setPostComment] = useState("");
  const [related, setRelated] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { theme } = useTheme();

  const currentUrl = window.location.href;
  const handleDelete = async (id) => {
    try {
      setComments(comments.filter((comment) => comment.comment_id !== id));
      const destroy = await BinhLuanServices.delete(id);
      toast.success(destroy.data.message);
    } catch (error) {
      setComments([...comments]);
      toast.error("Lỗi khi xóa bình luận");
    }
  };

  const fetchArticle = async (slugArticle = slug) => {
    try {
      const response = await BaiVietServices.showArticle(slugArticle);

      let articleContent = response.data.article.content;

      // Danh sách các định dạng nhúng cho các nền tảng video
      const embedFormats = [
        {
          name: "YouTube",
          regex:
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
          format: (id) => `https://www.youtube.com/embed/${id}`,
        },
        {
          name: "Dailymotion",
          regex:
            /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/([a-zA-Z0-9]+)/,
          format: (id) => `https://www.dailymotion.com/embed/video/${id}`,
        },
        {
          name: "Vimeo",
          regex: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/([0-9]+)/,
          format: (id) => `https://player.vimeo.com/video/${id}`,
        },
        // Các nền tảng khác có thể được thêm tương tự
      ];

      // Thay thế thẻ oembed cho tất cả nền tảng trong danh sách
      articleContent = articleContent.replace(
        /<oembed\s+url="([^"]+)"\s*><\/oembed>/g,
        (match, url) => {
          for (let { regex, format } of embedFormats) {
            const match = url.match(regex);
            if (match && match[1]) {
              return `<iframe src="${format(match[1])}" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>`;
            }
          }
          return match; // Trả về nguyên bản nếu không khớp với nền tảng nào
        }
      );
      const baseUrl = process.env.REACT_APP_API_URL;
      articleContent = articleContent.replace(
        /<img\s+[^>]*src="(\uploads\/[^"]+)"[^>]*>/g,
        (match, path) => {
          return match.replace(path, `${baseUrl}/${path}`);
        }
      );

      // Định dạng trích dẫn
      articleContent = articleContent.replace(
        /<blockquote>(.*?)<\/blockquote>/g,
        (match, quoteContent) => {
          return `<div class="custom-quote">${quoteContent}</div>`;
        }
      );

      // Cập nhật thông tin bài viết
      setArticle({ ...response.data.article, content: articleContent });
      setView(response.data.view_count);
      setAuthor(response.data.article.user);
      setTags(response.data.article.tags.split(",").map((tag) => tag.trim()));
      setCategories(response.data.categories);

      // Gọi hàm lấy bình luận
      fetchComment(response.data.article.article_id);

      const tags = response.data.article.tags
        .split(",")
        .map((tag) => tag.trim());
      const categoryIds = response.data.categories.map(
        (category) => category.category_id
      );

      // Gọi hàm lấy bài viết liên quan
      fetchRelated(response.data.article.article_id, { categoryIds, tags });

      // Gọi hàm đếm số like
      fetchLike(response.data.article.article_id);

      // Nếu có token, kiểm tra xem người dùng đã like chưa
      if (localStorage.getItem("token")) {
        fetchLiked(response.data.article.article_id);
      }

      try {
        const responseUser = await TaiKhoanServices.userByUsername(
          response.data.article.user_id
        );
        setUser(responseUser.data.user);
        setFollowerCount(responseUser.data.followerCount);

        // Nếu có token, kiểm tra xem người dùng đã theo dõi chưa
        if (localStorage.getItem("token")) {
          fetchFollowed(responseUser.data.user.username);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API người dùng:", error);
      }
    } catch (error) {
      navigate("/404");
      console.error("Lỗi khi gọi API bài viết:", error);
    }
  };

  const fetchComment = async (id) => {
    try {
      const response = await BaiVietServices.listComment(id);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchRelated = async (id, data) => {
    try {
      const response = await BaiVietServices.getRelated(id, data);
      setRelated(response.data.articles);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decoded = decodeJWT(localStorage.getItem("token"));
      setIsAuthor(decoded.userId);
    }
    fetchArticle();
    window.scroll(0, 0);
  }, []);

  const fetchFollowed = async (username) => {
    try {
      const response = await TaiKhoanServices.checkFollowed(username);
      setIsFollower(response.data.isFollowing);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handelFollow = async (username) => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để theo dõi!");
    } else {
      try {
        const response = await TaiKhoanServices.follow(username);
        setIsFollower(!isFollower);
        isFollower == true
          ? setFollowerCount(followerCount - 1)
          : setFollowerCount(followerCount + 1);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    }
  };

  const fetchLike = async (id) => {
    try {
      const response = await BaiVietServices.getLike(id);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const fetchLiked = async (id) => {
    try {
      const response = await BaiVietServices.liked(id);
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handelLikeArticle = async (id) => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    const response = await BaiVietServices.like(id);
    fetchLike(id);
    setLiked(!liked);
  };
  const forbiddenWordsRegex =
    /bậy|chửi|tục|bậy bạ|đồ ngu|ngu|đần|điên|khùng|fuck|shit|ass|idiot|stupid|wtf|clown|đm|dm|vkl|vl|mẹ mày|con chó|thằng chó|lồn|cặc|má mày|địt|đụ/i;

  const handelPostComment = async (id) => {
    if (!localStorage.getItem("token")) {
      toast.error("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (forbiddenWordsRegex.test(postComment)) {
      toast.error("Bình luận chứa từ ngữ không phù hợp. Vui lòng nhập lại!");
      return;
    }

    try {
      const data = {
        content: postComment,
      };
      const response = await BaiVietServices.postComment(id, data);
      if (response.status === 201) {
        fetchComment(id);
        setPostComment("");
        const element = document.getElementById("list-comments-new");
        if (element) {
          element.scrollIntoView({ behavior: "instant", block: "start" });
        }
      } else {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      toast.error("Có lỗi xảy ra khi gửi bình luận!");
    }
  };

  const handelToArticleRelated = (slug) => {
    fetchArticle(slug);
    window.scroll(0, 0);
  };

  return (
    <>
      <main className="position-relative">
        <div className="container">
          <div className="entry-header entry-header-3 mb-50 mt-50 text-center text-white">
            <div
              className="thumb-overlay img-hover-slide border-radius-5 position-relative"
              style={{ backgroundImage: "url('/bg-articles.jpg')" }}
            >
              <div className="position-midded">
                <div className="entry-meta meta-0 font-small mb-30">
                  {categories.map((category, index) => (
                    <Link key={index} to={`/chuyen-muc/${category.slug}`}>
                      <span
                        className={`post-cat ${
                          colors[index % colors.length]
                        } color-white`}
                      >
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <h1 className="post-title mb-30 text-white">{article.title}</h1>
                <div className="entry-meta meta-1 font-x-small color-grey text-uppercase text-white">
                  <span className="post-by text-white">
                    Đăng bởi{" "}
                    <Link
                      className="text-white"
                      to={`/nguoi-dung/${author.username}`}
                    >
                      {author.fullname}{" "}
                    </Link>
                  </span>
                  <span className="post-on text-white">
                    {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="time-reading text-white">
                    {view} lượt xem
                  </span>
                  <p className="font-x-small mt-10 text-white">
                    <span className="hit-count">
                      <i className="ti-comment mr-5" />
                      {comments.length} bình luận
                    </span>
                    <span className="hit-count">
                      <i className="ti-heart mr-5" />
                      {likes} lượt thích
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/*end entry header*/}
          <div className="row mb-50">
            <div className="col-lg-2 d-none d-lg-block" />
            <div className="col-lg-8 col-md-12">
              <div className="single-social-share single-sidebar-share mt-30">
                <ul>
                  <li>
                    <a
                      className="social-icon facebook-icon text-xs-center"
                      target="_blank"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        currentUrl
                      )}`}
                    >
                      <i className="ti-facebook" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="social-icon twitter-icon text-xs-center"
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        currentUrl
                      )}`}
                      target="_blank"
                    >
                      <i className="ti-twitter-alt" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="social-icon pinterest-icon text-xs-center"
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        currentUrl
                      )}`}
                      target="_blank"
                    >
                      <i className="ti-pinterest" />
                    </a>
                  </li>
                  <li>
                    <a
                      className="social-icon linkedin-icon text-xs-center"
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                        currentUrl
                      )}`}
                      target="_blank"
                    >
                      <i className="ti-linkedin" />
                    </a>
                  </li>
                  <li>
                    <a className="social-icon email-icon text-xs-center" to="#">
                      <i className="ti-email" />
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className="entry-main-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              <div className="entry-bottom mt-50 mb-30">
                <div className="font-weight-500 entry-meta meta-1 font-x-small color-grey">
                  <span className="update-on">
                    <i className="ti ti-reload mr-5" />
                    Cập nhật{" "}
                    {new Date(article.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="hit-count">
                    <i className="ti-comment" />
                    {comments.length} bình luận
                  </span>
                  <span className="hit-count">
                    <i className="ti-heart" />
                    {likes} lượt thích
                  </span>
                </div>
                <div className="overflow-hidden mt-30">
                  <div className="tags float-left text-muted mb-md-30">
                    <span className="font-small mr-10">
                      <i className="fa fa-tag mr-5" />
                      Từ Khóa:{" "}
                    </span>
                    {tags.map((tag, index) => (
                      <Link rel="tag" key={index} to="#">
                        {tag}
                      </Link>
                    ))}
                  </div>
                  <div className="single-social-share float-right">
                    <ul className="d-inline-block list-inline">
                      <li className="list-inline-item">
                        <span className="font-small text-muted">
                          <i className="ti-sharethis mr-5" />
                          Chia sẻ:{" "}
                        </span>
                      </li>
                      <li className="list-inline-item">
                        <a
                          className="social-icon facebook-icon text-xs-center"
                          target="_blank"
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            currentUrl
                          )}`}
                        >
                          <i className="ti-facebook" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          className="social-icon twitter-icon text-xs-center"
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            currentUrl
                          )}`}
                          target="_blank"
                        >
                          <i className="ti-twitter-alt" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          className="social-icon pinterest-icon text-xs-center"
                          href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                            currentUrl
                          )}`}
                          target="_blank"
                        >
                          <i className="ti-pinterest" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          className="social-icon linkedin-icon text-xs-center"
                          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            currentUrl
                          )}`}
                          target="_blank"
                        >
                          <i className="ti-linkedin" />
                        </a>
                      </li>
                      <li className="list-inline-item">
                        <a
                          className="social-icon email-icon text-xs-center"
                          to="#"
                        >
                          <i className="ti-email" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/*author box*/}
              <div
                className="author-bio border-radius-10 p-30 mb-40"
                style={{
                  color: theme === "dark" ? "#eee" : "#000",
                }}
              >
                <div className="author-image mb-30">
                  <a
                    href={
                      article.user_id === isAuthor
                        ? "/tai-khoan"
                        : `/nguoi-dung/${user.username}`
                    }
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${user.avatar_url}`}
                      alt={`${user.fullname}'s avatar`}
                      className="avatar"
                      style={{
                        border: theme === "dark" ? "2px solid #eee" : "none",
                      }}
                    />
                  </a>
                </div>
                <div className="author-info">
                  <h3>
                    <span className="vcard author">
                      <span className="fn">
                        {article.user_id === isAuthor ? (
                          <Link
                            to={`/tai-khoan`}
                            title="Posts by Robert"
                            rel="author"
                            style={{
                              color: theme === "dark" ? "#eee" : "#000",
                            }}
                          >
                            {user.fullname}
                          </Link>
                        ) : (
                          <Link
                            to={`/nguoi-dung/${user.username}`}
                            title="Posts by Robert"
                            rel="author"
                            style={{
                              color: theme === "dark" ? "#eee" : "#000",
                            }}
                          >
                            {user.fullname}
                          </Link>
                        )}
                      </span>
                    </span>
                  </h3>
                  <h5
                    className="text-muted"
                    style={{ color: theme === "dark" ? "#ccc" : "#777" }}
                  >
                    <span className="mr-15">{user.username}</span>
                    <i
                      className="ti-star"
                      style={{
                        color: theme === "dark" ? "#f1c40f" : "#f8c200",
                      }}
                    />
                    <i
                      className="ti-star"
                      style={{
                        color: theme === "dark" ? "#f1c40f" : "#f8c200",
                      }}
                    />
                    <i
                      className="ti-star"
                      style={{
                        color: theme === "dark" ? "#f1c40f" : "#f8c200",
                      }}
                    />
                    <i
                      className="ti-star"
                      style={{
                        color: theme === "dark" ? "#f1c40f" : "#f8c200",
                      }}
                    />
                    <i
                      className="ti-star"
                      style={{
                        color: theme === "dark" ? "#f1c40f" : "#f8c200",
                      }}
                    />
                  </h5>
                  <div
                    className="author-description"
                    style={{ color: theme === "dark" ? "#ddd" : "#555" }}
                  >
                    {user.bio}
                  </div>
                  {article.user_id === isAuthor ? (
                    <>
                      <Link
                        to={`/tai-khoan`}
                        className="author-bio-link text-muted"
                        style={{
                          textTransform: "unset",
                          color: theme === "dark" ? "#ccc" : "#666",
                        }}
                      >
                        <FontAwesomeIcon icon={faUser} /> Trang Cá Nhân
                      </Link>
                      <Link
                        to={`/chinh-sua/${article.article_id}`}
                        className="author-bio-link text-muted"
                        style={{
                          textTransform: "unset",
                          color: theme === "dark" ? "#ccc" : "#666",
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} /> Chỉnh Sửa Bài
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="#"
                        onClick={() => handelLikeArticle(article.article_id)}
                        className={`author-bio-link ${
                          liked ? "" : "text-muted"
                        }`}
                        style={{
                          textTransform: "unset",
                          color: liked
                            ? "#f2546a"
                            : theme === "dark"
                            ? "#ccc"
                            : "#555",
                        }}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {liked ? " Bỏ Like" : " Like Bài"}
                      </Link>
                      <Link
                        onClick={() => handelFollow(user.username)}
                        to="#"
                        className="author-bio-link text-muted"
                        style={{
                          textTransform: "unset",
                          color: theme === "dark" ? "#ccc" : "#666",
                        }}
                      >
                        {isFollower === true ? (
                          <>
                            <FontAwesomeIcon icon={faUserMinus} /> Hủy Theo Dõi
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faUserPlus} /> Theo Dõi
                          </>
                        )}
                      </Link>
                      <Link
                        to="#"
                        className="author-bio-link text-muted"
                        style={{
                          textTransform: "unset",
                          color: theme === "dark" ? "#ccc" : "#666",
                        }}
                      >
                        <FontAwesomeIcon icon={faRss} /> {followerCount} Người
                        Theo Dõi
                      </Link>
                    </>
                  )}

                  <div className="author-social">
                    <ul className="author-social-icons">
                      <li className="author-social-link-facebook">
                        <Link to="#">
                          <i
                            className="ti-facebook"
                            style={{
                              color: theme === "dark" ? "#fff" : "#3b5998",
                            }}
                          />
                        </Link>
                      </li>
                      <li className="author-social-link-twitter">
                        <Link to="#">
                          <i
                            className="ti-twitter-alt"
                            style={{
                              color: theme === "dark" ? "#fff" : "#00acee",
                            }}
                          />
                        </Link>
                      </li>
                      <li className="author-social-link-pinterest">
                        <Link to="#">
                          <i
                            className="ti-pinterest"
                            style={{
                              color: theme === "dark" ? "#fff" : "#e60023",
                            }}
                          />
                        </Link>
                      </li>
                      <li className="author-social-link-instagram">
                        <Link to="#">
                          <i
                            className="ti-instagram"
                            style={{
                              color: theme === "dark" ? "#fff" : "#e1306c",
                            }}
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/*related posts*/}
              <div
                className="related-posts"
                style={{
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                  color: theme === "dark" ? "#eee" : "#000",
                }}
              >
                <h3
                  className="mb-30"
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                >
                  Bài Viết Liên Quan
                </h3>
                <div className="row">
                  {related.map((article, index) => (
                    <article key={index} className="col-lg-4">
                      <div
                        className=" border-radius-10 p-10 mb-30"
                        style={{
                          color: theme === "dark" ? "#eee" : "#000",
                        }}
                      >
                        <div className="post-thumb d-flex mb-15 border-radius-15 img-hover-scale">
                          <Link
                            to={`/bai-viet/${article.slug}`}
                            onClick={() => handelToArticleRelated(article.slug)}
                          >
                            <img
                              className="border-radius-15"
                              style={{
                                height: "183px",
                                width: "261px",
                                borderRadius: "15px",
                                boxShadow:
                                  theme === "dark"
                                    ? "0 2px 10px rgba(255, 255, 255, 0.1)"
                                    : "none",
                              }}
                              src={`${process.env.REACT_APP_API_URL}/${article.image_url}`}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="pl-10 pr-10">
                          <div className="entry-meta mb-15 mt-10">
                            <Link
                              className="entry-meta meta-2"
                              to={`/chuyen-muc/${article.category_slug}`}
                            >
                              <span
                                className={`post-in text-${
                                  colors[index % colors.length].split("-")[1]
                                } font-x-small`}
                                style={{
                                  color: theme === "dark" ? "#ddd" : "",
                                }}
                              >
                                {article.category_name}
                              </span>
                            </Link>
                          </div>
                          <h5 className="post-title mb-15">
                            <Link
                              to={`/bai-viet/${article.slug}`}
                              onClick={() =>
                                handelToArticleRelated(article.slug)
                              }
                              style={{
                                color: theme === "dark" ? "#eee" : "#000",
                              }}
                            >
                              {article.title}
                            </Link>
                          </h5>
                          <div className="entry-meta meta-1 font-x-small color-grey float-left text-uppercase mb-10">
                            <span className="post-by">
                              bởi{" "}
                              <Link
                                to={`/nguoi-dung/${article.username}`}
                                style={{
                                  color: theme === "dark" ? "#ccc" : "",
                                }}
                              >
                                {article.fullname}
                              </Link>
                            </span>
                            <span
                              className="post-on"
                              style={{
                                color: theme === "dark" ? "#bbb" : "",
                              }}
                            >
                              {new Date(article.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div
                className="comments-area"
                style={{
                  color: theme === "dark" ? "#eee" : "#000",
                  backgroundColor: theme === "dark" ? "#333" : "#fff",
                }}
              >
                <h3
                  className="mb-30"
                  id="list-comments-new"
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                >
                  Bình Luận ({comments.length})
                </h3>
                {comments.length === 0 ? (
                  <p
                    style={{
                      color: theme === "dark" ? "#ccc" : "#555",
                    }}
                  >
                    Chưa có bình luận nào cho bài viết này!
                  </p>
                ) : null}
                {comments.map((comment, index) => (
                  <div key={index} className="comment-list">
                    <div className="single-comment justify-content-between d-flex">
                      <div className="user justify-content-between d-flex">
                        <div className="thumb">
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${comment.user.avatar_url}`}
                            alt=""
                            style={{
                              border:
                                theme === "dark" ? "2px solid #eee" : "none",
                            }}
                          />
                        </div>
                        <div className="desc">
                          <p
                            className="comment"
                            style={{
                              color: theme === "dark" ? "#ddd" : "#333",
                            }}
                          >
                            {comment.content}
                          </p>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center">
                              <h5
                                style={{
                                  color: theme === "dark" ? "#fff" : "#000",
                                }}
                              >
                                {comment.user_id === isAuthor ? (
                                  <Link
                                    to={`/tai-khoan`}
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#000",
                                    }}
                                  >
                                    {comment.user.fullname}
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/nguoi-dung/${comment.user.username}`}
                                    style={{
                                      color: theme === "dark" ? "#fff" : "#000",
                                    }}
                                  >
                                    {comment.user.fullname}
                                  </Link>
                                )}
                              </h5>
                              <p
                                className="date"
                                style={{
                                  color: theme === "dark" ? "#aaa" : "#777",
                                }}
                              >
                                {new Date(comment.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                            {comment.user_id === isAuthor && (
                              <i
                                className="fas fa-trash-alt text-danger pl-20"
                                style={{
                                  cursor: "pointer",
                                  color:
                                    theme === "dark" ? "#f2546a" : "#dc3545",
                                }}
                                onClick={() => handleDelete(comment.comment_id)}
                                title="Xóa Bình Luận"
                              ></i>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="comment-form"
                style={{
                  marginTop: "0px",
                  color: theme === "dark" ? "#eee" : "#000",
                }}
              >
                <h3
                  className="mb-30"
                  style={{
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                >
                  Viết Bình Luận
                </h3>
                <div className="form-contact comment_form" id="commentForm">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <textarea
                          className="form-control w-100"
                          name="comment"
                          id="comment"
                          cols={30}
                          rows={4}
                          placeholder="Nhập nội dung bình luận"
                          value={postComment}
                          onChange={(e) => setPostComment(e.target.value)}
                          style={{
                            backgroundColor: theme === "dark" ? "#555" : "#fff",
                            color: theme === "dark" ? "#eee" : "#000",
                            borderColor: theme === "dark" ? "#777" : "#ccc",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <button
                      type="submit"
                      onClick={() => handelPostComment(article.article_id)}
                      className="button button-contactForm"
                      style={{
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Bình Luận
                    </button>
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

export default BaiViet;
