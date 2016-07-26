(function () {
  'use strict';

  // Gardens controller
  angular
  .module('gardens')
  .controller('GardensController', GardensController);
  GardensController.$inject = ['$scope', '$state', 'Authentication', 'gardenResolve'];

  function GardensController ($scope, $state, Authentication, garden) {
    var vm = this;
    vm.authentication = Authentication;
    vm.garden = garden;
    vm.garden.vegetableList = garden.vegetableList
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // vegetable choose
    vm.vegetableCategory = [
   "Cải bắp","Cải ngọt","Cà rốt","Khoai tây","Xà lách"
    ];
    vm.selected = vm.garden._id?_.values(vm.garden.vegetableList): [] ;
    vm.toggle = function (item, list) {
      var idx = _.values(list).indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };
    vm.exists = function (item, list) {
     console.log(list);
     return _.values(list).indexOf(item) > -1; 
   };

   vm.isIndeterminate = function() {
    return (vm.selected.length !== 0 &&
      vm.selected.length !== vm.vegetableCategory.length);
  };
  vm.isChecked = function() {
    return vm.selected.length === vm.vegetableCategory.length;
  };
  vm.toggleAll = function() {
    if (vm.selected.length === vm.vegetableCategory.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      vm.selected = vm.vegetableCategory.slice(0);
    }
  };
    // Remove existing Garden
    function remove() {
      if (confirm('Bạn có thực sự muốn xóa vườn không?')) {
        vm.garden.$remove($state.go('gardens.list'));
      }
    }

    // Save Garden
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gardenForm');
        return false;
      }
      vm.garden.vegetableList = vm.selected;
      // TODO: move create/update logic to service
      if (vm.garden._id) {
        vm.garden.$update(successCallback, errorCallback);
      } else {
        vm.garden.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('gardens.view', {
          gardenId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
