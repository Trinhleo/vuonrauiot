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
  status: {
    type: Number,
    default: 0
  },
  products: {
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
