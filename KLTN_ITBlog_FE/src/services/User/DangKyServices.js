import axiosInstance from '../index';

const DangKyServices = {
    register: async (data) => {
        try {
            const response = await axiosInstance.post('/auth/register', data);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default DangKyServices;
