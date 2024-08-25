import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({}, { strict: false });

//has generic type & schema since we just want to read the collection and not mutate it

const Products = mongoose.model('shopifyProducts', productSchema);

export default Products;
