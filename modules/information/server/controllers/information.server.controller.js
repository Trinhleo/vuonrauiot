'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Information = mongoose.model('Information'),
  DbSeason = mongoose.model('Dbseason'),
  Dbeasongardens = mongoose.model('Dbseasongardens'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Information
 */
exports.create = function(req, res) {
  var information = new Information(req.body);
  information.user = req.user;

  information.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(information);
    }
  });
};

/**
 * Show the current Information
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var information = req.information ? req.information.toJSON() : {};
  information.isCurrentUserOwner = req.user && information.user && information.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(information);
};

/**
 * Update a Information
 */
exports.update = function(req, res) {
  var information = req.information ;

  information = _.extend(information , req.body);

  information.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(information);
    }
  });
};

/**
 * Delete an Information
 */
exports.delete = function(req, res) {
  var information = req.information ;

  information.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(information);
    }
  });
};

/**
 * List of Information
 */
exports.list = function(req, res) { 
  Information.find().sort('-created').populate('Dbseason', 'name').exec(function(err, information) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(information);
    }
  });
};

/**
 * Information middleware
 */
exports.informationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Thông tin không hợp lệ'
    });
  }

  Information.findById(id).populate('user', 'displayName').exec(function (err, information) {
    if (err) {
      return next(err);
    } else if (!information) {
      return res.status(404).send({
        message: 'Không tìm thấy thông tin'
      });
    }
    req.information = information;
    next();
  });
};
