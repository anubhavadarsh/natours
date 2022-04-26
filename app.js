const path = require('path');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
app.use(cors());
// 1) Serve static files
app.use(express.static(path.join(__dirname, 'public'))); //serve static file from folder instead of a route.

// 2) Set security HTTP headers
// app.use(helmet());

// 3) Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 4) Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// 5) Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); //use middleware .json() to add body to request object.
app.use(cookieParser());

// 6) Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 7) Data Sanitization against XSS
app.use(xssClean());

// 8) Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// 9) Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 10) Routes
app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

module.exports = app;
