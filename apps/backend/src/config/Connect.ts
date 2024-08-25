import mongoose from 'mongoose';
mongoose.set('strictQuery', true);

const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment is not available');
    }

    await mongoose.connect(mongoUri).then(() => {
      console.log('connected to db.');
      // listCollections();
      // mongoose.set('debug', true);
    });
  } catch (err: any) {
    console.log('error connecting to db', err);
  }
};

// const listCollections = async () => {
//   try {
//     const collections = await mongoose.connection.db
//       .listCollections()
//       .toArray();

//     // Extract and print collection names
//     const collectionNames = collections.map(col => col.name);
//     console.log(collectionNames);
//   } catch (err) {
//     console.error('Error listing collections:', err);
//   }
// };

export default dbConnect;
