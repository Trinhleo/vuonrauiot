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
  name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên mùa vụ',
    trim: true,
    unique: 'Đã tồn tại'
  },
  created: {
    type: Date,
    default: Date.now
  },
  garden : [{ type: Schema.Types.ObjectId, ref: 'Dbgardens' }],
  infomationList: {
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
 var GardenSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Hãy nhập tên vườn',
    trim: true,
    unique: 'Tên vườn Đã tồn tại'
  },
  address: {
    type: String,
    default:'',
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
 mongoose.model('Dbgardens', 
  GardenSchema, 
  'gardens');  
 mongoose.model('Dbmanage', DbmanageSchema);
