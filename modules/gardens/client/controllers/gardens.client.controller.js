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
    vm.vegetableCategoryObj = [
    {"name":"Cải bắp",
    "quantity":0},
    {"name":"Cải ngọt",
    "quantity":0},
    {"name":"Cà rốt",
    "quantity":0},
    {"name":"Khoai tây",
    "quantity":0},
    {"name":"Xà lách",
    "quantity":0}
    ];
    vm.quantityShow = function (item){
     var idx = _.values(vm.selected).indexOf(name);
     return vm.quantity[idx];
   }
   vm.quantityUpdate= function(quantity,name){
    var idx = _.values(vm.selected).indexOf(name);
    vm.quantity[idx]= quantity;
      // vm.vegetableCategoryObj[idx]=quantity;

    }
    vm.vegetableCategory = [
    "Cải bắp","Cải ngọt","Cà rốt","Khoai tây","Xà lách"
    ];

    if (vm.garden._id){
      vm.vegetableCategoryObj = vm.garden.vegetableList;
      vm.garden.vegetableList = garden.vegetableList;
      vm.selected = [];
      vm.quantity = [];
      for(var i=0;i<vm.garden.vegetableList.length;i++){
       vm.selected.push(vm.garden.vegetableList[i].name);
       vm.quantity.push(vm.garden.vegetableList[i].quantity);
     }
   } else
   {
    vm.garden.vegetableList=[];
    vm.selected = [];
    vm.quantity = [];
  }

  vm.toggle = function (item, list1,list2) {
    var idx = _.values(list1).indexOf(item.name);
    if (idx > -1) {
      list1.splice(idx, 1);
      list2.splice(idx, 1);
    }
    else {
      list1.push(item.name);
      list2.push(item.quantity);
    }
  };
  vm.exists = function (item, list) {
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
      // console.log(vm.selected.length);
      var temp=[];
      for(var i=0;i<vm.selected.length;i++){
        temp.push({name:vm.selected[i],quantity:vm.quantity[i]});
      }
      vm.garden.vegetableList = temp;
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
