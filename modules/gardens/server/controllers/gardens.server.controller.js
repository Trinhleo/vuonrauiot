'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Garden = mongoose.model('Garden'),
 GardenSeason = require('mongoose').model('Season'),
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
  for(var x in garden.seasons){
    var seasonName = garden.seasons[x].name.slice(25);
    garden.seasons[x].name = seasonName;
  }
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
  garden.isEdited = true;
  garden.editDate = new Date();
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
  garden.isDeleted = true;
  garden.deleteDate = new Date();
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
 * List of Gardens
 */
 exports.list = function(req, res) { 
  var currentUser = req.user;
  var currentUserId = req.user._id;
  var currentUserRoles = req.user.roles[0];
  var seasons = [];
  if(currentUserRoles==='admin'){
    GardenSeason.find({isDeleted:false}).sort('-approved').populate('garden', 'name').exec(function(err, gardenSeasons) {
      if (err) {
       ;
     } else {
      seasons = gardenSeasons;
    }
  });

    Garden.find({isDeleted: false}).sort('-user').populate('user', 'displayName').exec(function(err, gardens) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = [];
        var list ={}
        for(var x in seasons){
          var seasonName = seasons[x].name.slice(25);
          seasons[x].name = seasonName;
        }
        list.gardens = gardens;
        list.seasons = seasons;
        data.push(list);
        res.jsonp(data);
      }
    });
  } else {
    var ss = [];
    var gd = [];
    console.log(currentUserId);
    Garden.find({user:{_id:currentUserId}}).sort('-created').populate('user', 'displayName').exec(function(err, gardens){
     if (err) {
       return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
     } else {
      var list = {};
      var data =[]
      gd = gardens;
      if(gd){
        var gdIdList = [];
        for (var x in gd){
          gdIdList.push(gd[x]._id);
        }
      }
      GardenSeason.find({isDeleted:false}).sort('-created').populate('garden', 'name').exec(function(err, gardenSeasons) {
        if (err) {
         return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
       } else {
        var ss = [];
        // console.log(gdIdList);
        for(var x in gardenSeasons){
          var ssGdId = gardenSeasons[x].garden._id.toString();
          // console.log(ssGdId);
          var idx = gdIdList.toString().indexOf(ssGdId);
          // console.log(idx);
          if(idx!=-1){
           var seasonName = gardenSeasons[x].name.slice(25);
           gardenSeasons[x].name = seasonName;
           ss.push(gardenSeasons[x]);
         };
       }
       list.seasons = ss?ss:[];
       list.gardens = gd?gd:[]; 
       data.push(list);
       res.jsonp(data);
     }
   });   
    }
  });   
  };
}

/** approved handler
*/
exports.approveGarden = function(req, res) {
  var garden = req.garden;
  var approved = garden.approved;
  if(approved) {
    garden.approved = 0;
  } else {
    garden.approved = 1;
  }
  garden.save();
  res.jsonp(garden);
  console.log(garden);
  res.status(200); 
}


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

  GardenSeason.find({garden:id,isDeleted: false}).populate('garden','name').exec(function (err,ss){  
    seasons = ss;
  });
  Garden.findById(id).populate('user', 'displayName').exec(function (err, garden) {
    if (err) {
      return next(err);
    } else if (!garden||garden.isDeleted) {
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
