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
 var DbSeasonSchema = new Schema({
   name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên mùa vụ',
    trim: true
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
    ref: 'seasongardens'
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
    type: String,
    trim: true
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
  }
}
});
 var DbGardenSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên vườn',
    trim: true,
    unique: 'Tên vườn Đã tồn tại'
  },
  address: {
    type: String,
    default: '',
    required: 'Hãy nhập địa chỉ vườn',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  imgUrl: {
    type: String,
    default: 'modules/gardens/client/img/gardens/no-images.png'
  },
  vegetableList: {
    type: Array,
    items: {
      type: Object,
      properties: {
        "name": {
          type: String
        },
        "quantity": {
          type: Number,
          default: 0,
          min: 0
        }
      }
    }
  }
});
 mongoose.model('Dbseasongardens',
  DbGardenSchema,
  'gardens');
 mongoose.model('Dbseason', DbSeasonSchema,'seasons'); 
 mongoose.model('Information', InformationSchema,'seasons');
