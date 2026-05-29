import axiosInstance from './index';

const NguoiDungServices = {

    // Lấy danh sách người dùng
    list: async (page = 1, search = "") => {
        try {
            const response = await axiosInstance.get(`/users/?page=${page}&search=${search}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết người dùng
    show: async (id) => {
        try {
            const response = await axiosInstance.get(`/users/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thông tin nguời dùng hiện tại
    profile: async () => {
        try {
            const response = await axiosInstance.get(`/users/profile`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật người dùng
    update: async (data) => {
        try {
            const response = await axiosInstance.put(`/users`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cấm nguời dùng
    block: async (id) => {
        try {
            const response = await axiosInstance.patch(`/users/${id}/block`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (data) => {
        try {
            const response = await axiosInstance.patch(`/users/changePassword`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    
     // Thay đổi vai trò người dùng
     toggleAdmin: async (id) => {
        try {
            const response = await axiosInstance.patch(`/users/${id}/toggleAdmin`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default NguoiDungServices;
