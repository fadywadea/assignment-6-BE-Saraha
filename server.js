"use strict"

process.on('uncaughtException', (error) => {
  console.log('Error:', error);
});

import express from 'express'
import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/users/user.routes.js'
import messageRouter from './src/modules/messages/message.routes.js';
import { appError } from './src/utils/appError.js';
import { globalError } from './src/middleware/globalErrorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000

dbConnection();

app.use(express.json());
app.use('/api/v1', userRouter);
app.use('/api/v1', messageRouter);

app.use('*', (req, res, next) => {
  next(new appError(`Not found endPoint: ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on('unhandledRejection', (error) => {
  console.log('Error:', error);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));