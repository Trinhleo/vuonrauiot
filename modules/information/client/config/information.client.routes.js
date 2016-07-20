(function () {
  'use strict';

  angular
    .module('information')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('information', {
        abstract: true,
        url: '/information',
        template: '<ui-view/>'
      })
      .state('information.list', {
        url: '',
        templateUrl: 'modules/information/client/views/list-information.client.view.html',
        controller: 'InformationListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Information List'
        }
      })
      // .state('information.create', {
      //   url: '/create',
      //   templateUrl: 'modules/information/client/views/form-information.client.view.html',
      //   controller: 'InformationController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     informationResolve: newInformation
      //   },
      //   data: {
      //     roles: ['user', 'admin'],
      //     pageTitle : 'Information Create'
      //   }
      // })
      // .state('information.edit', {
      //   url: '/:informationId/edit',
      //   templateUrl: 'modules/information/client/views/form-information.client.view.html',
      //   controller: 'InformationController',
      //   controllerAs: 'vm',
      //   resolve: {
      //     informationResolve: getInformation
      //   },
      //   data: {
      //     roles: ['user', 'admin'],
      //     pageTitle: 'Edit Information {{ informationResolve.name }}'
      //   }
      // })
      .state('information.view', {
        url: '/:informationId',
        templateUrl: 'modules/information/client/views/view-information.client.view.html',
        controller: 'InformationController',
        controllerAs: 'vm',
        resolve: {
          informationResolve: getInformation
        },
        data:{
          pageTitle: 'Information {{ articleResolve.name }}'
        }
      });
  }

  getInformation.$inject = ['$stateParams', 'InformationService'];

  function getInformation($stateParams, InformationService) {
    return InformationService.get({
      informationId: $stateParams.informationId
    }).$promise;
  }

  newInformation.$inject = ['InformationService'];

  function newInformation(InformationService) {
    return new InformationService();
  }
})();
