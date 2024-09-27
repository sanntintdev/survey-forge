import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import express, { json } from 'express';
import authRoutes from './routes/authRoutes';

config();

const app = express();

app.use(cors());
app.use(json()); // To be able to handle requests with Content-Type: application/json.


app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api', authRoutes);

export default app;