'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Dbmanage Schema
 */
var DbmanageSchema = new Schema({

});
var GardenSchema = new Schema({
   
});
mongoose.model('Dbgardens',
    GardenSchema,
    'gardens');
mongoose.model('Dbmanage', DbmanageSchema);
