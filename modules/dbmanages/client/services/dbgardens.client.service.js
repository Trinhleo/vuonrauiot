//Dbmanages service used to communicate Dbmanages REST endpoints
(function () {
  'use strict';

  angular
  .module('dbmanages')
  .factory('DbgardensService',DbgardensService);
  DbgardensService.$inject = ['$resource'];
  function DbgardensService($resource) {
    return $resource('api/gardens/:dbgardenId', {
      dbgardenId: '@_id'
    }, {
      update: {
        method: 'PUT '
      }
    });
  };  
})();
