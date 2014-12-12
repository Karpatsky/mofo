(function () {
'use strict';
var module = angular.module('fim.base');
module.controller('MassPayPluginAccountModalController', function(items, $modalInstance, $scope) {
  $scope.items = items;
  
  $scope.items.accountRS = 'FIM-5PGB-BFNZ-KCSF-9XJWB';
  $scope.items.secretPhrase = 'embarrass thorn anywhere beside myself dawn sorrow hurl painful witch lesson torture';

  $scope.close = function () {
    $modalInstance.close($scope.items);
  };

  $scope.dismiss = function () {
    $modalInstance.dismiss();
  };
})
})();