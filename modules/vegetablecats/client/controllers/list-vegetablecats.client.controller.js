(function () {
  'use strict';

  angular
    .module('vegetablecats')
    .controller('VegetablecatsListController', VegetablecatsListController);

  VegetablecatsListController.$inject = ['VegetablecatsService'];

  function VegetablecatsListController(VegetablecatsService) {
    var vm = this;

    VegetablecatsService.query(function (data) {
			vm.vegetablecats = data;
			vm.buildPager();
		});
		vm.buildPager = function () {
			vm.pagedItems = [];
			vm.itemsPerPage = 5;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		};
		vm.figureOutItemsToDisplay = function () {
			vm.filteredItems = $filter('filter')(vm.vegetablecats, {
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
