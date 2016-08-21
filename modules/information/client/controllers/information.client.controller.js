(function () {
    'use strict';

        // Information controller
        angular
        .module('information')
        .controller('InformationController', InformationController);

        InformationController.$inject = ['$scope','$filter', '$state', 'Authentication', 'informationResolve'];

        function InformationController($scope,$filter, $state, Authentication, information) {
            var vm = this;

            vm.authentication = Authentication;
            vm.information = information.info;
            vm.error = null;
            vm.form = {};
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
          if(vm.information){
            vm.buildPager();
        }

    }
}
)();
