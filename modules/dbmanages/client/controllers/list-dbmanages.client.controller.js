(function () {
	'use strict';

	angular
	.module('dbmanages')
	.controller('DbmanagesListController', DbmanagesListController);

	DbmanagesListController.$inject = ['DbmanagesService','$filter'];

	function DbmanagesListController(DbmanagesService,$filter) {
		var vm = this;
		DbmanagesService.query(function (data) {
			vm.dbgardens = data;
			vm.buildPager2();
		});
		vm.buildPager2 = function () {
			vm.pagedItems2 = [];
			vm.itemsPerPage2 = 5;
			vm.currentPage2 = 1;
			vm.figureOutItemsToDisplay2();
		};
		vm.figureOutItemsToDisplay2 = function () {
			vm.filteredItems2 = $filter('filter')(vm.dbgardens, {
				$: vm.search2
			});
			vm.filterLength2 = vm.filteredItems2.length;
			var begin = ((vm.currentPage2 - 1) * vm.itemsPerPage2);
			var end = begin + vm.itemsPerPage2;
			vm.pagedItems2 = vm.filteredItems2.slice(begin, end);
		};
		vm.pageChanged2 = function () {
			vm.figureOutItemsToDisplay2();
		};
	}
})();
