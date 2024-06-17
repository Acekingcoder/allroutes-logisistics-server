import {Router} from 'express';
import * as auth from '../controllers/userController';

const router = Router();

router.post('/register', auth.createUser);
router.post('/login', auth.loginUser);
router.post('/forgot-password', auth.sendPasswordResetOtp)

export default router;