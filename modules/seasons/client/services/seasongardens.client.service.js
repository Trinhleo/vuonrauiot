
(function () {
  'use strict';

  angular
  .module('seasons')
  .factory('SeasonGardensService',SeasonGardensService);
  SeasonGardensService.$inject = ['$resource'];
  function SeasonGardensService($resource) {
    return $resource('api/gardens/:gardenId', {
      gardenId: '@_id'
    }, {
      update: {
        method: 'PUT '
      }
    });
  };  
})();
