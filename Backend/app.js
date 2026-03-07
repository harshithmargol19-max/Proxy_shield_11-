import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import stemRoute from './Routes/stemRoute.js';

const app = express();

app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use('/api', stemRoute);

app.get('/', (req, res) => {
  res.send('ProxyShield 11 API is running');
});

export default app;
