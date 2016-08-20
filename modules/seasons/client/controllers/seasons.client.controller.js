(function () {
    'use strict';

    // Seasons controller
    angular
    .module('seasons')
    .controller('SeasonsController', SeasonsController);

    SeasonsController.$inject = ['$scope', '$state', '$timeout', '$q', 'Authentication', 'seasonResolve', 'SeasonGardensService','$filter'];

    function SeasonsController($scope, $state,$timeout, $q, Authentication, season, SeasonGardensService,$filter) {
        var vm = this;
        vm.authentication = Authentication;
        vm.season = season
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.gardenId = vm.season._id?vm.season._id:$state.params.gardenId?$state.params.gardenId:"";
        vm.contentLoaded = false;
        vm.querySearch = querySearch;
        vm.setSeasonName = setSeasonName;
        if(vm.season.startDate){
            var startDate = new Date(vm.season.startDate);
            vm.season.startDate = startDate;
        }
        if(vm.season.endDate){
            var endDate = new Date(vm.season.endDate);
            vm.season.endDate = endDate;
        }
        if(!vm.season._id){
            $scope.$watch(function() { return vm.season.vegetable },
              function() {
                if(vm.season.vegetable){
                    vm.setSeasonName(vm.season.vegetable);
                }
            }
            );
        }
        function setSeasonName (vegetable) {
         var dateNow = new Date();
         var day =  dateNow.getDate().toString();
         var month = (dateNow.getMonth()+1).toString()
         var year = dateNow.getFullYear().toString();
         var currentDateStr = year+month+day ;
         vm.season.name = vegetable?vegetable.name + " "+currentDateStr : "";
     }

     if($state.params.gardenId){
        SeasonGardensService.get({
          gardenId: vm.gardenId
      },function (data) {
        vm.garden = data;
        vm.season.garden = vm.garden;
        vm.vegetableList = loadAll() ;
        vm.contentLoaded = true ;
    });
    } 
    function loadAll() {
        var vegets = vm.garden.vegetableList?vm.garden.vegetableList:[];
        return vegets.map( function (veget) {
            veget.value = veget.name.toLowerCase();
            return veget;
        });
    }
    vm.buildPager = function () {
        vm.pagedItems = [];
        vm.itemsPerPage = 5;
        vm.currentPage = 1;
        vm.figureOutItemsToDisplay();
    };
    vm.figureOutItemsToDisplay = function () {
        vm.filteredItems = $filter('filter')(vm.season.wateringHistory, {
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
    vm.goBack = function (){
        $state.go($state.previous.state.name);
    }
    if(vm.season._id){
        vm.buildPager();
    }
    vm.simulateQuery = true;
    function querySearch (query) {

        var results = query? vm.vegetableList.filter(createFilterFor(query)):vm.vegetableList?vm.vegetableList:[],
        deferred;
        if (vm.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(results);
            }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }
        // Remove existing Season
        function remove() {
            if (confirm('Bạn có muốn xóa mùa vụ hay không?')) {
                vm.season.$remove($state.go('seasons.list'));
            }
        }

        // Save Season
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.seasonForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.season._id) {
                vm.season.$update(successCallback, errorCallback);
            } else {
                vm.season.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('seasons.view', {
                    seasonId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
})();
