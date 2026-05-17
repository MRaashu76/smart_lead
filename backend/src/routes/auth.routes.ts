import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth.validators';

const router = Router();

router.post('/register', validate(registerSchema), (req, res, next) =>
  authController.register(req, res, next)
);

router.post('/login', validate(loginSchema), (req, res, next) =>
  authController.login(req, res, next)
);

router.get('/profile', protect, (req, res, next) =>
  authController.getProfile(req as Parameters<typeof authController.getProfile>[0], res, next)
);

router.get('/users', protect, authorize('admin'), (req, res, next) =>
  authController.getAllUsers(req as Parameters<typeof authController.getAllUsers>[0], res, next)
);

export default router;
