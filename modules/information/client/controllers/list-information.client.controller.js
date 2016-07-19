(function () {
  'use strict';

  angular
    .module('information')
    .controller('InformationListController', InformationListController);

  InformationListController.$inject = ['InformationService'];
   // var info = this;
  function InformationListController(InformationService) {
    var vm = this;
    vm.information = InformationService.query();
  }
  
})();
