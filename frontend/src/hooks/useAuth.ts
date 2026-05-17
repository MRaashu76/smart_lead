import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuth } from '@/context/AuthContext';
import { LoginForm, RegisterForm } from '@/types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginForm) => authApi.login(data),
    onSuccess: (res) => {
      if (res.data) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}!`);
        navigate('/dashboard');
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Login failed');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterForm) => authApi.register(data),
    onSuccess: (res) => {
      if (res.data) {
        login(res.data.token, res.data.user);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message ?? 'Registration failed');
    },
  });
};
