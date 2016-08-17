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
  //   type: String,

  // },
  // garden: {
  //   type: Schema.ObjectId,
  //   ref: 'Dbseasongardens'
  // },
  // season: {
  //   type: Schema.OblectId,
  //   ref: 'Dbseason'
  // }
 });

 mongoose.model('Information', InformationSchema,'seasons');
