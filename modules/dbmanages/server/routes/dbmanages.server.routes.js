'use strict';

/**
 * Module dependencies
 */
var dbmanagesPolicy = require('../policies/dbmanages.server.policy'),
  dbmanages = require('../controllers/dbmanages.server.controller');

module.exports = function(app) {
  // Dbmanages Routes
  app.route('/api/dbmanages').all(dbmanagesPolicy.isAllowed)
    .get(dbmanages.list)
    .post(dbmanages.create);

  app.route('/api/dbmanages/:dbmanageId').all(dbmanagesPolicy.isAllowed)
    .get(dbmanages.read)
    .put(dbmanages.update)
    .delete(dbmanages.delete);

  // Finish by binding the Dbmanage middleware
  app.param('dbmanageId', dbmanages.dbmanageByID);
};
