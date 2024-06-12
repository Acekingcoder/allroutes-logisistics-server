import {Router} from 'express';

const router = Router();

router.get('/', function(req, res){
    return res.send('auth route handlers');
});

export default router;