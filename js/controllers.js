var summonerWards = angular.module('summonerWards', []);

summonerWards.controller('summonerWardsCtrl', function($scope, $http, $filter) {
	$scope.getData = function(){
		var orderBy = $filter('orderBy');
		$http.get('summoners.json').success(function(data) {
			console.log("SUCCESS")
		$scope.summoners = data;
		});
	}
	$scope.predicate = '-wards';
	$scope.getData()

	setInterval($scope.getData, 60000);
});

