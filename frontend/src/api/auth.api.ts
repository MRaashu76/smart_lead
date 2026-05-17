import axiosInstance from './axiosInstance';
import { ApiResponse, LoginForm, RegisterForm, User } from '@/types';

interface AuthData {
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: RegisterForm): Promise<ApiResponse<AuthData>> => {
    const res = await axiosInstance.post<ApiResponse<AuthData>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginForm): Promise<ApiResponse<AuthData>> => {
    const res = await axiosInstance.post<ApiResponse<AuthData>>('/auth/login', data);
    return res.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.get<ApiResponse<User>>('/auth/profile');
    return res.data;
  },

  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const res = await axiosInstance.get<ApiResponse<User[]>>('/auth/users');
    return res.data;
  },
};
