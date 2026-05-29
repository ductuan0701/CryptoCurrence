import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DangNhapServices from "../../services/User/DangNhapServices";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const DangNhap = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const captchaLength = Math.floor(Math.random() * 3) + 4;
    let captcha = "";
    for (let i = 0; i < captchaLength; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaText(captcha);
    return captcha;
  };

  const drawCaptcha = () => {
    const captchaText = generateCaptcha();
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const padding = 10;
    const totalWidth =
      captchaText.length * 30 + padding * (captchaText.length - 1);
    const startX = (canvasRef.current.width - totalWidth) / 2;
    for (let i = 0; i < captchaText.length; i++) {
      const x = startX + i * (30 + padding);
      const y = canvasRef.current.height / 2;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * 0.5 - 0.25);
      ctx.fillText(captchaText.charAt(i), 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (captchaAnswer !== captchaText) {
      toast.error("Câu trả lời CAPTCHA không chính xác!");
      drawCaptcha();
      return;
    }
    const login = await DangNhapServices.login({ username, password });
    if (login.response && login.response.status === 400) {
      toast.error(login.response.data.message);
      drawCaptcha();
      setCaptchaAnswer("");
    } else {
      toast.success(login.data.message);
      localStorage.setItem("token", login.data.token);
      localStorage.setItem("refreshToken", login.data.refreshToken);
      navigate("/tai-khoan");
    }
  };

  return (
    <>
      <main className="position-relative">
        <div className="archive-header text-center mb-30">
          <div className="container">
            <h2>
              <span
                style={{
                  color: theme === "dark" ? "#fff" : "#333",
                }}
              >
                Đăng Nhập
              </span>
            </h2>
            <div className="breadcrumb">
              Truy cập hệ thống để sử dụng chức năng
            </div>
          </div>
        </div>
        <div className="container pb-50">
          <form
            className="form-contact comment_form mx-auto px-3"
            action="#"
            id="commentForm"
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px" }}
          >
            <div className="form-group">
              <input
                className="form-control border-radius-15"
                name="name"
                id="name"
                type="text"
                placeholder="Nhập tài khoản"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-15">
              <input
                className="form-control border-radius-15"
                name="email"
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mt-15">
              <div
                className="d-flex align-items-center flex-wrap"
                style={{ gap: "10px" }}
              >
                <canvas
                  ref={canvasRef}
                  width="250"
                  height="50"
                  style={{
                    border: "1px solid #ccc",
                    background: "white",
                    borderRadius: "15px",
                    flexShrink: 0,
                    marginLeft: "10px",
                    maxWidth: "100%",
                  }}
                />
                <input
                  className="form-control border-radius-15"
                  type="text"
                  placeholder="Nhập câu trả lời CAPTCHA"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  style={{
                    maxWidth: "100%",
                    flex: 1,
                    minWidth: "150px",
                  }}
                />
              </div>
            </div>

            <div className="form-group mt-15 w-100">
              <button type="submit" className="button button-contactForm w-100">
                ĐĂNG NHẬP
              </button>
            </div>
            <div className="form-group mt-25 w-100 d-flex justify-content-between flex-wrap">
              <div
                className="text-left"
                style={{ color: theme === "dark" ? "#fff" : "#333" }}
              >
                Chưa có tài khoản?{" "}
                <Link
                  to="/dang-ky"
                  style={{ color: theme === "dark" ? "#fff" : "#333" }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = theme === "dark" ? "red" : "red")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = theme === "dark" ? "#fff" : "#333")
                  }
                >
                  Đăng Ký
                </Link>
              </div>
              <div
                className="text-right mt-3 mt-md-0"
                style={{ color: theme === "dark" ? "#fff" : "#333" }}
              >
                <Link
                  to="/quen-mat-khau"
                  style={{ color: theme === "dark" ? "#fff" : "#333" }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = theme === "dark" ? "red" : "red")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = theme === "dark" ? "#fff" : "#333")
                  }
                >
                  Quên Mật Khẩu?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default DangNhap;
