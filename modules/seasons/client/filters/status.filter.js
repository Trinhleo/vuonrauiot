
'use strict';
angular
.module('seasons')
.filter('status', 
	function () {
		return function(input) {
			return input? '\u2713' : '\u2718';
		};
	});