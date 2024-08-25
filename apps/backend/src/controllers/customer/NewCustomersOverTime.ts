import { RequestHandler } from 'express';
import ShopifyCustomer from '../../models/customer.model';
import { querySchema } from '../../types/api';

const getNewCustomers: RequestHandler = async (req, res) => {
  const { success, data, error } = querySchema.safeParse(req.query);

  const matchConditions: any = {
    created_at: { $exists: true },
  };

  if (!success) {
    return res.status(400).json({ success: false, error: error?.errors });
  } else if (data?.year) {
    matchConditions.$expr = {
      $and: [
        {
          $gte: [
            { $year: { $dateFromString: { dateString: '$created_at' } } },
            data.year,
          ],
        },
        {
          $lt: [
            { $year: { $dateFromString: { dateString: '$created_at' } } },
            data.year + 1,
          ],
        },
      ],
    };
  }

  try {
    const response = await ShopifyCustomer.aggregate([
      {
        $match: matchConditions,
      },
      {
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: '$created_at',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdDate' },
            month: { $month: '$createdDate' },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          total: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getNewCustomers;
