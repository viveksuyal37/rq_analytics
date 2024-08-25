import { RequestHandler } from 'express';
import { Orders } from '../../models/order.model';
import { Frequency, querySchema } from '../../types/api';

const getTotalSalesOverTime: RequestHandler = async (req, res) => {
  const { success, data, error } = querySchema.safeParse(req.query);

  if (!success) {
    return res.status(400).json({ success: false, error: error?.errors });
  }

  const { frequency, year } = data;

  try {
    const groupBy: any = {};
    const match: any = {};

    if (year) {
      match.year = year;
    }

    switch (frequency) {
      case Frequency.DAILY:
        groupBy.year = {
          $year: { $dateFromString: { dateString: '$created_at' } },
        };
        groupBy.month = {
          $month: { $dateFromString: { dateString: '$created_at' } },
        };
        groupBy.day = {
          $dayOfMonth: { $dateFromString: { dateString: '$created_at' } },
        };
        break;
      case Frequency.MONTHLY:
        groupBy.year = {
          $year: { $dateFromString: { dateString: '$created_at' } },
        };
        groupBy.month = {
          $month: { $dateFromString: { dateString: '$created_at' } },
        };
        break;
      case Frequency.QUARTERLY:
        groupBy.year = {
          $year: { $dateFromString: { dateString: '$created_at' } },
        };
        groupBy.quarter = {
          $ceil: {
            $divide: [
              { $month: { $dateFromString: { dateString: '$created_at' } } },
              3,
            ],
          },
        };
        break;
      case Frequency.YEARLY:
        groupBy.year = {
          $year: { $dateFromString: { dateString: '$created_at' } },
        };
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: 'Invalid frequency parameter' });
    }

    const salesData = await Orders.aggregate([
      {
        $addFields: {
          year: { $year: { $dateFromString: { dateString: '$created_at' } } },
        },
      },
      {
        $match: match,
      },

      {
        $group: {
          _id: groupBy,
          totalSales: { $sum: { $toDouble: '$total_price' } },
        },
      },

      {
        $sort: {
          '_id.month': 1,
          '_id.year': 1,
          '_id.day': 1,
          '_id.quarter': 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
          quarter: '$_id.quarter',
          totalSales: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: salesData });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default getTotalSalesOverTime;
