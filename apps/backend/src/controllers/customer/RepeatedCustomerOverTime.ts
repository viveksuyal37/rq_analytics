import { RequestHandler } from 'express';
import { Orders } from '../../models/order.model';
import { Frequency, querySchema } from '../../types/api';

const getRepeatedCustomers: RequestHandler = async (req, res) => {
  const { success, data, error } = querySchema.safeParse(req.query);

  if (!success) {
    return res.status(400).json({ success: false, error: error?.errors });
  }

  const freq = data?.frequency;

  try {
    const matchStage: any = {};

    if (data.year) {
      matchStage.$expr = {
        $and: [
          {
            $eq: [
              { $year: { $dateFromString: { dateString: '$created_at' } } },
              data.year,
            ],
          },
        ],
      };
    }

    let dateGroup: any;
    let sortStage: any;

    switch (freq) {
      case Frequency.DAILY:
        dateGroup = {
          year: { $year: { $dateFromString: { dateString: '$created_at' } } },
          month: { $month: { $dateFromString: { dateString: '$created_at' } } },
          day: {
            $dayOfMonth: { $dateFromString: { dateString: '$created_at' } },
          },
        };
        sortStage = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
        break;
      case Frequency.MONTHLY:
        dateGroup = {
          year: { $year: { $dateFromString: { dateString: '$created_at' } } },
          month: { $month: { $dateFromString: { dateString: '$created_at' } } },
        };
        sortStage = { '_id.year': 1, '_id.month': 1 };
        break;
      case Frequency.QUARTERLY:
        dateGroup = {
          year: { $year: { $dateFromString: { dateString: '$created_at' } } },
          quarter: {
            $ceil: {
              $divide: [
                { $month: { $dateFromString: { dateString: '$created_at' } } },
                3,
              ],
            },
          },
        };
        sortStage = { '_id.year': 1, '_id.quarter': 1 };
        break;
      case Frequency.YEARLY:
        dateGroup = {
          year: { $year: { $dateFromString: { dateString: '$created_at' } } },
        };
        sortStage = { '_id.year': 1 };
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: 'Invalid frequency parameter' });
    }

    const response = await Orders.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: {
            customer_id: { $toString: '$customer.id' },
            ...dateGroup,
          },
          orderCount: { $sum: 1 },
        },
      },
      {
        $match: {
          orderCount: { $gt: 1 },
        },
      },
      {
        $lookup: {
          from: 'shopifyCustomers',
          localField: '_id.customer_id',
          foreignField: '_id',
          as: 'customer',
        },
      },

      {
        $sort: sortStage,
      },
      {
        $project: {
          _id: 0,
          customer_id: '$_id.customer_id',
          month: '$_id.month',
          year: '$_id.year',
          day: '$_id.day',
          quarter: '$_id.quarter',
          orderCount: 1,
          customer: { $arrayElemAt: ['$customer', 0] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getRepeatedCustomers;
