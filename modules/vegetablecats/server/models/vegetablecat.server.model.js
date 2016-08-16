'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vegetablecat Schema
 */
var VegetablecatSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên đối tượng',
    trim: true,
    unique: "Đã tồn tại"
  },
  created: {
    type: Date,
    default: Date.now
  },
  imgUrl: {
    type: String,
    default: 'modules/gardens/client/img/gardens/no-images.png'
  }
});

mongoose.model('Vegetablecat', VegetablecatSchema);
