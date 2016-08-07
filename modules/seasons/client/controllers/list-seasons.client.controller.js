(function () {
	'use strict';

	angular
	.module('seasons')
	.controller('SeasonsListController', SeasonsListController);

	SeasonsListController.$inject = ['SeasonsService','$filter','$state'];

	function SeasonsListController(SeasonsService,$filter,$state) {
		var vm = this;
		vm.gotoView = function(seasonId){
			$state.go('seasons.view', {
				seasonId: seasonId
			})};
			SeasonsService.query(function (data) {
				vm.seasons = data;
				vm.buildPager();
			});
			vm.buildPager = function () {
				vm.pagedItems = [];
				vm.itemsPerPage = 5;
				vm.currentPage = 1;
				vm.figureOutItemsToDisplay();
			};
			vm.figureOutItemsToDisplay = function () {
				vm.filteredItems = $filter('filter')(vm.seasons, {
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
