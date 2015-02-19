(function () {
'use strict';
var module = angular.module('fim.base');
module.controller('FimEngineStatusPlugin', function($scope, serverService, nxt, requests, $interval) {

  /* Only run when in NodeJS environment */
  if ( ! isNodeJS) {
    return;
  }

  var DOWNLOADING_THRESHOLD = 60 * 60 * 1000; // 1 hour in MS
  var api           = nxt.fim();
  var id            = 'TYPE_FIM';
  var genesis_stamp = (new Date(Date.UTC(2014, 1, 7, 12, 23, 29, 5))).getTime();
  var fim_diff      = genesis_stamp - (new Date(Date.UTC(2013, 10, 24, 12, 0, 0, 0))).getTime();

  $scope.server_running = serverService.isRunning(id);
  $scope.port           = api.engine.port,
  $scope.net_name       = api.test?'test-net':'main-net';
  $scope.test_net       = api.test;
  $scope.version        = 0;  
  $scope.blockheight    = 0;
  $scope.progress       = 0; /* 0 - 100 */
  $scope.downloading    = false;

  function getState() {
    var interval = $interval(function () {
      api.engine.getLocalHostNode().then(function (node) {
        var podium = requests.theater.createPodium('fim:status', $scope);
        api.getState({}, {
          podium: podium,
          priority: 10,
          node: node
        }).then(function (data) {
          $interval.cancel(interval);
          $scope.$evalAsync(function () {
            $scope.version = data.version
          })
        });
      });
    },5000,0,false);
  }

  function setCurrentBlock(block) {
    $scope.$evalAsync(function () {
      var now            = Date.now();
      var total          = now - genesis_stamp; // the total time from genesis to now
      var date           = nxt.util.timestampToDate(block.timestamp);
      $scope.blockheight = block.height;

      var elapsed        = date.getTime()-genesis_stamp; // elapsed time from genesis to block
      $scope.progress    = (elapsed * 100) / total;
      $scope.downloading = (now - date.getTime()) > DOWNLOADING_THRESHOLD;
    });
  }

  api.engine.socket().subscribe('blockPopped', setCurrentBlock, $scope);
  api.engine.socket().subscribe('blockPushed', setCurrentBlock, $scope);

  function onExit() {
    $scope.$evalAsync(function () {
      $scope.server_running = false;
      $scope.downloading    = false;
    });
  }

  function onStart() {
    getState();
    $scope.$evalAsync(function () {
      $scope.server_running = true;
    });
  }

  serverService.addListener(id, 'exit', onExit);
  serverService.addListener(id, 'start', onStart);

  $scope.$on("$destroy", function() { 
    serverService.removeListener(id, 'exit', onExit);
    serverService.removeListener(id, 'start', onStart);
  });

});
})();