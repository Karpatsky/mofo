(function () {
'use strict';

function update(src, config) {
  var store = angular.copy(src);
  if (config.update) {
    angular.extend(store, config.update);
  }
  if (config.remove) {
    angular.forEach(config.remove, function (val, id) {
      delete store[id];
    })
  }
  return store;
}

function versions(updates, db) {
  var store = {};
  try {
    angular.forEach(updates, function (config, index) {
      store = update(store, config);
      db.version(index+1).stores(store);
    });
  }
  catch (e) {
    console.log('DB.open.update',e);
  }
}

var module = angular.module('fim.base');
module.factory('db', function ($log, $injector, alerts, $timeout) {
  var db = new Dexie('fimkrypto-db');

  var blockstore        = "height,&id,timestamp,numberOfTransactions,generator,totalAmountNQT,totalFeeNQT";
  var fim_blockstore    = blockstore+',totalPOSRewardNQT';
  var transactionstore  = "transaction,type,subtype,timestamp,recipientRS,senderRS,height,block,isLast";
  var assetsstore       = "asset,name,accountRS,description,decimals,quantityQNT,numberOfTrades";
  var nodes             = "++id,url,port,downloaded,success_timestamp,failed_timestamp,start_timestamp,require_cors_proxy,first_cors,last_cors,last_non_cors";

  versions([{
    update: {
      settings:             "id,label,value",
      accounts:             "id_rs,id,name,balanceNXT,forgedBalanceNXT",
      contacts:             "id_rs,&name,email,website",

      nodes:                nodes,
      fimblocks_test:       fim_blockstore,
      fimblocks:            fim_blockstore,
      nxtblocks_test:       blockstore,
      nxtblocks:            blockstore,

      fimtransactions_test: transactionstore,
      fimtransactions:      transactionstore,
      nxttransactions_test: transactionstore,
      nxttransactions:      transactionstore,

      fimassets_test:       assetsstore,
      fimassets:            assetsstore,
      nxtassets_test:       assetsstore,
      nxtassets:            assetsstore
    }
  }], db);

  /* Load models here to prevent cicrular dependency errors */
  $injector.get('Setting').initialize(db);
  $injector.get('Account').initialize(db);
  $injector.get('Contact').initialize(db);
  $injector.get('Node').initialize(db);

  db.on('error', alerts.catch("Database error - see error console for details"));
  db.on('populate', function () {
    var nodes = {
      /* FIM test net */
      6886: [
        'http://178.62.176.45|CORS',
        'http://178.62.176.46|CORS'
      ],

      /* FIM main net */
      7886: [
        'http://5.101.102.197|CORS',
        'http://5.101.102.199|CORS',
        'http://5.101.102.200|CORS',
        'http://5.101.102.201|CORS',
        'http://5.101.102.202|CORS',
        'http://5.101.102.203|CORS'
      ],

      /* NXT main net */
      7876: [
        /* FIMKrypto nodes */
        'http://178.62.215.224|CORS',
        'http://178.62.217.230|CORS',
        'http://107.170.64.174|CORS',

        'http://allbits.vps.nxtcrypto.org|CORS',
        'http://jefdiesel.vps.nxtcrypto.org',
        'http://vps3.nxtcrypto.org',
        'http://rdanneskjoldr.vps.nxtcrypto.org|CORS',
        'http://xeqtorcreed.vps.nxtcrypto.org',
        'http://abctc.vps.nxtcrypto.org',
        'http://bitsy08.vps.nxtcrypto.org|CORS',
        'http://bitsy09.vps.nxtcrypto.org|CORS',
        'http://bitsy02.vps.nxtcrypto.org|CORS',
        'http://bitsy10.vps.nxtcrypto.org|CORS',
        'http://xeqtorcreed2.vps.nxtcrypto.org',
        'http://lyynx.vps.nxtcrypto.org|CORS',
        'http://samson.vps.nxtcrypto.org',
        'http://bitsy06.vps.nxtcrypto.org|CORS'
      ]
    };
    angular.forEach(nodes, function (list, port) {
      angular.forEach(list, function (url) {
        var t = url.split('|');
        var cors = t[1] == 'CORS';
        url = t[0];

        db.nodes.add({
          port: parseInt(port),
          url: url,
          supports_cors: cors,
          downloaded: 0,
          success_timestamp: 0,
          failed_timestamp: 0
        });
      })
    });
  });
  db.on('changes', function (changes, partial) {
    var tables = {};
    changes.forEach(function (change) {
      var table = (tables[change.table]||(tables[change.table]={create:[],update:[],remove:[]}));
      switch (change.type) {
        case 1: { // CREATED
          table.create.push(change.obj);
          break;
        }
        case 2: { // UPDATED
          table.update.push(change.obj);
          break;
        }
        case 3: { // DELETED
          table.remove.push(change.oldObj);
          break;
        }
      };
    });
    $timeout(function () {
      angular.forEach(tables, function (table, key) {
        db[key].notifyObservers(function (observer) {
          if (observer.create) {
            observer.create(table.create);
          }
          if (observer.update) {
            observer.update(table.update);
          }
          if (observer.remove) {
            observer.remove(table.remove);
          }
          if (!partial) {
            if (observer.finally) {
              observer.finally();
            }
          }
        });
      });
    });
  });

  try {
    db.open();
  }
  catch(e) {
    console.log('DB.open.error',e);
  }

  /**
   * The default observer is enough for most CRUD requirements.
   * It works on all tables where a table is a list of model objects.
   *
   * @param $scope    Current scope
   * @param name      Name of the array on scope that should mirror the models
   * @param indexName Name of the index on the model
   * @param observer  Standard optional observer, if a method is defined it is 
   *                  called after the crud operations.
   * */
  db.createObserver = function ($scope, name, indexName, observer) {
    return {
      create: function (models) {
        $scope[name] = $scope[name].concat(models);
        if (observer && observer.create) {
          observer.create(models);
        }
      },
      update: function (models) {
        angular.forEach(models, function (model) {
          var index = UTILS.findFirstPropIndex($scope[name], model, indexName);
          if (index > 0) {
            angular.extend($scope[name][index], model);
          }
        });
        if (observer && observer.update) {
          observer.update(models);
        }
      },
      remove: function (models) {
        angular.forEach(models, function (model) {
          var index = UTILS.findFirstPropIndex($scope[name], model, indexName);
          var old = $scope[name][index];
          if (old) {
            $scope[name].splice(index, 1);
          }
        });
        if (observer && observer.remove) {
          observer.remove(models);
        }        
      }, 
      finally: function () {
        if (observer && observer.finally) {
          observer.finally();
        } 
      }
    };
  };
  return db;
});

})();