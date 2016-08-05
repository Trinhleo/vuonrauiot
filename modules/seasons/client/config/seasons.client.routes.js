(function () {
  'use strict';

  angular
    .module('seasons')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('seasons', {
        abstract: true,
        url: '/seasons',
        template: '<ui-view/>'
      })
      .state('seasons.list', {
        url: '',
        templateUrl: 'modules/seasons/client/views/list-seasons.client.view.html',
        controller: 'SeasonsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Danh sách mùa vụ'
        }
      })
      .state('seasons.create', {
        url: '/create',
        templateUrl: 'modules/seasons/client/views/form-season.client.view.html',
        controller: 'SeasonsController',
        controllerAs: 'vm',
        resolve: {
          seasonResolve: newSeason
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Tạo mùa vụ'
        }
      })
      .state('seasons.edit', {
        url: '/:seasonId/edit',
        templateUrl: 'modules/seasons/client/views/form-season.client.view.html',
        controller: 'SeasonsController',
        controllerAs: 'vm',
        resolve: {
          seasonResolve: getSeason
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Season {{ seasonResolve.name }}'
        }
      })
      .state('seasons.view', {
        url: '/:seasonId',
        templateUrl: 'modules/seasons/client/views/view-season.client.view.html',
        controller: 'SeasonsController',
        controllerAs: 'vm',
        resolve: {
          seasonResolve: getSeason
        },
        data:{
          pageTitle: 'Season {{ articleResolve.name }}'
        }
      });
  }

  getSeason.$inject = ['$stateParams', 'SeasonsService'];

  function getSeason($stateParams, SeasonsService) {
    return SeasonsService.get({
      seasonId: $stateParams.seasonId
    }).$promise;
  }

  newSeason.$inject = ['SeasonsService'];

  function newSeason(SeasonsService) {
    return new SeasonsService();
  }
})();
