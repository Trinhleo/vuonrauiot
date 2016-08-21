(function () {
  'use strict';

  angular
  .module('information')
  .controller('InformationListController', InformationListController);

  InformationListController.$inject = ['InformationService','$filter'];
   // var info = this;
   function InformationListController(InformationService,$filter) {
    var vm = this;
    InformationService.query(function (data) {
      vm.information = data;
      vm.buildPager();
      console.log( vm.information);
    });
    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };
    vm.figureOutItemsToDisplay = function () {
      vm.filteredItems = $filter('filter')(vm.information, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    };
    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    };

  }
  
})();
