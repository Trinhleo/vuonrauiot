(function () {
  'use strict';

  angular
    .module('gardens')
    .controller('GardensListController', GardensListController);

  GardensListController.$inject = ['GardensService','$filter'];

  function GardensListController(GardensService,$filter) {
    var vm = this;
   GardensService.query(function (data) {
			vm.gardens = data;
			vm.buildPager();
		});
		vm.buildPager = function () {
			vm.pagedItems = [];
			vm.itemsPerPage = 5;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		};
		vm.figureOutItemsToDisplay = function () {
			vm.filteredItems = $filter('filter')(vm.gardens, {
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
