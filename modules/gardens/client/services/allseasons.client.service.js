(function () {
  'use strict';

  angular
    .module('gardens')
    .factory('AllseasonsService', AllseasonsService);

  AllseasonsService.$inject = ['$resource'];

  function AllseasonsService($resource) {
    return $resource('api/seasons/:seasonId', {
      seasonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
