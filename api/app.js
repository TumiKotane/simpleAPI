require('dotenv').config();
const express = require('express');
const app = express();
// Middleware configuration
const authorize = require('./middleware/Authorize');
const swaggerui = require('swagger-ui-express');
const swag = require('./utils/swaggerUI');
// Connecting to the database
const connectDB = require('./db/connect');
// Routes
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const options = require('./utils/staticOptions');
// Router Middleware
app.use(express.static('public', options));
app.use(express.json());
app.use('/api/v1/', userRouter);
app.use('/api/v1/', authorize, postRouter);
app.use('/docs', swaggerui.serve, swaggerui.setup(swag));
// Spinning up Server and Database
const port = process.env.PORT;
const url = process.env.MONGO_URI; // Connection string for MongoDB

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
    process.exit(1); // 1 means exit with failure
  }
};

start();

