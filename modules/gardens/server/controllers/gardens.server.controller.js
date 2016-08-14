'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Garden = mongoose.model('Garden'),
 GardenSeason = mongoose.model('GardenSeason'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Garden
 */
 exports.create = function(req, res) {
  var garden = new Garden(req.body);
  garden.user = req.user;
  garden.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });

};

/**
 * Show the current Garden
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON

  var garden = req.garden ? req.garden.toJSON() : {};
  garden.seasons = req.body.seasons;
  console.log("read");
  garden.isCurrentUserOwner = req.user && garden.user && garden.user._id.toString() === req.user._id.toString() ? true : false;
  garden.isAdmin = req.user.roles[0]==='admin'? true:false;
  garden.isAllow = ( garden.isCurrentUserOwner|| garden.isAdmin)?true:false;
  res.jsonp(garden);
};

/**
 * Update a Garden
 */
 exports.update = function(req, res) {
  var garden = req.garden ;
  var dbmanage = req.garden
  garden = _.extend(garden , req.body);
  garden.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  })
};

/**
 * Delete an Garden
 */
 exports.delete = function(req, res) {
  var garden = req.garden ;
  garden.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(garden);
    }
  });
};

/**
 * List of Gardens
 */
 exports.list = function(req, res) { 
  var currentUserid = req.user._id;
  var currentUserRoles = req.user.roles[0];
  var seasons = [];
  if(currentUserRoles==='admin'){
    GardenSeason.find().sort('-created').populate('garden', 'name').exec(function(err, gardenSeasons) {
      if (err) {
       ;
     } else {
      seasons = gardenSeasons;
    }
  });

    Garden.find().sort('-user').populate('user', 'displayName').exec(function(err, gardens) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = [];
        var list ={}
        list.gardens = gardens;
        list.seasons = seasons;
        data.push(list);
        res.jsonp(data);
      }
    });
  } else {
    Garden.find({user:currentUserid}).sort('-created').populate('user', 'displayName').exec(function(err, gardens) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = [];
        var list ={}
        var gardenSeasons = [];
        // var gd = gardens;
        // for (var i in gd) {
        //   GardenSeason.find({garden: gardens[i]._id}).sort('-created').populate('garden', 'name').exec(function(err, gardenSeasons) {
        //     if (err) {
        //      ;
        //    } else {    
        //     seasons = gardenSeasons.concat(seasons);
        //     console.log("3"+seasons);
        //   };
        // });
        // };
        list.gardens = gardens;
          // list.seasons = seasons;
          data.push(list);
          res.jsonp(data);
        };
      });
  }
};

/**
 * Garden middleware
 */
 exports.gardenByID = function(req, res, next, id) {
  var seasons = [];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vườn không hợp lệ'
    });
  }

  GardenSeason.find({garden:id}).populate('garden','name').exec(function (err,ss){  
    seasons = ss;
  });
  Garden.findById(id).populate('user', 'displayName').exec(function (err, garden) {
    if (err) {
      return next(err);
    } else if (!garden) {
      return res.status(404).send({
        message: 'Không tìm thấy vườn!'
      });
    }
    garden.seasons = seasons;
    req.garden = garden;
    req.body.seasons = seasons
    next();
  });
};
