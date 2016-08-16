//Gardens service used to communicate Gardens REST endpoints
(function () {
  'use strict';

  angular
    .module('gardens')
    .factory('VegetableCatService', VegetableCatService);

  VegetableCatService.$inject = ['$resource'];

  function VegetableCatService($resource) {
    return $resource('/api/vegetablecats/:vegetablecatId', {
      vegetablecatId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
