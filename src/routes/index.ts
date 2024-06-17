import { Router } from 'express';

const router = Router();

router.get('/', function (req, res) {
    return res.send(`<h1>Allroutes Logistics API</h1>
        <P> AllRoutes is your trusted logistics partner,
        providing seamless delivery solutions with real-time tracking capabilities.
        Our platform empowers businesses and individuals to track their shipments from pickup
        to delivery, ensuring transparency, reliability, and peace of mind.</p>`);
});

export default router;