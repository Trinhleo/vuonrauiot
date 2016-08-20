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
  vegetable: {
    type: Schema.ObjectId,
    ref : 'Vegetablecat'
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
  }},
  quantity: {
    type: Number,
    default: 0
  },
  isDeleted : {
    type: Boolean,
    default: false
  },
  deleteDate : {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default : false
  },
  editDate: {
    type : Date
  }
});
 mongoose.model('Season', SeasonSchema);
