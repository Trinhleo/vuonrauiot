'use strict';

/**
 * Module dependencies
 */
var vegetablecatsPolicy = require('../policies/vegetablecats.server.policy'),
  vegetablecats = require('../controllers/vegetablecats.server.controller');

module.exports = function(app) {
  // Vegetablecats Routes
  app.route('/api/vegetablecats').all(vegetablecatsPolicy.isAllowed)
    .get(vegetablecats.list)
    .post(vegetablecats.create);

  app.route('/api/vegetablecats/:vegetablecatId').all(vegetablecatsPolicy.isAllowed)
    .get(vegetablecats.read)
    .put(vegetablecats.update)
    .delete(vegetablecats.delete);

  // Finish by binding the Vegetablecat middleware
  app.param('vegetablecatId', vegetablecats.vegetablecatByID);
};
