(function () {
'use strict';
var module = angular.module('fim.base');
module.controller('StartupStatusPlugin', function($scope, plugins) {
  var PLUGIN = plugins.get('startup');
  
  $scope.showDialog = function () {
    PLUGIN.showModal();
  }

  $scope.show = function () {
    return !PLUGIN.modalIsOpen() && !PLUGIN.complete;
  }

});
})();