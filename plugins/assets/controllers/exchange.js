(function () {
'use strict';

function GenericObserver(name, $scope, filter, sort, find, final) {
  this.name   = name;
  this.$scope = $scope;
  this.filter = filter || function () { return true };
  this.sort   = sort || function () { return 0 };
  this.find   = find || function () { return -1 };
  this.final  = final || function () { 
    $scope.$evalAsync(function () { 
      /* runs angular apply now */
    });
  }
}
GenericObserver.prototype = {
  create: function (objects) {
    this.$scope[this.name] = this.$scope[this.name].concat(this.filter(objects));
    this.$scope[this.name].sort(this.sort);    
  },
  update: function (objects) {
    objects = this.filter(objects);
    for (var i=0,l=objects.length; i<l; i++) {
      var index = this.find(this.$scope[this.name], objects[i]);
      if (index != -1) {
        angular.extend(this.$scope[this.name], objects[i]);
      }
    }
  },
  remove: function (objects) { 
    objects = this.filter(objects);
    for (var i=0,l=objects.length; i<l; i++) {
      var index = this.find(this.$scope[this.name], objects[i]);
      if (index != -1) {
        this.$scope[this.name].splice(index, 1);
      }
    }
  },
  finally: function () {
    this.final();
  }
}

function initTrades(podium, api, asset_id, $scope) {
  api.engine.db.trades.where('asset').equals(asset_id).toArray().then(
    function (trades) {
      $scope.$evalAsync(function () {
        $scope.trades = trades;
      });
      api.engine.db.trades.addObserver($scope, createTradesObserver($scope, asset_id));
      downloadTrades(podium, api, asset_id, $scope, 0);
    }
  );
}

function createTradesObserver($scope, asset_id) {
  return new GenericObserver('trades', $scope, 
    function filter(trade) { 
      return trade.asset == asset_id;
    },
    function sort(a,b) {
      if (a.timestamp > b.timestamp)
        return -1;
      else if (a.timestamp < b.timestamp)
        return 1;
      return 0;
    },
    function find(trades, trade) {
      for (var i=0,l=trades.length; i<l; i++) {
        var t = trades[i];
        if (t.timestamp == trade.timestamp && t.askOrder == trade.askOrder && 
            t.bidOrder == trade.bidOrder && t.asset == trade.asset) {
          return i;
        }
      }
      return -1;
    }
  );
}

function downloadTrades(podium, api, asset_id, $scope, index) {
  index = index || 0;
  api.getTrades({
    asset: asset_id,
    lastIndex: index + 100,
    firstIndex: index
  }, {
    podium: podium,
    priority: 2
  }).then(
    function (trades) {
      var iterator = new Iterator(trades);
      processTrade(iterator);
      /** 
       * 
       *
       **/




      for (var i=0,l=trades.length; i<l; i++) {
        if ()


      }





      db.transaction('rw', api.engine.db.trades, function () {
        for(var i=0,l=trades.length; i<l; i++) {
          api.engine.db.trades.put(trades[i]);
        }
      });
      deferred.resolve(trades);
    },
    deferred.reject
  );
}

"++id,timestamp,quantityQNT,priceNQT,asset,askOrder,bidOrder,block";

function processTrade(iterator) {
  var trade = 
}



function initOrders(api, asset_id, $scope) {
  api.engine.db.orders.where('asset').equals(asset_id).toArray().then(
    function (orders) {
      $scope.bids = [];
      $scope.asks = [];
      for (var i=0,l=orders.length; i<l; i++) {
        if (orders[i].type == 'bid') {
          $scope.bids.push(orders[i]);
        }
        else {
          $scope.asks.push(orders[i]);
        }
      }
      $scope.$evalAsync(function () { });
      api.engine.db.orders.addObserver($scope, createBidsObserver($scope, asset_id));
      api.engine.db.orders.addObserver($scope, createAsksObserver($scope, asset_id));
    }
  );
}

function createBidsObserver($scope, asset_id) {
  return new GenericObserver('bids', $scope, 
    function filter(order) { 
      return order.asset == asset_id && order.type == 'bid';
    },
    function sort(a,b) {
      if (a.height > b.height)
        return -1;
      else if (a.height < b.height)
        return 1;
      else {
        if (a.order > b.order)
          return -1;
        else if (a.order < b.order)
          return 1;
      }
      return 0;
    },
    function find(bids, order) {
      for (var i=0,l=bids.length; i<l; i++) {
        var b = bids[i];
        if (b.order == order.order) {
          return i;
        }
      }
      return -1;
    }
  );
}

function createAsksObserver($scope, asset_id) {
  return new GenericObserver('bids', $scope, 
    function filter(order) { 
      return order.asset == asset_id && order.type == 'ask';
    },
    function sort(a,b) {
      if (a.height > b.height)
        return -1;
      else if (a.height < b.height)
        return 1;
      else {
        if (a.order > b.order)
          return -1;
        else if (a.order < b.order)
          return 1;
      }
      return 0;
    },
    function find(asks, order) {
      for (var i=0,l=asks.length; i<l; i++) {
        var a = asks[i];
        if (a.order == order.order) {
          return i;
        }
      }
      return -1;
    }
  );
}






function getEngine($stateParams, nxt) {
  var engine_id = $stateParams.engine;  
  if (engine_id == 'nxt')
    return nxt.nxt();
  else if (engine_id == 'fimk') 
    return nxt.fim();
}

function find(array, id, value) {
  for(var i=0,l=array.length; i<l; i++) { if (array[i][id] == value) { return i; } }
  return -1;
}

/**
 * Called on Controller creation. Loads from database or loads it
 * from the network. End result is you have an asset object.
 *
 * @returns Promise
 */
function loadAsset(podium, $q, $stateParams, nxt) {
  var deferred = $q.defer();
  var api      = getEngine($stateParams, nxt);
  if (!api) {
    deferred.reject();
  }
  else {
    api.engine.db.assets.where('asset').equals($stateParams.asset).first().then(
      function (asset) {
        if (asset) {
          deferred.resolve(asset);
        }
        else {
          api.getAsset({
            asset: asset_id
          }, {
            podium: podium,
            priority: 2
          }).then(
            function (asset) {
              api.engine.db.assets.put(asset).then(
                function () {
                  deferred.resolve(asset);
                }
              ).catch(deferred.reject);
            },
            deferred.reject
          );
        }
      },
      deferred.reject
    );
  }
  return deferred.promise;
}

function getDBTrades($q, $stateParams, nxt) {
  var deferred = $q.defer();
  var api      = getEngine($stateParams, nxt);
  if (!api) {
    deferred.reject();
  }
  else {
    api.engine.db.trades.where('asset').equals($stateParams.asset).toArray().then(
      function (assets) {
        deferred.resolve(assets);
      },
      deferred.reject
    );
  }
  return deferred.promise;
}

function downloadTrades(db, podium, $q, $stateParams, nxt) {
  var deferred = $q.defer();
  var api      = getEngine($stateParams, nxt);
  if (!api) {
    deferred.reject();
  }
  else {
    api.getTrades({
      asset: $stateParams.asset,
      lastIndex: 100
    }, {
      podium: podium,
      priority: 2
    }).then(
      function (trades) {
        db.transaction('rw', api.engine.db.trades, function () {
          for(var i=0,l=trades.length; i<l; i++) {
            api.engine.db.trades.put(trades[i]);
          }
        });
        deferred.resolve(trades);
      },
      deferred.reject
    );  
  }
  return deferred.promise;
}








// function setupTrades() {

//   var observer = {
//     create: function () {}
//   }



//     observer = observer || {
//       create: function (transactions) {
//         $scope.transactions = $scope.transactions.concat(filter(transactions));
//         $scope.transactions.sort(sorter);
//       },
//       update: function (transactions) {
//         angular.forEach(filter(transactions), function (t) {
//           var index = find($scope.transactions, 'transaction', t.transaction);
//           if (index != -1) {
//             angular.extend($scope.transactions[index], t);
//           }
//         });
//       },
//       remove: function (transactions) {
//         angular.forEach(filter(transactions), function (t) {
//           var index = find($scope.transactions, 'transaction', t.transaction);
//           if (index != -1) {
//             $scope.transactions.splice(index, 1);
//           }
//         });
//       },
//       finally: function () { /* called from $timeout */

//         /* Tell all children the transactions array changed */
//         $scope.$broadcast('transaction-length-changed');
//       }
//     };

//     /* Register transactions CRUD observer */
//     engine.db.transactions.addObserver($scope, observer);


// }





var module = angular.module('fim.base');
module.controller('ExchangePluginController', function($scope, $stateParams, nxt, requests) {

  var api = null;
  var podium = requests.theater.createPodium('exchange', $scope);

  $scope.assets = [];
  // $scope.assets = $scope.assets.concat(nxt.nxt().assets.getAll());
  // $scope.assets = $scope.assets.concat(nxt.fim().assets.getAll());

  $scope.selectedAsset = {
    asset: 'avsj38738979837987374hjh4jkh',
    name: 'mgwBTC',
    accountRS: 'NXT-JXRD-GKMR-WD9Y-83CK7',
    description: 'multigateway BTC is backed 100% by deposits in the custom multisig accounts generated for each user. Deposits made to the multisig account will automatically transfer the corresponding amount of BTC assets to the associated NXT account. Withdraws are automatically processed serially only when all multigateway servers are in agreement. The balances in the multisig accounts will change and do not represent the amount of BTC in your account, the BTC assets do. See forum for more details and fee structure. By configuring NXTservices to monitor multigateway, any NXT node will be able to track the current status of all multigateway transactions and balances.',
    decimals: 8,
    quantityQNT: 1000000000,
    numberOfTrades: 100
  };
  $scope.comments = [{
    date: 'a minute ago',
    id_rs: 'NXT-JXRD-GKMR-WD9Y-83CK7',
    name: 'Mark',
    content: 'Bought a lot of it.'
  },{
    date: '2 hours ago',
    id_rs: 'NXT-JXRD-GKMR-WD9Y-83CK7',
    name: 'Migael',
    content: 'Selling 1mil PM me'
  },{
    date: '5 days ago',
    id_rs: 'NXT-MRBN-8DFH-PFMK-A4DBM',
    name: 'Alice',
    content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using "Content here, content here", making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "lorem ipsum" will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
  },{
    date: '7 days ago',
    id_rs: 'NXT-MRBN-8DFH-PFMK-A4DBM',
    name: 'Alice',
    content: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'
  }];
  $scope.buyOrders = [];
  $scope.sellOrders = [];
  $scope.trades = [];

  if ($stateParams.engine) {
    if ($stateParams.engine == 'nxt') {
      api = nxt.nxt();
    }
    else if ($stateParams.engine == 'fimk') {
      api = nxt.fim();
    }
    if (api && $stateParams.asset) {

      api.engine.db.assets.where('asset').equals($stateParams.asset).first().then(
        function (asset) {
          if (asset) {
            initSelectedAsset(asset);
          }
        }
      );

      api.engine.db.trades.where('asset').equals($stateParams.asset).toArray().then(
        function (trades) {

        }
      );

      api.engine.db.orders.where('asset').equals($stateParams.asset).toArray().then(
        function (orders) {

        }
      );
    }
  }

  function initSelectedAsset(asset) {
    $scope.$evalAsync(function () {
      $scope.selectedAsset = asset;
    });
    refresh();
  }

  function refresh() {
    
    api.getTrades({
      asset: $scope.selectedAsset.asset,
      lastIndex: 100
    }, {
      podium: podium,
      priority: 2
    }).then(
      function (trades) {

      }
    );

    api.getAskOrders({
      asset: $scope.selectedAsset.asset,
      limit: 100
    }, {
      podium: podium,
      priority: 2
    }).then(
      function (orders) {

      }
    );

    api.getBidOrders({
      asset: $scope.selectedAsset.asset,
      limit: 100
    }, {
      podium: podium,
      priority: 2
    }).then(
      function (orders) {

      }
    );
  }



});
})();