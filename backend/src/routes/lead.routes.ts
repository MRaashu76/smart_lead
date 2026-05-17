import { Router } from 'express';
import { leadController } from '../controllers/lead.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validators/lead.validators';

const router = Router();

type LC = typeof leadController;
type AuthParams = Parameters<LC['create']>;

const wrap =
  (fn: (...args: AuthParams) => Promise<void>) =>
  (...args: AuthParams) =>
    fn(...args);

router.use(protect);

router.get('/stats', (req, res, next) =>
  leadController.getStats(req as AuthParams[0], res, next)
);

router.get('/export', authorize('admin'), (req, res, next) =>
  leadController.exportCsv(req as AuthParams[0], res, next)
);

router.get('/', validate(leadQuerySchema), (req, res, next) =>
  leadController.findAll(req as AuthParams[0], res, next)
);

router.post('/', validate(createLeadSchema), (req, res, next) =>
  leadController.create(req as AuthParams[0], res, next)
);

router.get('/:id', (req, res, next) =>
  leadController.findOne(req as AuthParams[0], res, next)
);

router.put('/:id', validate(updateLeadSchema), (req, res, next) =>
  leadController.update(req as AuthParams[0], res, next)
);

router.delete('/:id', authorize('admin'), (req, res, next) =>
  leadController.delete(req as AuthParams[0], res, next)
);

export default router;
