'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.isLoged = (Authentication.user==="")?false:true;
    try{
    	$scope.isAdmin = ($scope.authentication.user.roles[0]==="admin")?true:false;
    }catch (err){
    	// console.log(err);
    }
}
]);
