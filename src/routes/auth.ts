import {Router} from 'express';
import * as user from '../controllers/userController';
import * as admin from '../controllers/admin';

const router = Router();

router.post('/register', user.createUser);
router.post('/login', user.loginUser);
router.post('/forgot-password', user.sendPasswordResetOtp);
router.post('/reset-password', user.resetPassword);
router.post('/register/admin', admin.create);
router.post('/login/admin', admin.login);

export default router;