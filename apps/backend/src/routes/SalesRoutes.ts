import express from 'express';
import getSalesGrowthRateOverTime from '../controllers/sales/SalesGrowthRateOverTime';
import getTotalSalesOverTime from '../controllers/sales/TotalSalesOverTime';

const router = express.Router();

router.get('/analytics/growth', getSalesGrowthRateOverTime);
router.get('/analytics/total', getTotalSalesOverTime);

export default router;
