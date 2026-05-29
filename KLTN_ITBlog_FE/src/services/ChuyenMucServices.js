import axiosInstance from './index';

const ChuyenMucServices = {
    // Thêm chuyên mục
    add: async (data) => {
        try {
            const response = await axiosInstance.post('/categories', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy danh sách chuyên mục
    list: async (page = 1, search = "") => {
        try {
            const response = await axiosInstance.get(`/categories/?page=${page}&search=${search}`);
            return response;
        } catch (error) {
            throw error;
        }
    },
    // Lấy danh sách chuyên mục không phân trang
    listAll: async () => {
        try {
            const response = await axiosInstance.get(`others/list_categories`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết chuyên mục
    show: async (id) => {
        try {
            const response = await axiosInstance.get(`/categories/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật chuyên mục
    update: async (id, data) => {
        try {
            const response = await axiosInstance.put(`/categories/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa chuyên mục
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/categories/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default ChuyenMucServices;
