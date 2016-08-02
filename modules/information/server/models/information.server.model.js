'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Information Schema
 */
 var InformationSchema = new Schema({
  // name: {
  //   "$ref" : 'Gardens'
  // },
  // created: {
  //   type: Date,
  //   default: Date.now
  // }
  // },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});
  
 mongoose.model('Information', InformationSchema);
