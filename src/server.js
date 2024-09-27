import app from './app';
import { connectDB } from '../config/db';

const PORT = process.env.APP_PORT || 5001;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();