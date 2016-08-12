'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    Season = mongoose.model('Season'),
    Seasongardens = mongoose.model('seasongardens'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');


exports.create = function (req, res) {
    var season = new Season(req.body);
    // season.user = req.user;
    var startDate = Date.parse(season.startDate);
    var endDate =  Date.parse(season.endDate);
    var datediff = endDate-startDate;
    console.log(datediff);
    if(datediff>777600000){
    var fertilizer1Date= new Date(startDate+datediff/2);
    var fertilizer2Date= new Date(endDate-datediff/5);
    season.fertilizer1Date = fertilizer1Date;
    season.fertilizer2Date = fertilizer2Date;
    console.log( season.fertilizer1Date);
    console.log( season.fertilizer2Date);
     }

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


exports.read = function (req, res) {
    // convert mongoose document to JSON
    var season = req.season ? req.season.toJSON() : {};
    var currentUserRoles = req.user.roles[0];
    season.isCurrentUserOwner = (currentUserRoles === 'admin') ? true : false;
    
    // season.isCurrentUserOwner = req.user && season.user && season.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(season);
};

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

exports.listByGardenId = function (req, res) {
    var gardenId = req.body.garden;
    console.log(gardenId);
    Season.find({garden:gardenId}).sort('-created').populate('garden', 'name').exec(function (err, seasons) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(seasons);
        }
    });
};

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
