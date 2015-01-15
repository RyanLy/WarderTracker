'use strict';

angular.module('wardTrackerApp')
  .controller('MainCtrl', function ($scope, $http, $filter, $window, $location, $anchorScroll, $timeout) {
    $scope.awesomeThings = [];
    $scope.show = false;
    $scope.current = '';

    $scope.getData = function(){
      var orderBy = $filter('orderBy');
      $http.get('/api/summoners').success(function(data) {
        console.log("SUCCESS");
        $scope.summoners = data;
      });
    }
    $scope.predicate = '-wards';
    $scope.getData();

    $scope.submit = function(){
      $("#inputBox").val('');
      $scope.show = false;
      $http.post('/api/summoners', { name: $scope.query }).success(function(data){
        $scope.show = true;
        $scope.summoner = data[0];
        $scope.wardCount = data[1];
        $scope.getData();
        $scope.current = $scope.summoner.replace(/\s+/g, '').toLowerCase();
      });
    }

    $scope.applyHighlight = function(elem){
      $scope.current = elem;
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  })

;