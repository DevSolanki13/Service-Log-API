require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middlewares
const authRouter = require('./routes/auth')
const servicesRouter = require('./routes/services')
const vehiclesRouter = require('./routes/vehicles')

// extra packages
const cors = require('cors');
app.use(cors());
app.use(express.json());

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/services', authenticateUser, servicesRouter)
app.use('/api/v1/vehicles', authenticateUser, vehiclesRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
