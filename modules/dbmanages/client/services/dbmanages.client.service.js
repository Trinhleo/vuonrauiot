//Dbmanages service used to communicate Dbmanages REST endpoints
(function () {
  'use strict';

  angular
  .module('dbmanages')
  .factory('DbmanagesService', DbmanagesService);
  DbmanagesService.$inject = ['$resource'];
  function DbmanagesService($resource) {
    return $resource('api/dbmanages/:dbmanageId', {
      dbmanageId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  };
})();
