(function () {
  'use strict';

  // Vegetablecats controller
  angular
    .module('vegetablecats')
    .controller('VegetablecatsController', VegetablecatsController);

  VegetablecatsController.$inject = ['$scope', '$state', 'Authentication', 'vegetablecatResolve'];

  function VegetablecatsController ($scope, $state, Authentication, vegetablecat) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vegetablecat = vegetablecat;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Vegetablecat
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.vegetablecat.$remove($state.go('vegetablecats.list'));
      }
    }

    // Save Vegetablecat
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vegetablecatForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vegetablecat._id) {
        vm.vegetablecat.$update(successCallback, errorCallback);
      } else {
        vm.vegetablecat.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vegetablecats.view', {
          vegetablecatId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
