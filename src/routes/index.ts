import {Router} from 'express';

const router = Router();

router.get('/', function(req, res){
    return res.send(`<h1>Allroutes Logistics API</h1>`);
});

export default router;