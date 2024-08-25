import { RequestHandler } from 'express';
import { Orders } from '../../models/order.model';
import { querySchema } from '../../types/api';

const getSalesGrowthRateOverTime: RequestHandler = async (req, res) => {
  const startMonth = 1; // Start from January
  const endMonth = 12; // End in December

  const { success, data, error } = querySchema.safeParse(req.query);

  if (!success) {
    return res.status(400).json({ success: false, error: error?.errors });
  }

  const year = data?.year ?? new Date().getFullYear();

  try {
    const totalSalesOverTime = await Orders.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  { $year: { $dateFromString: { dateString: '$created_at' } } },
                  year,
                ],
              },
              {
                $lt: [
                  { $year: { $dateFromString: { dateString: '$created_at' } } },
                  year + 1,
                ],
              },
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            year: { $year: { $dateFromString: { dateString: '$created_at' } } },
            month: {
              $month: { $dateFromString: { dateString: '$created_at' } },
            },
          },
          totalSales: { $sum: { $toDouble: '$total_price' } },
        },
      },

      { $sort: { '_id.year': 1, '_id.month': 1 } },

      {
        $group: {
          _id: null,
          salesData: {
            $push: {
              month: '$_id.month',
              year: '$_id.year',
              totalSales: '$totalSales',
            },
          },
        },
      },
    ]);

    const salesGrowthRate = totalSalesOverTime?.[0]?.salesData?.map(
      (item: any, index: any) => {
        if (index === 0) {
          return {
            year: item.year,
            month: item.month,
            totalSales: item.totalSales,
            salesGrowthRate: '0%',
          };
        }

        const previousMonth = totalSalesOverTime?.[0]?.salesData?.[index - 1];
        const growthRate =
          ((item.totalSales - previousMonth.totalSales) /
            previousMonth.totalSales) *
          100;

        return {
          year: item.year,
          month: item.month,
          totalSales: item.totalSales,
          salesGrowthRate: growthRate.toFixed(2) + '%',
        };
      },
    );

    res.status(200).json({ success: true, data: salesGrowthRate });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getSalesGrowthRateOverTime;
