import {Router} from 'express';
import * as admin from '../controllers/admin';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', authenticate, authorizeAdmin, admin.getAll);

export default router;