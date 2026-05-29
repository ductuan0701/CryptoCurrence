import { useEffect, useState, useRef } from "react";
import DangKyServices from "../../services/User/DangKyServices";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

const DangKy = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const canvasRef = useRef(null);
  const [errorMessages, setErrorMessages] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { theme } = useTheme();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/tai-khoan");
    }
  }, [navigate]);

  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const fullnameRegex = /^[A-ZÀ-Ý][a-zà-ỹ]+(\s[A-ZÀ-Ý][a-zà-ỹ]+)*$/;

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (captchaAnswer !== captchaText) {
      toast.error("Câu trả lời CAPTCHA không chính xác!");
      drawCaptcha();
      return;
    }
    setErrorMessages({
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    if (!fullname || !username || !email || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    let hasError = false;
    if (!fullnameRegex.test(fullname)) {
      setErrorMessages((prev) => ({
        ...prev,
        fullname:
          "Họ tên không hợp lệ. Họ tên phải bắt đầu bằng chữ hoa và không chứa số.",
      }));
      hasError = true;
    }

    if (!usernameRegex.test(username)) {
      setErrorMessages((prev) => ({
        ...prev,
        username:
          "Tài khoản không hợp lệ. Tài khoản phải bắt đầu bằng chữ cái và có từ 3 đến 15 ký tự.",
      }));
      hasError = true;
    }

    if (!emailRegex.test(email)) {
      setErrorMessages((prev) => ({
        ...prev,
        email:
          "Email không hợp lệ. Vui lòng đảm bảo email chứa '@' và đúng định dạng.",
      }));
      hasError = true;
    }

    if (password !== confirmPassword) {
      setErrorMessages((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu và xác nhận mật khẩu không khớp.",
      }));
      hasError = true;
    }

    if (!validatePassword(password)) {
      setErrorMessages((prev) => ({
        ...prev,
        password:
          "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt.",
      }));
      hasError = true;
    }

    if (hasError) return;
    const register = await DangKyServices.register({
      fullname,
      username,
      email,
      password,
      confirmPassword,
    });
    if (register.response && register.response.status === 400) {
      toast.error(register.response.data.message);
    } else {
      toast.success(register.data.message);
      navigate("/dang-nhap");
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
                Đăng Ký
              </span>
            </h2>
            <div className="breadcrumb">Tạo tài khoản để truy cập hệ thống</div>
          </div>
        </div>
        <div className="container-fluid pb-50">
          <form
            className="form-contact comment_form mx-auto px-3"
            action="#"
            id="commentForm"
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px" }}
          >
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    className="form-control border-radius-15"
                    name="fullname"
                    id="fullname"
                    type="text"
                    placeholder="Họ tên"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                  {errorMessages.fullname && (
                    <small className="text-danger">
                      {errorMessages.fullname}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    className="form-control border-radius-15"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errorMessages.email && (
                    <small className="text-danger">{errorMessages.email}</small>
                  )}
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    className="form-control border-radius-15"
                    name="username"
                    id="username"
                    type="text"
                    placeholder="Nhập tài khoản"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {errorMessages.username && (
                    <small className="text-danger">
                      {errorMessages.username}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    className="form-control border-radius-15"
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errorMessages.password && (
                    <small className="text-danger">
                      {errorMessages.password}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    className="form-control border-radius-15"
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errorMessages.confirmPassword && (
                    <small className="text-danger">
                      {errorMessages.confirmPassword}
                    </small>
                  )}
                </div>
              </div>
              <div className="col-sm-12 mt-3">
                <div className="form-group d-flex flex-column flex-sm-row align-items-center">
                  <canvas
                    ref={canvasRef}
                    width="250"
                    height="50"
                    style={{
                      border: "1px solid #ccc",
                      background: "white",
                      borderRadius: 15,
                      marginLeft: "10px",
                      maxWidth: "100%", 
                      width: "100%", 
                    }}
                  />
                  <input
                    className="form-control mt-2 mt-sm-0 ml-sm-3 w-100"
                    type="text"
                    placeholder="Nhập câu trả lời CAPTCHA"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    style={{
                      maxWidth: "500px",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="form-group mt-3 w-100">
              <button type="submit" className="button button-contactForm w-100">
                ĐĂNG KÝ
              </button>
            </div>
            <div className="form-group mt-4 w-100">
              <div
                className="text-center"
                style={{ color: theme === "dark" ? "#fff" : "#333" }}
              >
                Đã có tài khoản?{" "}
                <Link
                  to="/dang-nhap"
                  style={{
                    color: theme === "dark" ? "#fff" : "#333",
                  }}
                >
                  Đăng Nhập
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};
export default DangKy;
