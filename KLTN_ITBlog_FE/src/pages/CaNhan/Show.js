import React, { useState, useEffect } from 'react';
import ContentHeader from '../../components/ContentHeader';
import { Link, useNavigate } from 'react-router-dom';
import NguoiDungServices from '../../services/NguoiDungServices';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const Show = () => {
  const [fullname, setFulname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const breadcrumbs = [
    { label: 'Trang Chủ', url: '/admin' },
    { label: 'Cá Nhân', url: '/admin/ca-nhan' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const show = await NguoiDungServices.profile();
      if (show.status === 200) {
        setFulname(show.data.user.fullname);
        setUsername(show.data.user.username);
        setEmail(show.data.user.email);
        setBio(show.data.user.bio);
        setAvatar(`${process.env.REACT_APP_API_URL}/${show.data.user.avatar_url}`);
      } else {
        navigate('/admin');
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('bio', bio);
    if (password) {
      formData.append('password', password);
    }
    if (avatarFile) {
      formData.append('avatar_url', avatarFile);
    }
    setPassword('');
    try {
      const response = await NguoiDungServices.update(formData);
      if (response.status === 200) {
        toast.success('Cập nhật thông tin thành công');
      } else {
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className='content-wrapper' style={{ minHeight: '1203.31px' }}>
      <ContentHeader title='Thông Tin' breadcrumbs={breadcrumbs} />
      <section className='content'>
        <div className='container-fluid'>
          <div className='card card-default'>
            <div className='card-body'>
              <form encType='multipart/form-data' onSubmit={handleSubmit}>
                <div className='row'>
                  <div className='col-md-12 text-center'>
                    <img
                      src={`${avatar}`}
                      alt='Avatar'
                      className='img-fluid rounded-circle mb-4'
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div className='col-md-12 text-center'>
                    <label
                      htmlFor='avatar'
                      style={{ fontWeight: '500', cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faCamera} /> Chọn ảnh
                    </label>
                    <input
                      type='file'
                      className='form-control-file'
                      accept='image/*'
                      onChange={handleFileChange}
                      hidden
                      id='avatar'
                    />
                  </div>

                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='name'>Họ Tên</label>
                      <input
                        type='text'
                        className='form-control bg-white'
                        id='fullname'
                        name='fullname'
                        value={fullname ?? ''}
                        required
                        onChange={(e) => setFulname(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='name'>Tài Khoản</label>
                      <input
                        type='text'
                        className='form-control bg-white'
                        id='username'
                        name='username'
                        value={username ?? ''}
                        required
                        disabled
                        style={{ cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='name'>Email</label>
                      <input
                        type='text'
                        className='form-control bg-white'
                        id='email'
                        name='email'
                        value={email ?? ''}
                        required
                        disabled
                        style={{ cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>
                  <div className='col-md-12'>
                    <div className='form-group'>
                      <label htmlFor='name'>Bio</label>
                      <textarea
                        type='text'
                        className='form-control bg-white'
                        id='bio'
                        name='bio'
                        value={bio ?? ''}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='d-flex flex-column flex-md-row'>
                  <Link
                    className='btn btn-success mb-2 mb-md-0 mr-md-3 flex-fill flex-md-initial'
                    to='/admin/'
                  >
                    Quay Lại
                  </Link>
                  <Link
                    className='btn btn-dark mb-2 mb-md-0 mr-md-3 flex-fill flex-md-initial'
                    to='/admin/ca-nhan/doi-mat-khau'
                  >
                    Đổi Mật Khẩu
                  </Link>
                  <button
                    className='btn btn-primary mb-2 mb-md-0 flex-fill flex-md-initial'
                    type='submit'
                  >
                    Lưu Thông Tin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Show;
