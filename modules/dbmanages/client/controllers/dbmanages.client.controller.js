(function () {
    'use strict';

    // Dbmanages controller
    angular
        .module('dbmanages')
        .controller('DbmanagesController', DbmanagesController);

    DbmanagesController.$inject = ['$scope', '$state', 'Authentication', 'dbmanageResolve', 'DbgardensService', '$timeout', '$q', '$log'];

    function DbmanagesController($scope, $state, Authentication, dbmanage, DbgardensService, $timeout, $q) {
        var vm = this;
        vm.authentication = Authentication;
        vm.dbmanage = dbmanage;
        DbgardensService.query(function (data) {
            vm.gardens = data;
            vm.repos = vm.loadAll();
        });
        vm.loadAll = function () {
            var repos = (vm.gardens) ? vm.gardens : [];
            return repos.map(function (repo) {
                repo.value = repo.name.toLowerCase();
                return repo;
            });
        }
        vm.simulateQuery = true;
        vm.querySearch = function (query) {
            var results = query ? vm.repos.filter(vm.createFilterFor(query)) : vm.repos,
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

        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        // Remove existing Dbmanage
        function remove() {
            if (confirm('Bạn có muốn xóa hay không?')) {
                vm.dbmanage.$remove($state.go('dbmanages.list'));
            }
        }
        // Save Dbmanage
        // vm.check = function (){
        //     return vm.dbmanage._id?false:true;
        // }
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.dbmanageForm');
                return false;
            }
            // vm.dbmanage.garden = vm.form.dbmanageForm.garden;
            // TODO: move create/update logic to service
            if (vm.dbmanage._id) {
                vm.dbmanage.$update(successCallback, errorCallback);
            } else {
                vm.dbmanage.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('dbmanages.view', {
                    dbmanageId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
})();
