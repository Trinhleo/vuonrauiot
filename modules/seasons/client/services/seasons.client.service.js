//Seasons service used to communicate Seasons REST endpoints
(function () {
  'use strict';

  angular
    .module('seasons')
    .factory('SeasonsService', SeasonsService);

  SeasonsService.$inject = ['$resource'];

  function SeasonsService($resource) {
    return $resource('api/seasons/:seasonId', {
      seasonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
