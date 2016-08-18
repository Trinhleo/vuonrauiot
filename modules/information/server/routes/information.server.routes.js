'use strict';

/**
 * Module dependencies
 */
var informationPolicy = require('../policies/information.server.policy'),
  information = require('../controllers/information.server.controller');

module.exports = function(app) {
  // Information Routes
  app.route('/api/information').all(informationPolicy.isAllowed)
    .get(information.list)
    // .post(information.create);

  app.route('/api/information/:informationId').all(informationPolicy.isAllowed)
    .get(information.read)
    // .put(information.update)
    // .delete(information.delete);

  // Finish by binding the Information middleware
  app.param('informationId', information.informationByID);
};
