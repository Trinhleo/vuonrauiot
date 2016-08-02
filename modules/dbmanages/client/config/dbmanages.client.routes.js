(function () {
  'use strict';

  angular
    .module('dbmanages')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('dbmanages', {
        abstract: true,
        url: '/dbmanages',
        template: '<ui-view/>'
      })
      .state('dbmanages.list', {
        url: '',
        templateUrl: 'modules/dbmanages/client/views/list-dbmanages.client.view.html',
        controller: 'DbmanagesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Dbmanages List'
        }
      })
      .state('dbmanages.create', {
        url: '/create',
        templateUrl: 'modules/dbmanages/client/views/form-dbmanage.client.view.html',
        controller: 'DbmanagesController',
        controllerAs: 'vm',
        resolve: {
          dbmanageResolve: newDbmanage
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Dbmanages Create'
        }
      })
      .state('dbmanages.edit', {
        url: '/:dbmanageId/edit',
        templateUrl: 'modules/dbmanages/client/views/form-dbmanage.client.view.html',
        controller: 'DbmanagesController',
        controllerAs: 'vm',
        resolve: {
          dbmanageResolve: getDbmanage
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Dbmanage {{ dbmanageResolve.name }}'
        }
      })
      .state('dbmanages.view', {
        url: '/:dbmanageId',
        templateUrl: 'modules/dbmanages/client/views/view-dbmanage.client.view.html',
        controller: 'DbmanagesController',
        controllerAs: 'vm',
        resolve: {
          dbmanageResolve: getDbmanage
        },
        data:{
          pageTitle: 'Dbmanage {{ articleResolve.name }}'
        }
      });
  }

  getDbmanage.$inject = ['$stateParams', 'DbmanagesService'];

  function getDbmanage($stateParams, DbmanagesService) {
    return DbmanagesService.get({
      dbmanageId: $stateParams.dbmanageId
    }).$promise;
  }

  newDbmanage.$inject = ['DbmanagesService'];

  function newDbmanage(DbmanagesService) {
    return new DbmanagesService();
  }
})();
