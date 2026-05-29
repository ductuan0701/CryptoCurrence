import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import BaiVietServices from "../../services/BaiVietServices";
import ChungServices from "../../services/ChungServices";

const VietBai = () => {
  const [titleChange, setTitleChange] = useState("Viết Bài Mới");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const getCategories = async () => {
    const response = await ChungServices.list_categories();
    const categoriesOptions = response.data.categories.map((category) => ({
      value: category.category_id,
      label: category.name,
    }));
    setCategories(categoriesOptions);
  };

  const createSlug = (title) => {
    const vietnameseToAscii = (str) => {
      const map = {
        à: "a",
        á: "a",
        ả: "a",
        ã: "a",
        ạ: "a",
        ă: "a",
        ằ: "a",
        ắ: "a",
        ẳ: "a",
        ẵ: "a",
        ặ: "a",
        â: "a",
        ầ: "a",
        ấ: "a",
        ẩ: "a",
        ẫ: "a",
        ậ: "a",
        è: "e",
        é: "e",
        ẻ: "e",
        ẽ: "e",
        ẹ: "e",
        ê: "e",
        ề: "e",
        ế: "e",
        ể: "e",
        ễ: "e",
        ệ: "e",
        ì: "i",
        í: "i",
        ỉ: "i",
        ĩ: "i",
        ị: "i",
        ò: "o",
        ó: "o",
        ỏ: "o",
        õ: "o",
        ọ: "o",
        ô: "o",
        ồ: "o",
        ố: "o",
        ổ: "o",
        ỗ: "o",
        ộ: "o",
        ơ: "o",
        ờ: "o",
        ớ: "o",
        ở: "o",
        ỡ: "o",
        ợ: "o",
        ù: "u",
        ú: "u",
        ủ: "u",
        ũ: "u",
        ụ: "u",
        ư: "u",
        ừ: "u",
        ứ: "u",
        ử: "u",
        ữ: "u",
        ự: "u",
        ỳ: "y",
        ý: "y",
        ỷ: "y",
        ỹ: "y",
        ỵ: "y",
        đ: "d",
      };
      return str.replace(/./g, (char) => map[char] || char);
    };

    return vietnameseToAscii(title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/(^-|-$)/g, "");
  };
  const validateForm = () => {
    let errors = {};
    let valid = true;
  
    if (!title) {
      errors.title = "Tiêu đề không được để trống.";
      valid = false;
    } else if (title.length < 5) {
      errors.title = "Tiêu đề bài viết phải có ít nhất 5 ký tự.";
      valid = false;
    }
  
    if (!slug) {
      errors.slug = "Đường dẫn không được để trống.";
      valid = false;
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      errors.slug = "Đường dẫn chỉ cho phép chữ thường, số và dấu gạch nối '-'.";
      valid = false;
    }
  
    if (tags && !/^([a-zA-Z0-9]+)(,\s*[a-zA-Z0-9]+)*$/.test(tags)) {
      errors.tags =
        "Từ khóa không hợp lệ. Vui lòng sử dụng chữ cái và số, cách nhau bởi dấu ','. Ví dụ: 'tag1, tag2'.";
      valid = false;
    }
  
    if (!content) {
      errors.content = "Nội dung không được để trống.";
      valid = false;
    }
  
    if (selectedCategories.length === 0) {
      errors.categories = "Vui lòng chọn ít nhất một danh mục.";
      valid = false;
    }
  
    if (!image) {
      errors.image = "Vui lòng chọn ảnh.";
      valid = false;
    }
  
    setValidationErrors(errors);
    return valid;
  };  
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/dang-nhap");
    }
  }, [navigate]);

  useEffect(() => {
    getCategories();
    setSlug(createSlug(title));
  }, [title]);

  const handleSubmit = async (e, is_draft = 0) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) {
      toast.error("Hãy điền đầy đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("tags", tags);
    formData.append("is_draft", is_draft);
    formData.append("image_url", image);
    formData.append("content", content);
    formData.append("categories", JSON.stringify(selectedCategories));

    try {
      const addArticle = await BaiVietServices.add(formData);
      if (addArticle.status === 201) {
        if (is_draft === 1) {
          toast.success("Đã lưu bản nháp bài viết");
        } else {
          toast.success(addArticle.data.message);
        }
        navigate(`/tai-khoan`);
      } else {
        toast.error(addArticle.response.data.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handelTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(createSlug(e.target.value)); // Update slug based on title input
    setTitleChange(e.target.value || "Viết Bài Mới");
  };

  return (
    <>
      <main className="position-relative">
        <div className="archive-header text-center mb-50">
          <div className="container">
            <h2>
              <span className="text-success">{titleChange}</span>
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
              <span /> Viết Bài Mới
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
                        data={content || ""}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setContent(data);
                        }}
                        config={{
                          toolbar: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "|",
                            "link",
                            "imageUpload",
                            "blockQuote",
                            "|",
                            "bulletedList",
                            "numberedList",
                            "|",
                            "insertTable",
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                            "|",
                            "mediaEmbed",
                            "|",
                            "outdent",
                            "indent",
                            "|",
                            "undo",
                            "redo",
                            "|",
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
                    {validationErrors.content && (
                      <p className="text-danger">{validationErrors.content}</p>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 order-2 order-md-1">
                  <div className="sidebar-widget mb-50">
                    <div className="widget-header bg-white border-radius-10 p-15">
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
                              value={title}
                              onChange={handelTitleChange}
                              required
                            />
                            {validationErrors.title && (
                              <p className="text-danger">
                                {validationErrors.title}
                              </p>
                            )}
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
                            />
                            {validationErrors.slug && (
                              <p className="text-danger">
                                {validationErrors.slug}
                              </p>
                            )}
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
                                  width: "100%",
                                  border: "1px solid #eee",
                                  borderRadius: "5px",
                                  minHeight: "48px",
                                  paddingLeft: "7px",
                                  backgroundColor: "white",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                            {validationErrors.categories && (
                              <p className="text-danger">
                                {validationErrors.categories}
                              </p>
                            )}
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
                            />
                            {validationErrors.tags && (
                              <p className="text-danger">
                                {validationErrors.tags}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="image">Chọn Ảnh</label>
                            <input
                              type="file"
                              className="form-control"
                              id="image"
                              name="image"
                              onChange={(e) => setImage(e.target.files[0])}
                              required
                            />
                            {validationErrors.image && (
                              <p className="text-danger">
                                {validationErrors.image}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn-profile-update btn btn-primary"
                        style={{ zIndex: 0 }}
                        onClick={(e) => handleSubmit(e, 1)}
                      >
                        Lưu Bản Nháp
                      </button>
                      <button
                        className="btn-profile-update btn btn-primary float-right"
                        style={{ zIndex: 0 }}
                        onClick={(e) => handleSubmit(e)}
                      >
                        Đăng Bài Viết
                      </button>
                    </div>
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

export default VietBai;
