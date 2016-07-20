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
  name: {
    type: String,
    default: '',
    required: 'Please fill Information name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
  // },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Information', InformationSchema);
