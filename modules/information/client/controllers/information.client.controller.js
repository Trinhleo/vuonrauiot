(function () {
        'use strict';

        // Information controller
        angular
            .module('information')
            .controller('InformationController', InformationController);

        InformationController.$inject = ['$scope', '$state', 'Authentication', 'informationResolve'];

        function InformationController($scope, $state, Authentication, information) {
            var vm = this;

            vm.authentication = Authentication;
            vm.information = information;
            vm.error = null;
            vm.form = {};
//            vm.remove = remove;
 //            vm.save = save;

            // Remove existing Information
            //        function remove() {
            //            if (confirm('Are you sure you want to delete?')) {
            //                vm.information.$remove($state.go('information.list'));
            //            }
            //        }

            //        // Save Information
            //        function save(isValid) {
            //            if (!isValid) {
            //                $scope.$broadcast('show-errors-check-validity', 'vm.form.informationForm');
            //                return false;
            //            }

            // // TODO: move create/update logic to service
            // if (vm.information._id) {
            //   vm.information.$update(successCallback, errorCallback);
            // } else {
            //   vm.information.$save(successCallback, errorCallback);
            // }

            function successCallback(res) {
                $state.go('information.view', {
                    informationId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
)();
