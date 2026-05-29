import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DangNhapServices from "../../services/DangNhapServices";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faSignInAlt } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/");
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const login = await DangNhapServices.login({ username, password });
    if (login.response && login.response.status === 400) {
      toast.error(login.response.data.message);
    } else {
      toast.success(login.data.message);
      localStorage.setItem("token", login.data.token);
      localStorage.setItem("refreshToken", login.data.refreshToken);
      navigate("/admin/");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm p-4" style={{ width: "500px" }}>
        <div className="card-body text-center">
          <img
            src="https://i.imgur.com/dIENKyH.png"
            alt="Logo"
            style={{ width: "100px", height: "100px" }}
            className="mb-3"
          />
          <h3 className="text-center mb-4">
            <b>Đăng Nhập vào IT Blog</b>
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tài khoản"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Nhớ mật khẩu?
                  </label>
                </div>
              </div>
              <div className="col-6">
                <button type="submit" className="btn btn-primary w-100">
                  <FontAwesomeIcon icon={faSignInAlt} /> Đăng Nhập
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
