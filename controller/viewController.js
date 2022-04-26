const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render the template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('there is no tour with that name', 404));
  }

  // 3) Render the template using data from 1)

  // `default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;`
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
});

const getLoginForm = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render('login', {
      title: 'Log into your account',
    });
};

const getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

const getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  getMyTours,
};
