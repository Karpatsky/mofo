(function () {
'use strict';
var module = angular.module('fim.base');
module.factory('assetsService', function ($modal, $q) {

  return {
    getAllAssets: function ($scope, observer) {
      var api_list = [nxt.nxt(), nxt.fim()];
      var deferred = $q.defer();
      var assets = [];
      var count = 0;
      for (var i=0; i<api_list.length; i++) {
        var api = api_list[i];
        api.engine.db.assets.toArray().then(
          function (_assets) {
            assets = assets.concat(_assets);
            count++;
            if (count == api_list.length) {
              deferred.resolve(assets);
            }
          }
        );
      }
      return deferred.promise;
    },

    addObserver: function ($scope, observer) {
      engine.db.transactions.addObserver($scope, observer);
    }

  }

});
})();