'use strict';

var path = require('path'),
mongoose = require('mongoose'),
Season = mongoose.model('Season'),
Seasongardens = require('mongoose').model('Garden'),
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
_ = require('lodash');

var cron = require('node-cron');

cron.schedule('* * * * *', function(){
 Season.find().sort('-created').populate('garden', 'name').exec(function (err, seasons) {
    if (err) {
     ;
 } else {

    // for (var ss in seasons) {
    //     console.log(seasons[ss]);
    // }
}
});

});
// check status realtime;
setInterval(realtime, 1000);
function realtime() {
    var sse = [];
    Season.find({status:{$lt:2},isDeleted: false}).sort('-created').populate('garden', 'name').exec(function (err, seasons) {
        if (err) {
            ;
        } else {
            var ss = seasons;
            for(var i in ss){
              var dateNow = new Date();
              if(ss[i].startDate<=dateNow&&ss[i].endDate>dateNow){
                 ss[i].status = 1;
                 ss[i].save();
             } else if(ss[i].endDate<=dateNow){
                 var season = ss[i];
                 var seadQ = season.seedQuantity
                 season.status = 2;
                 season.quantity = _.random(seadQ/2, seadQ);
                 season.save();
             } 
         }
     }
 });
};

exports.create = function (req, res) {
    var season = new Season(req.body);
    var gardenId = season.garden;
    console.log(gardenId);
    var vegetable = season.vegetable;
    console.log (vegetable)
    season.name = gardenId+"_"+season.name;
    var startDate = Date.parse(season.startDate);
    var endDate =  Date.parse(season.endDate);
    var datediff = endDate-startDate;
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
    season.isAdmin = req.user.roles[0]==='admin'? true:false;
    // season.isAllow = (garden.isCurrentUserOwner|| garden.isAdmin)?true:false;
    var seasonName = season.name.slice(25);
    season.name = seasonName;
    // season.isCurrentUserOwner = req.user && season.user && season.user._id.toString() === req.user._id.toString() ? true : false;
    res.jsonp(season);
};

exports.update = function (req, res) {
    var season = req.season;
    season = _.extend(season, req.body);
    season.isEdited = true;
    season.editDate = new Date();
    var gardenId = season.garden._id;   
    season.name = gardenId+"_"+season.name;
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
    season.isDeleted = true;
    season.deleteDate = new Date();
    console.log(season);
    season.save();
};


exports.list = function (req, res) {
    Season.find({isDeleted: false}).sort('-created').populate('garden', 'name').populate('vegetable', 'name imgUrl').exec(function (err, seasons) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            for(var x in seasons){
               var seasonName = seasons[x].name.slice(25);
               seasons[x].name = seasonName;
               delete  seasons[x].isDeleted;
           }
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

    Season.findById(id).populate('garden', 'name').populate('vegetable','name imgUrl').exec(function (err, season) {
        if (err) {
            return next(err);
        } else if (!season||season.isDeleted) {
            return res.status(404).send({
                message: 'Không tìm thấy mùa vụ'
            });
        }
        req.season = season;
        next();
    });
};
