'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Dbmanage = mongoose.model('Dbmanage'),
    Dbgardens = mongoose.model('Dbgardens'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Dbmanage
 */
exports.create = function (req, res) {
    var dbmanage = new Dbmanage(req.body);
    dbmanage.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dbmanage);
        }
    });
};

/**
 * Show the current Dbmanage
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var dbmanage = req.dbmanage ? req.dbmanage.toJSON() : {};
    var currentUserRoles = req.user.roles[0];
    dbmanage.isCurrentUserOwner = (currentUserRoles === 'admin') ? true : false;

    res.jsonp(dbmanage);
};

/**
 * Update a Dbmanage
 */
exports.update = function (req, res) {
    var dbmanage = req.dbmanage;
    dbmanage = _.extend(dbmanage, req.body);
    dbmanage.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dbmanage);
        }
    });
};

/**
 * Delete an Dbmanage
 */
exports.delete = function (req, res) {
    var dbmanage = req.dbmanage;

    dbmanage.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dbmanage);
        }
    });
};

/**
 * List of Dbmanages
 */
exports.list = function (req, res) {
    Dbmanage.find().sort('-created').populate('user', 'displayName').exec(function (err, dbmanages) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(dbmanages);
        }
    });
};

/**
 * Dbmanage middleware
 */
exports.dbmanageByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Không hợp lệ!'
        });
    }
    Dbmanage.findById(id).populate('user', 'displayName').exec(function (err, dbmanage) {
        if (err) {
            return next(err);
        } else if (!dbmanage) {
            return res.status(404).send({
                message: 'Không tìm thấy dữ liệu với id này!'
            });
        }
        req.dbmanage = dbmanage;
        next();
    });
};
