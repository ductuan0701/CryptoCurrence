import axiosInstance from '../index';

const DangNhapServices = {
    login: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/login', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    password_reset: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/user/password-reset', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    reset_password: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', data);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default DangNhapServices;
