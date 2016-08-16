(function () {
  'use strict';

  angular
    .module('vegetablecats')
    .controller('VegetablecatsListController', VegetablecatsListController);

  VegetablecatsListController.$inject = ['VegetablecatsService'];

  function VegetablecatsListController(VegetablecatsService) {
    var vm = this;

    vm.vegetablecats = VegetablecatsService.query();
  }
})();
