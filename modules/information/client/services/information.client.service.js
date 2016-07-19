//Information service used to communicate Information REST endpoints
(function () {
  'use strict';

  angular
    .module('information')
    .factory('InformationService', InformationService);

  InformationService.$inject = ['$resource'];

  function InformationService($resource) {
    return $resource('api/information/:informationId', {
      informationId: '@_id'
    }, {
      update: {
        method: 'GET'
      }
    });
  }
})();
