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
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
   
    // vegetable choose
   //  vm.quantityShow = function (item){
   //   var idx = _.values(vm.selected).indexOf(name);
   //   return vm.quantity[idx];
   // }
   // vm.quantityUpdate= function(quantity,name){
   //  var idx =vm.selected.indexOf(name);
   //  vm.quantity[idx]= quantity;
   //    // vm.vegetableCategoryObj[idx]=quantity;
   //
   //  }
   vm.createSeason = function () {
    $state.go('seasons.create',{gardenId:vm.garden._id});
   }
    vm.vegetableCategory = [
    "Cải bắp","Cải ngọt","Cà rốt","Khoai tây","Xà lách"
    ];

    if (vm.garden._id){
      vm.garden.vegetableList = garden.vegetableList;
      vm.selected = vm.garden.vegetableList;
   } else
   {
    // vm.garden.vegetableList=[];
    vm.selected = [];
  }

  vm.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
  };
  vm.exists = function (item, list) {
   return list.indexOf(item) > -1;
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
      // console.log(vm.selected.length);
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
        var err = res.data.message;
        var l = err.length;
        vm.error = err.substr(length-12,12);
      }
    }
  }
})();
