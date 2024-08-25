import express from 'express';
import getCustomerGeographicalDistribution from '../controllers/customer/GeographicalDistribution';
import getCustomerValue from '../controllers/customer/LifetimeValue';
import getNewCustomers from '../controllers/customer/NewCustomersOverTime';
import getRepeatedCustomers from '../controllers/customer/RepeatedCustomerOverTime';

const router = express.Router();

router.get('/analytics/citywise-dist', getCustomerGeographicalDistribution);
router.get('/analytics/value', getCustomerValue);
router.get('/analytics/repeated', getRepeatedCustomers);
router.get('/analytics/new', getNewCustomers);

export default router;
