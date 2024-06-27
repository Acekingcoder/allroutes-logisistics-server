import {Router} from 'express';
import * as user from '../controllers/userController';
import * as admin from '../controllers/admin';
import * as rider from '../controllers/riderController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', user.createUser);
router.post('/register/rider', rider.createRiderProfile);
router.post('/register/admin', admin.create);
router.post('/login', user.loginUser, rider.loginRider);
router.post('/login/admin', admin.login);
router.post('/forgot-password', user.sendPasswordResetOtp);
router.post('/reset-password', user.resetPassword);
router.get('/me', authenticate, user.getMe);
router.post('/logout', authenticate, user.logout);

export default router;