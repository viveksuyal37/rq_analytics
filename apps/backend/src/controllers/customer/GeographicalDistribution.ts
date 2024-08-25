import { RequestHandler } from 'express';
import ShopifyCustomer from '../../models/customer.model';

const getCustomerGeographicalDistribution: RequestHandler = async (
  req,
  res,
) => {
  try {
    const results = await ShopifyCustomer.aggregate([
      {
        $match: {
          'default_address.city': { $ne: null },
        },
      },
      // Group by city and count of customers in each city
      {
        $group: {
          _id: '$default_address.city',
          count: { $sum: 1 },
        },
      },
      // Sort by count
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          city: '$_id',
          count: '$count',
        },
      },
    ]);
    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};

export default getCustomerGeographicalDistribution;
