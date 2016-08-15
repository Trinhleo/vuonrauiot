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
	vegetableCategory: {
    type: Array,
    items: {
      type: Object,
      properties: {
      	 "id":{
      	 	type: String
      	 },
         "name": {
          type: String
        },
        "imgUrl": {
          type: String,
          default: 'modules/dbmanages/client/img/vegetable/no-images.png'
        }
      }
    }
  }

});
mongoose.model('Dbmanage', DbmanageSchema);
