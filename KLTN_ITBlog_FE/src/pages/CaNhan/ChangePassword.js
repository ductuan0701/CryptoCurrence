import React, { useState, useEffect } from 'react';
import ContentHeader from '../../components/ContentHeader';
import { Link, useNavigate } from 'react-router-dom';
import NguoiDungServices from '../../services/NguoiDungServices'; // Import service để gọi API
import { toast } from 'react-toastify';
const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate(); // Điều hướng sau khi thêm thành công

    const breadcrumbs = [
        { label: 'Trang Chủ', url: '/admin' },
        { label: 'Cá Nhân', url: '/admin/ca-nhan' },
        { label: 'Đổi Mật Khẩu', url: '' },
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            password: currentPassword,
            newPassword,
            confirmPassword
        }
        
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        try {
            const response = await NguoiDungServices.changePassword(data); // Gọi API với dữ liệu formData
            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công');
            } else {
                toast.error(response.response.data.message);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div className="content-wrapper" style={{ minHeight: '1203.31px' }}>
            <ContentHeader title='Đổi Mật Khẩu' breadcrumbs={breadcrumbs} />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-default">
                        <div className="card-body">
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="currentPassword">Mật Khẩu Hiện Tại</label>
                                            <input
                                                type="password"
                                                className="form-control bg-white"
                                                id="currentPassword"
                                                name="currentPassword"
                                                value={currentPassword ?? ''}
                                                required
                                                placeholder='Mật khẩu hiện tại'
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="newPassword">Mật Khẩu Mới</label>
                                            <input
                                                type="password"
                                                className="form-control bg-white"
                                                id="newPassword"
                                                name="newPassword"
                                                value={newPassword ?? ''}
                                                required
                                                placeholder='Mật khẩu mới'
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
                                            <input
                                                type="password"
                                                className="form-control bg-white "
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={confirmPassword ?? ''}
                                                required
                                                placeholder='Xác nhận mật khẩu'
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Link className="btn btn-success mr-2" to="/admin/ca-nhan">Quay Lại</Link>
                                <button className="btn btn-primary" type="submit">Đổi Mật Khẩu</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChangePassword;
