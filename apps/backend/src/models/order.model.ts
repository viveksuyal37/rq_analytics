import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema({}, { strict: false });

//has generic type & schema since we just want to read the collection and not mutate it

export const Orders = mongoose.model(
  'shopifyOrders',
  OrderSchema,
  'shopifyOrders',
);
