import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CryptoJS from "crypto-js";

const Page404 = () => {
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

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
            setIsAuthor(!!decoded.userId); 
        }
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <main className="position-relative">
                <div className="container">
                    <div className="row mb-30">
                        <div className="col-12">
                            <div className="content-404 text-center mb-30">
                                <h1 className="mb-30">404</h1>
                                <p>Trang bạn đang truy cập hiện không tồn tại.</p>
                                <p className="text-warning">
                                    Xin lỗi, bài viết này chưa được admin duyệt hoặc đã bị gỡ bỏ. Vui lòng quay lại sau!
                                </p>
                                <h6 className="mt-30 mb-15">
                                    {isAuthor ? (
                                        <Link to="/tai-khoan">Quay Về Trang Tài Khoản</Link>
                                    ) : (
                                        <Link to="/">Quay Về Trang Chủ</Link>
                                    )}
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Page404;
