import connectDB from '../config/db';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(cors());
app.use(express.json()); // To be able to handle requests with Content-Type: application/json.

connectDB();

app.get('/', (req, res) => {
    res.send('API is running');
});

const PORT = process.env.APP_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

export default app;