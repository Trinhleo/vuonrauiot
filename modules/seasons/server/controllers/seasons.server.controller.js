'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Season = mongoose.model('Season'),
    Seasongardens = mongoose.model('seasongardens'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Season
 */
exports.create = function (req, res) {
    var season = new Season(req.body);
    // season.user = req.user;

    season.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(season);
        }
    });
};

/**
 * Show the current Season
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var season = req.season ? req.season.toJSON() : {};
    var currentUserRoles = req.user.roles[0];
    season.isCurrentUserOwner = (currentUserRoles === 'admin') ? true : false;
    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    // season.isCurrentUserOwner = req.user && season.user && season.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(season);
};

/**
 * Update a Season
 */
exports.update = function (req, res) {
    var season = req.season;

    season = _.extend(season, req.body);

    season.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(season);
        }
    });
};

/**
 * Delete an Season
 */
exports.delete = function (req, res) {
    var season = req.season;

    season.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(season);
        }
    });
};

/**
 * List of Seasons
 */
exports.list = function (req, res) {
    Season.find().sort('-created').populate('garden', 'name').exec(function (err, seasons) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(seasons);
        }
    });
};

/**
 * Season middleware
 */
exports.seasonByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Mùa vụ không hợp lệ'
        });
    }

    Season.findById(id).populate('garden', 'name').exec(function (err, season) {
        if (err) {
            return next(err);
        } else if (!season) {
            return res.status(404).send({
                message: 'Không tìm thấy mùa vụ'
            });
        }
        req.season = season;
        next();
    });
};
