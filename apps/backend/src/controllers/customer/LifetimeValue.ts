import { RequestHandler } from 'express';
import { Orders } from '../../models/order.model';

const getCustomerValue: RequestHandler = async (req, res) => {
  try {
    const response = await Orders.aggregate([
      {
        $lookup: {
          from: 'shopifyCustomers',
          localField: 'customer.id',
          foreignField: '_id',
          as: 'customerDetails',
        },
      },

      {
        $unwind: '$customerDetails',
      },

      {
        $project: {
          orderId: '$_id',
          orderAmount: { $toDouble: '$total_price' },
          customerId: '$customerDetails._id',
          createdDate: { $dateFromString: { dateString: '$created_at' } },
        },
      },

      {
        $group: {
          _id: {
            month: { $month: '$createdDate' },
            year: { $year: '$createdDate' },
            customerId: '$customerId',
          },
          totalSpent: { $sum: '$orderAmount' },
          firstPurchaseDate: { $first: '$createdDate' },
        },
      },

      {
        $group: {
          _id: {
            month: '$_id.month',
            year: '$_id.year',
          },
          lifetimeValue: { $sum: '$totalSpent' },
          customerCount: { $sum: 1 },
        },
      },

      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },

      {
        $project: {
          _id: 0,
          cohort: {
            month: '$_id.month',
            year: '$_id.year',
          },
          lifetimeValue: 1,
          customerCount: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default getCustomerValue;
