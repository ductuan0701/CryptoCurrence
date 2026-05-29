import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Select from 'react-select';
import BaiVietServices from '../../services/BaiVietServices'; // Import service để gọi API
import ChungServices from '../../services/ChungServices'; // Import service để gọi API

const ChinhSua = () => {
    const [titleChange, setTitleChange] = useState('');
    const [titleOld, setTitleOld] = useState('');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isDraft, setIsDraft] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const { id } = useParams();

  // Xử lý xóa bài viết
  const handleDelete = async (id) => {
    try {
      const destroy = await BaiVietServices.delete(id);
      setData(data.filter((item) => item.article_id !== id));
      toast.success(destroy.data.message);
      navigate("/tai-khoan");

    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };
    const getCategories = async () => {
        const response = await ChungServices.list_categories();
        const categoriesOptions = response.data.categories.map((category) => ({
          value: category.category_id,
          label: category.name,
        }));
        setCategories(categoriesOptions);
    };

    const createSlug = (title) => {
        // Bản đồ chuyển đổi các ký tự có dấu thành không dấu
        const vietnameseToAscii = (str) => {
          const map = {
            'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd',
            // Thêm các ký tự khác nếu cần
          };
          return str.replace(/./g, char => map[char] || char);
        };
    
        return vietnameseToAscii(title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')  // Thay thế ký tự không phải chữ cái hoặc số bằng dấu gạch ngang
          .replace(/(^-|-$)/g, '');     // Xóa dấu gạch ngang đầu hoặc cuối
    };

    const fetchData = async () => {
        const detail = await BaiVietServices.detail(id);
        if(detail.status === 200){
            setTitleChange(detail.data.article.title)
            setTitleOld(detail.data.article.title)
            setTitle(detail.data.article.title)
            setSlug(detail.data.article.slug)
            setTags(detail.data.article.tags)
            setContent(detail.data.article.content)
            setIsDraft(detail.data.article.is_draft)
  
            const selectedCategoriesDefault = detail.data.categories.map(category => ({
                value: category.category_id,
                label: category.name
            }));
            setSelectedCategories(selectedCategoriesDefault);
        }else{
            navigate('/tai-khoan'); 
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/dang-nhap');
        }
    }, []);

    useEffect(() => {
        fetchData();
        getCategories();
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e, is_draft = 0) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('tags', tags);
        formData.append('is_draft', is_draft);
        formData.append('image_url', image);
        formData.append('content', content); // Thêm phần content vào FormData
        formData.append("categories", JSON.stringify(selectedCategories));
        
        const addArticle = await BaiVietServices.update(id, formData);
    
        if (addArticle.status === 200) {
          if(is_draft === 1){
            setIsDraft(true);
            toast.success("Đã lưu bản nháp bài viết");
          }else{
            setIsDraft(false);
            toast.success(addArticle.data.message);
          }
          navigate("/tai-khoan");
        } else {
          toast.error(addArticle.response.data.message);
        }
    };

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions);
    };

    const handelTitleChange = (e) => {
        setTitle(e.target.value);
        setSlug(createSlug(title));
        if(!e.target.value){
            setTitleChange(titleOld);
            setSlug('');
        }else{
            setTitleChange(e.target.value);
        }
    }

    return (
        <>
            <main className="position-relative">
                <div className="archive-header text-center mb-50">
                    <div className="container">
                        <h2>
                            <span className="text-success">
                                {
                                    slug === '[rejected]' 
                                    ? 
                                        titleChange.split(']')[0] + "]"
                                    : 
                                        titleChange
                                }
                            </span>
                        </h2>
                        <div className="breadcrumb">
                            <span className="no-arrow">Bạn đang xem:</span>
                            <Link to="/" rel="nofollow">
                                Trang Chủ
                            </Link>
                            <span />
                            <Link to="/tai-khoan" rel="nofollow">
                                Tài Khoản
                            </Link>
                            <span />
                            {
                                slug === '[rejected]' 
                                ? 
                                    "Xem Bài Viết"
                                : 
                                    "Chỉnh Sửa"
                            }
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-9 order-1 order-md-2">
                            <div className="row mb-50">
                                <div className="col-lg-8 col-md-12">
                                    <div className="sidebar-widget mb-50">
                                        <div className="form-group">
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={content || ''}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setContent(data);
                                                }}
                                                config={{
                                                    toolbar: [
                                                        'heading', '|',
                                                        'bold', 'italic', '|',
                                                        'link', 'imageUpload', 'blockQuote', '|',
                                                        'bulletedList', 'numberedList', '|',
                                                        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
                                                        'mediaEmbed', '|',
                                                        'outdent', 'indent', '|',
                                                        'undo', 'redo', '|'
                                                    ],
                                                    image: {
                                                        toolbar: [
                                                            'imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side', 'linkImage'
                                                        ]
                                                    },
                                                    table: {
                                                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                                                    },
                                                    ckfinder: {
                                                        uploadUrl: `${process.env.REACT_APP_API_URL}/articles/uploadImage`
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 sidebar-right">
                                    <div className="sidebar-widget mb-50">
                                        <div className="widget-header mb-20 bg-white border-radius-10 p-15">
                                            <h5 className="widget-title mb-0">
                                                Thông Tin <span>Bài Viết</span>
                                            </h5>
                                        </div>
                                        <div className="widget-header mb-30 bg-white border-radius-10 p-15">
                                            <div className="row mb-2">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="title">Tiêu Đề Bài Viết</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="title"
                                                            name="title"
                                                            placeholder="Tiêu đề bài viết"
                                                            value={
                                                                slug === '[rejected]' 
                                                                ? 
                                                                    title.split(']')[1]
                                                                : 
                                                                    title
                                                            }
                                                            onChange={(e) => handelTitleChange(e)}
                                                            required
                                                            disabled={ slug === '[rejected]' ? true : false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="slug">Đường Dẫn</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="slug"
                                                            name="slug"
                                                            placeholder="Đường dẫn"
                                                            value={slug}
                                                            onChange={(e) => setSlug(e.target.value)}
                                                            required
                                                            disabled={ slug === '[rejected]' ? true : false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="categories">Danh Mục</label>
                                                        <Select
                                                            isMulti
                                                            name="categories"
                                                            options={categories} 
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                            value={selectedCategories}
                                                            onChange={handleCategoryChange}
                                                            placeholder="Chọn danh mục"
                                                            styles={{
                                                                control: (provided) => ({
                                                                    ...provided,
                                                                    width: '100%',
                                                                    border: '1px solid #eee', 
                                                                    borderRadius: '5px',
                                                                    minHeight: '48px',
                                                                    paddingLeft: '7px',
                                                                    backgroundColor: 'white',
                                                                    fontSize: '13px'
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="tags">Từ Khóa</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="tags"
                                                            name="tags"
                                                            placeholder="Từ khóa cách bởi dấu ,"
                                                            value={tags}
                                                            onChange={(e) => setTags(e.target.value)}
                                                            required
                                                            disabled={ slug === '[rejected]' ? true : false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="categories">Chọn Ảnh</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            id="image"
                                                            name="image"
                                                            onChange={(e) => setImage(e.target.files[0])}
                                                            required
                                                            disabled={ slug === '[rejected]' ? true : false}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                    <label htmlFor="tags">Phiên Bản</label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-white"
                                                        id="draft"
                                                        name="draft"
                                                        value={
                                                            slug === '[rejected]' ? "Bị Từ Chối" : isDraft ? "Bản Nháp" : "Chính Thức"
                                                        }
                                                        required
                                                        disabled
                                                        style={{ cursor: 'not-allowed' }}
                                                    />
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                slug === '[rejected]'
                                                ?
                                                <>
                                                        <button className="btn-profile-update btn btn-danger float-center mt-5"  style={{ zIndex: 0 }} onClick={() => handleDelete(id)}>Xóa Bài Viết</button>

                                                </>
                                                :
                                                    <>
                                                        <button className="btn-profile-update btn btn-primary" style={{ zIndex: 0 }} onClick={(e) => handleSubmit(e, 1)}>Lưu Bản Nháp</button>
                                                        <button className="btn-profile-update btn btn-primary float-right" style={{ zIndex: 0 }} onClick={(e) => handleSubmit(e)}>Đăng Bài Viết</button>
                                                        <button className="btn-profile-update btn btn-danger float-center mt-5"  style={{ zIndex: 0 }} onClick={() => handleDelete(id)}>Xóa Bài Viết</button>
                                                    </>
                                            }
                                            
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ChinhSua;