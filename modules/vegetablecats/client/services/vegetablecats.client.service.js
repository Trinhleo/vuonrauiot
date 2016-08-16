//Vegetablecats service used to communicate Vegetablecats REST endpoints
(function () {
  'use strict';

  angular
    .module('vegetablecats')
    .factory('VegetablecatsService', VegetablecatsService);

  VegetablecatsService.$inject = ['$resource'];

  function VegetablecatsService($resource) {
    return $resource('api/vegetablecats/:vegetablecatId', {
      vegetablecatId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
