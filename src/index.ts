import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
dotenv.config();
import { AppDataSource } from './config/data-source';
import { authRoutes, userRoutes } from './routes';
import { errorHandler } from './utils/middlewares/error';
import { HttpException } from './utils';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

AppDataSource.initialize()
  .then(() => console.log('Database connected'))
  .catch((error) => console.error('Database connection failed:', error));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

app.use((req, res, next) => {
  throw HttpException.notFound(`Cannot ${req.method} ${req.originalUrl}`);
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
