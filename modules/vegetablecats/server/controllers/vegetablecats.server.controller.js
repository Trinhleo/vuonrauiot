'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vegetablecat = mongoose.model('Vegetablecat'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Vegetablecat
 */
exports.create = function(req, res) {
  var vegetablecat = new Vegetablecat(req.body);
  vegetablecat.user = req.user;

  vegetablecat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vegetablecat);
    }
  });
};

/**
 * Show the current Vegetablecat
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vegetablecat = req.vegetablecat ? req.vegetablecat.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vegetablecat.isCurrentUserOwner = req.user && vegetablecat.user && vegetablecat.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(vegetablecat);
};

/**
 * Update a Vegetablecat
 */
exports.update = function(req, res) {
  var vegetablecat = req.vegetablecat ;

  vegetablecat = _.extend(vegetablecat , req.body);

  vegetablecat.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vegetablecat);
    }
  });
};

/**
 * Delete an Vegetablecat
 */
exports.delete = function(req, res) {
  var vegetablecat = req.vegetablecat ;

  vegetablecat.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vegetablecat);
    }
  });
};

/**
 * List of Vegetablecats
 */
exports.list = function(req, res) { 
  Vegetablecat.find().sort('-created').populate('user', 'displayName').exec(function(err, vegetablecats) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vegetablecats);
    }
  });
};

/**
 * Vegetablecat middleware
 */
exports.vegetablecatByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vegetablecat is invalid'
    });
  }

  Vegetablecat.findById(id).populate('user', 'displayName').exec(function (err, vegetablecat) {
    if (err) {
      return next(err);
    } else if (!vegetablecat) {
      return res.status(404).send({
        message: 'No Vegetablecat with that identifier has been found'
      });
    }
    req.vegetablecat = vegetablecat;
    next();
  });
};
