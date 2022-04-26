const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      next(new AppError(`No document found with that ID`, 404));
      return;
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //options sends updated document.
      runValidators: true, //run validators again
    });

    if (!doc) {
      next(new AppError(`No document found with that ID`, 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      next(new AppError(`No document found with that ID`, 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
