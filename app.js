const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const viewRouter = require('./routes/viewRoutes')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
// 1) GLOBAL MIDDLEWARES
// Serving static file
app.use(express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet())

// prevent brute force attack from same IP
const limiter = rateLimit({
  max: 100,  // Maxinum 100 reqs / 1 hour
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP/. Try again in an hour!'
})
app.use('/api', limiter)
// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

// Body parser, reading date from body into req.body
app.use(express.json({ limit : '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xssClean())
// Prevent Parameter Polution
// Eg: {{URL}}/api/v1/tours?sort=duration&sort=price => sort by price
// Eg: {{URL}}/api/v1/tours?duration=5&duration=9 => duration in 5 and 9
app.use(hpp({
  whitelist: [
    'duration', 'ratingQuantity', 'maxGroupSize', 'ratingAverage', 'difficulty', 'price'
  ]
}))

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});

// 3) ROUTES
app.get('/', viewRouter)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
