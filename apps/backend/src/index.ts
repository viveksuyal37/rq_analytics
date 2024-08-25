import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import dbConnect from './config/Connect';
import customerRoutes from './routes/CustomerRoutes';
import salesRoutes from './routes/SalesRoutes';

const app = express();

const PORT = process.env.EXPRESS_PORT || 3003;

app.use(cors());

// connect to db
dbConnect();

app.get('/', (req, res) => {
  res.send('Hi there!');
});

// routes
app.use('/customers', customerRoutes);
app.use('/sales', salesRoutes);

app.listen(PORT, () => {
  console.log(`Express app is listening on port ${PORT}`);
});
