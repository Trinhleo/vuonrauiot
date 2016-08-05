'use strict';

/**
 * Module dependencies
 */
var seasonsPolicy = require('../policies/seasons.server.policy'),
  seasons = require('../controllers/seasons.server.controller');

module.exports = function(app) {
  // Seasons Routes
  app.route('/api/seasons').all(seasonsPolicy.isAllowed)
    .get(seasons.list)
    .post(seasons.create);

  app.route('/api/seasons/:seasonId').all(seasonsPolicy.isAllowed)
    .get(seasons.read)
    .put(seasons.update)
    .delete(seasons.delete);

  // Finish by binding the Season middleware
  app.param('seasonId', seasons.seasonByID);
};
