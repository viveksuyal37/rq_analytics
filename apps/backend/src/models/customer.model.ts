import mongoose, { Schema } from 'mongoose';

const ShopifyCustomerSchema = new Schema({}, { strict: false });

//has generic type & schema since we just want to read the collection and not mutate it

const ShopifyCustomer = mongoose.model<any>(
  'shopifyCustomers',
  ShopifyCustomerSchema,
  'shopifyCustomers',
);

export default ShopifyCustomer;
