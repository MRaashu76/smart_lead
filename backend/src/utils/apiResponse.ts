import { Response } from 'express';
import { ApiResponse } from '../interfaces';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errors?: string[]
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message = 'Created successfully'
): Response<ApiResponse<T>> => sendSuccess(res, data, message, 201);
