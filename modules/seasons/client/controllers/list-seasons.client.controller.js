(function () {
  'use strict';

  angular
    .module('seasons')
    .controller('SeasonsListController', SeasonsListController);

  SeasonsListController.$inject = ['SeasonsService'];

  function SeasonsListController(SeasonsService) {
    var vm = this;

    vm.seasons = SeasonsService.query();
  }
})();
