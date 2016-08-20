'use strict';

/**
 * Module dependencies.
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 Information = require('mongoose').model('Season'),
 Dbseasongardens = require('mongoose').model('Garden'),
 Dbvegetable = require('mongoose').model('Vegetablecat'), 
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 _ = require('lodash');

/**
 * Create a Information
 */
// exports.create = function(req, res) {
//   var information = new Information(req.body);
//   information.user = req.user;

//   information.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(information);
//     }
//   });
// };

/**
 * Show the current Information
 */
 exports.read = function(req, res) {
  // convert mongoose document to JSON
  var information = req.list ? req.list : [];
  var list ={};
  list.info = information
  console.log(list);
  // information.isCurrentUserOwner = req.user && information.user && information.user._id.toString() === req.user._id.toString() ? true : false;
  res.jsonp(list);
};

/**
 * Update a Information
 */
// exports.update = function(req, res) {
//   var information = req.information ;

//   information = _.extend(information , req.body);

//   information.save(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(information);
//     }
//   });
// };

/**
 * Delete an Information
 */
// exports.delete = function(req, res) {
//   var information = req.information ;

//   information.remove(function(err) {
//     if (err) {
//       return res.status(400).send({
//         message: errorHandler.getErrorMessage(err)
//       });
//     } else {
//       res.jsonp(information);
//     }
//   });
// };

/**
 * List of Information
 */
 exports.list = function(req, res) { 
  Information.aggregate([ {
    $match: {
      isDeleted: false
    }
  },{
    $group: {
      _id: '$vegetable',
      count: {
        $sum: 1
      }
    }
  }]).exec(function(err, results) {
    console.log(results);
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    Information.populate(results, {path:'name'}, function(err, populatedResults) {
      if(err) {
       return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
     }
     else {
      res.jsonp(populatedResults);
    }
  });
  });
};


// exports.listByGroupId = function(req, res) { 

//  Information.find({_id: id}).sort('-created').populate('Dbseason', 'name').exec(function(err, information) {
//   if (err) {
//     return res.status(400).send({
//       message: errorHandler.getErrorMessage(err)
//     });
//   } else {
//     res.jsonp(information);
//   }
// });
// }
/**
 * Information middleware
 */
 exports.informationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Thông tin không hợp lệ'
    });
  }
  var vegetableId =  mongoose.Types.ObjectId(id);
  console.log(vegetableId);
  Information.find({vegetable:vegetableId}).populate('vegetable','name imgUrl').exec(function (err, information) {
    if (err) {
      return next(err);
    } else if (!information) {
      return res.status(404).send({
        message: 'Không tìm thấy thông tin'
      });
    }
    console.log(information)
      // for(var x in information){
      //   if (information[x].vegetableName.)
      //   information[x]

      // }
      req.list = information;
      next();
    });
};
