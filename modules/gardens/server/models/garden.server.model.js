'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * Garden Schema
 */
 var GardenSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Garden name',
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
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "id": {
          "type": "string"
        }
      },
      "required": [
      "name"
      ]
    }
  }
});

 mongoose.model('Garden', GardenSchema);
