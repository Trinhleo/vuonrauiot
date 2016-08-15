'use strict';

var path = require('path'),
mongoose = require('mongoose'),
Season = mongoose.model('Season'),
Seasongardens = mongoose.model('seasongardens'),
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
setInterval(myTimer, 1000);
function myTimer() {
    Season.find().sort('-created').populate('garden', 'name').exec(function (err, seasons) {
        if (err) {
            ;
        } else {
            var ss = seasons;
            for(var i in ss){
                var dateNow = new Date();
                if(ss[i].endDate<=dateNow){
                   var season = ss[i];
                   season.status = 2;
                   season.save();
               }
           }
       }
   });
};
var checkName = function (gardenId,name){
  var rs = true;
  Season.find({garden:gardenId}).sort('-created').exec(function (err, seasons) {
    if (err) {
        ;
    } else {
        for (var x in seasons) {
            if(seasons[x].name === name){
                return rs = false;
            }
              // console.log(rs);
          }
      }

  });

  return rs;
};
exports.create = function (req, res) {
    var season = new Season(req.body);
    var gardenId = season.garden;
    // Seasongardens.findById(gardenId).exec(function (err, garden) {
    //     if (err) {
    //         return next(err);
    //     } else if (!garden) {
    //         return res.status(404).send({
    //             message: 'Vườn không tồn tại'
    //         });
    //     }
    //     var user = garden.user;
    //     season.user = user;
    //     console.log(season.user);
    // });
    if(checkName(gardenId,season.name)){
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
    } else {
        res.status(500).send({
            message: 'Tên mùa vụ bị trùng'
        });
    }
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
