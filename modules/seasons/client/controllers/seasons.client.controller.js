(function () {
    'use strict';

    // Seasons controller
    angular
    .module('seasons')
    .controller('SeasonsController', SeasonsController);

    SeasonsController.$inject = ['$scope', '$state', '$timeout', '$q', 'Authentication', 'seasonResolve', 'SeasonGardensService'];

    function SeasonsController($scope, $state,$timeout, $q, Authentication, season, SeasonGardensService) {
        var vm = this;
        vm.authentication = Authentication;
        vm.season = season;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        var vm = this;
        vm.authentication = Authentication;
        vm.gardenId = $state.params.gardenId;
        if(!vm.season._id){
            SeasonGardensService.get({
              gardenId: $state.params.gardenId
          },function (data) {
            vm.garden = data;
            vm.season.garden = vm.garden;
            // vm.repos = vm.loadAll();
    }).$promise
        } 
        vm.goBack = function (){
            $state.go($state.previous.state.name);
        }
        // vm.loadAll = function () {
        //     var repos = (vm.garden.vegetableList) ? vm.garden.vegetableList : [];
        //     return repos.map(function (repo) {
        //         repo.value = repo.name.toLowerCase();
        //         return repo;
        //     });
        // }
        vm.simulateQuery = false;
        vm.querySearch = function (query) {
            var results = query ? vm.garden.vegetableList.filter(vm.createFilterFor(query)) : vm.garden.vegetableList,
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

        /**
         * Create filter function for a query string
         */
         vm.createFilterFor = function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }


        /**
         * Create filter function for a query string
         */
         vm.createFilterFor = function (query) {
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
