(function () {
'use strict';
var module = angular.module('fim.base');
module.factory('TradesProvider', function (nxt, $q, IndexedEntityProvider) {
  
  function TradesProvider(api, $scope, pageSize, asset, decimals) {
    this.init(api, $scope, pageSize);
    this.asset = asset;
    this.decimals = decimals;

    api.engine.socket().subscribe('addedTrades*'+asset, angular.bind(this, this.addedTrades), $scope);
    api.engine.socket().subscribe('blockPoppedNew', angular.bind(this, this.blockPopped), $scope);
    api.engine.socket().subscribe('blockPushedNew', angular.bind(this, this.blockPushed), $scope);
  }
  angular.extend(TradesProvider.prototype, IndexedEntityProvider.prototype, {

    /* @override */
    sortFunction: IndexedEntityProvider.prototype.transactionSort,

    /* @override */
    uniqueKey: function (trade) { return trade.id; },

    getData: function (firstIndex) {
      var deferred = $q.defer();
      var args = {
        asset:          this.asset,
        firstIndex:     firstIndex,
        lastIndex:      firstIndex + this.pageSize
      }
      this.api.engine.socket().getAssetTrades(args).then(deferred.resolve, deferred.reject);
      return deferred.promise;
    },

    translate: function (trade) {
      trade.quantity = nxt.util.convertToQNTf(trade.quantityQNT, this.decimals);
      trade.price    = nxt.util.calculateOrderPricePerWholeQNT(trade.priceNQT, this.decimals);
      trade.total    = nxt.util.convertToNXT(nxt.util.calculateOrderTotalNQT(trade.priceNQT, trade.quantityQNT));
      trade.date     = nxt.util.formatTimestamp(trade.timestamp, true);
    },

    dataIterator: function (data) {
      for (var i=0; i<data.trades.length; i++) {
        this.translate(data.trades[i]);
      }
      return new Iterator(data.trades);
    },

    getTypeColor: function (type) {
      return type == 'buy' ? 'green' : 'red';
    },

    addedTrades: function (trades) {
      var self = this;
      this.$scope.$evalAsync(function () {
        for (var i=0; i<trades.length; i++) {
          self.add(trades[i]);
        }
      });
    },

    blockPushed: function (block) {
      var self = this;
      this.$scope.$evalAsync(function () {
        self.forEach(function (trade) {
          trade.confirmations = block.height - trade.height;
        });
      });
    },

    blockPopped: function (block) {
      var self = this;
      this.$scope.$evalAsync(function () {
        self.forEach(function (trade) {
          trade.confirmations = block.height - trade.height;
        });
        self.filter(function (trade) {
          return trade.height < block.height;
        })
      });
    },

    calculate24HChange: function () {

    },
  });
  return TradesProvider;
});
})();