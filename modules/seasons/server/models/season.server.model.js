'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;
 var SeasonSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên mùa vụ',
    trim: true,
    unique: 'Tên mùa vụ bị trùng'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  garden: {
    type: Schema.ObjectId,
    ref: 'Garden'
  },
  imgUrl: {
    type: String,
    default: 'modules/gardens/client/img/gardens/no-images.png'
  },
  status: {
    type: Number,
    default: 0
  },
  vegetableName: {
    type: Array
  },
  startDate : {
    type: Date
  },
  endDate : {
    type: Date
  },
  seedQuantity: {
    type: Number,
    default: 0,
    max : 10000
  },
  fertilizer1Date : {
    type: Date
  },
  fertilizer2Date : {
    type: Date
  },
  wateringHistory: {
   type: Array,
   items: {
    type: Date
  },
  deleteDate : {
    type: Date
  }
}
});
 mongoose.model('Season', SeasonSchema);
