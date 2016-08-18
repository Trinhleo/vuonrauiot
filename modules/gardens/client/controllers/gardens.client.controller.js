(function () {
  'use strict';

  // Gardens controller
  angular
  .module('gardens')
  .controller('GardensController', GardensController);
  GardensController.$inject = ['$scope', '$state', 'Authentication', 'gardenResolve','$http','$filter','VegetableCatService'];

  function GardensController ($scope, $state, Authentication, garden,$http,$filter,VegetableCatService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.garden = garden?garden:[];
    vm.gardenSeasons = vm.garden.seasons;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.createSeason = createSeason;
    vm.gotoView = function(seasonId){
      $state.go('seasons.view', {
        seasonId: seasonId
      })};
      vm.buildPager = function () {
        vm.pagedItems = [];
        vm.itemsPerPage = 5;
        vm.currentPage = 1;
        vm.figureOutItemsToDisplay();
      };
      vm.figureOutItemsToDisplay = function () {
        vm.filteredItems = $filter('filter')(vm.gardenSeasons, {
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
      // pagination for garden
      vm.buildPager2 = function () {
        vm.pagedItems2 = [];
        vm.itemsPerPage2 = 5;
        vm.currentPage2 = 1;
        vm.figureOutItemsToDisplay2();
      };
      vm.figureOutItemsToDisplay2 = function () {
        vm.filteredItems2 = $filter('filter')(vm.garden.vegetableList, {
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
      if(vm.garden._id){
        vm.buildPager2();
      }
      if(vm.garden._id){
        vm.buildPager();
      }
      function createSeason() {
        $state.go('seasons.create',{gardenId:vm.garden._id});
      }

      VegetableCatService.query(function (data) {
        vm.vegetable = data?data:[];
        vm.vegetableCategory= [];
        for(var x=0;x <  vm.vegetable.length;x++){
         vm.vegetableCategory.push(vm.vegetable[x].name);
       }
       vm.contentLoad =vm.vegetableCategory?true:false;
     });
      if (vm.garden._id){
        vm.garden.vegetableList = garden.vegetableList;
        vm.selected = vm.garden.vegetableList;
        vm.selectedName = [];
        for(var x in vm.selected){
         vm.selectedName.push(vm.selected[x].name);
       }
     } else {
      vm.selectedName = [];
      vm.selected = [];
    }
    vm.toggle = function (item, selectedName,selected) {
      var idx = selectedName.indexOf(item.name);
      if (idx > -1) {
        selectedName.splice(idx, 1);
        selected.splice(idx,1);
      }
      else {
        selectedName.push(item.name);
        selected.push(item)
      }
    };
    vm.exists = function (item, list) {
     return list.indexOf(item) > -1;
   };

   vm.isIndeterminate = function() {
    return (vm.selectedName.length !== 0 &&
      vm.selectedName.length !== vm.vegetableCategory.length);
  };
  vm.isChecked = function() {
    return vm.selectedName.length === vm.vegetableCategory.length;
  }
  vm.toggleAll = function() {
    if (vm.selectedName.length === vm.vegetableCategory.length) {
      vm.selectedName = [];
      vm.selected = [];
    } else if (vm.selectedName.length === 0 || vm.selectedName.length > 0) {
      vm.selectedName = vm.vegetableCategory.slice(0);
      vm.selected = vm.vegetable.slice(0);
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
    vm.approve = function (){
      $http({
        method: 'GET',
        url:'/api/gardens/'+ vm.garden._id+'/approve'}).then(function successCallback(response) {
          $http({
            method: 'GET',
            url:'/api/gardens/'+ vm.garden._id}).then(function successCallback(response) {
              vm.garden = response.data;
            }, function errorCallback(response) {
            });
          }, function errorCallback(response) {
          });
      }
    }
  })();
