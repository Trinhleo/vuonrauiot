(function () {
  'use strict';

  angular
    .module('vegetablecats')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vegetablecats', {
        abstract: true,
        url: '/vegetablecats',
        template: '<ui-view/>'
      })
      .state('vegetablecats.list', {
        url: '',
        templateUrl: 'modules/vegetablecats/client/views/list-vegetablecats.client.view.html',
        controller: 'VegetablecatsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vegetablecats List'
        }
      })
      .state('vegetablecats.create', {
        url: '/create',
        templateUrl: 'modules/vegetablecats/client/views/form-vegetablecat.client.view.html',
        controller: 'VegetablecatsController',
        controllerAs: 'vm',
        resolve: {
          vegetablecatResolve: newVegetablecat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vegetablecats Create'
        }
      })
      .state('vegetablecats.edit', {
        url: '/:vegetablecatId/edit',
        templateUrl: 'modules/vegetablecats/client/views/form-vegetablecat.client.view.html',
        controller: 'VegetablecatsController',
        controllerAs: 'vm',
        resolve: {
          vegetablecatResolve: getVegetablecat
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vegetablecat {{ vegetablecatResolve.name }}'
        }
      })
      .state('vegetablecats.view', {
        url: '/:vegetablecatId',
        templateUrl: 'modules/vegetablecats/client/views/view-vegetablecat.client.view.html',
        controller: 'VegetablecatsController',
        controllerAs: 'vm',
        resolve: {
          vegetablecatResolve: getVegetablecat
        },
        data:{
          pageTitle: 'Vegetablecat {{ articleResolve.name }}'
        }
      });
  }

  getVegetablecat.$inject = ['$stateParams', 'VegetablecatsService'];

  function getVegetablecat($stateParams, VegetablecatsService) {
    return VegetablecatsService.get({
      vegetablecatId: $stateParams.vegetablecatId
    }).$promise;
  }

  newVegetablecat.$inject = ['VegetablecatsService'];

  function newVegetablecat(VegetablecatsService) {
    return new VegetablecatsService();
  }
})();
