(function () {
  'use strict';

  // Dbmanages controller
  angular
    .module('dbmanages')
    .controller('DbmanagesController', DbmanagesController);

  DbmanagesController.$inject = ['$scope', '$state', 'Authentication', 'dbmanageResolve'];

  function DbmanagesController ($scope, $state, Authentication, dbmanage) {
    var vm = this;
    vm.authentication = Authentication;
    vm.dbmanage = dbmanage;
    // vm.dbgarden = garden;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Dbmanage
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.dbmanage.$remove($state.go('dbmanages.list'));
      }
    }

    // Save Dbmanage
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dbmanageForm');
        return false;
      }

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
