(function () {
'use strict';
var module = angular.module('fim.base');

module.run(function (plugins, modals, $q, $rootScope, nxt) {  

  $rootScope.createTransactionTest = function () {
    plugins.get('transaction').setAccountInfo('FIM-2XSA-Q4ZN-XKX7-9B7EK');
  }

  function getByteLen(normal_val) {
    normal_val = String(normal_val);
    var byteLen = 0;
    for (var i = 0; i < normal_val.length; i++) {
      var c = normal_val.charCodeAt(i);
      byteLen += c < (1 <<  7) ? 1 :
                 c < (1 << 11) ? 2 :
                 c < (1 << 16) ? 3 :
                 c < (1 << 21) ? 4 :
                 c < (1 << 26) ? 5 :
                 c < (1 << 31) ? 6 : Number.NaN;
    }
    return byteLen;
  }

  var ALPHABET = /^[a-zA-Z0-9]+$/;
  var EXTENDED_ALPHABET = /^[a-zA-Z0-9\!\#\$\%\&\(\)\*\+\-\.\/:;\<=\>\?\@\[\]\_\{\|\}]+$/;

  /* Returns true, false or undefined if the engine could not be determined */
  function validateAddress(text, api) {
    if (!api) {
      text = text||'';
      if (text.indexOf('FIM-') != -1) { api = nxt.fim(); }
      else if (text.indexOf('NXT-') != -1) { api = nxt.nxt(); }
    }
    if (api) { return api.createAddress().set(text); }
    // return undefined;
  }

  function create(conf) {
    var deferred = $q.defer();
    modals.open('transactionCreate', {
      resolve: {
        items: function () {
          return angular.copy(conf);
        }
      },
      close: function (items) {
        deferred.resolve(items);
      },
      cancel: function () {
        deferred.resolve(null);
      }
    });
    return deferred.promise;
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }  

  function isInteger(text, min, max) {
    if (text.indexOf('.') == -1) {
      var as_int = parseInt(text);
      if (!isNaN(as_int) && isFinite(text)) {
        if (typeof min == 'number' && as_int < min) {
          return false;
        }
        if (typeof max == 'number' && as_int > max) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  function getField(items, name) {
    for (var i=0; i<items.fields.length; i++) {
      if (items.fields[i].name == name) {
        return items.fields[i];
      }
    }
    return null;
  }

  plugins.register({
    id: 'transaction',
    create: create,
    transactions: [],
    _map: {},

    /* { id: String, label: String, exec: Function } */
    add: function (opts) {
      this._map[opts.id] = opts;
      this.transactions.push(opts);
    },
    get: function (id) {
      return this._map[id];
    },

    validators: {
      address: validateAddress
    },
    getByteLen: getByteLen,
    isInteger: isInteger,
    isNumeric: isNumeric,
    getField: getField,
    ALPHABET: ALPHABET,
    EXTENDED_ALPHABET: EXTENDED_ALPHABET,

    /*setAlias: function (senderRS, args) {
      args = args||{};
      return create(angular.extend(args, {
        title: 'Set Alias',
        message: 'Set or update an alias',
        senderRS: senderRS,
        requestType: 'setAlias',
        canHaveRecipient: false,
        createArguments: function (items) {
          return {
            aliasName: items.aliasName,
            aliasURI: items.aliasURI
          }
        },
        fields: [{
          label: 'Alias Name',
          name: 'aliasName',
          type: 'text',
          value: args.aliasName||'',
          validate: function (value) { 
            this.errorMsg = null;
            if (!value) {
              this.errorMsg = null;
            }
            else if (!ALPHABET.test(value)) {
              this.errorMsg = 'Invalid character';
            }
            else if (getByteLen(text) > 100) {
              this.errorMsg = 'To much characters';
            }
            return ! this.errorMsg;
          },
          required: true
        }, {
          label: 'Alias Value',
          name: 'aliasURI',
          type: 'textarea',
          value: args.aliasValue||'',
          validate: function (value) { 
            this.errorMsg = null;
            if (!value) {
              this.errorMsg = null;
            }
            else if (getByteLen(text) > 1000) {
              this.errorMsg = 'To much characters';
            }
            return ! this.errorMsg;
          },
          required: true
        }]
      }));
    },
    setAccountInfo: function (senderRS, args) {
      args = args||{};
      return create(angular.extend(args, {
        title: 'Account Info',
        message: 'Set or update account info',
        senderRS: senderRS,
        requestType: 'setAccountInfo',
        canHaveRecipient: false,
        createArguments: function (items) {
          return {
            name: items.name,
            description: items.description
          }
        },
        fields: [{
          label: 'Account Name',
          name: 'name',
          type: 'text',
          value: args.name||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) {
              this.errorMsg = null;
            }
            else if (!ALPHABET.test(text)) {
              this.errorMsg = 'Invalid character';
            }
            else if (getByteLen(text) > 100) {
              this.errorMsg = 'To much characters';
            }
            return ! this.errorMsg;
          },
          required: false
        }, {
          label: 'Account Description',
          name: 'description',
          type: 'textarea',
          value: args.description||'',
          validate: function (text) { 
            this.errorMsg = null;
            if (!text) {
              this.errorMsg = null;
            }
            else if (getByteLen(text) > 1000) {
              this.errorMsg = 'To much characters';
            }
            return ! this.errorMsg;
          },
          required: false
        }]
      }));
    },*/
  });

  modals.register('transactionCreate', { 
    templateUrl: 'plugins/transaction/partials/transaction-modal.html',
    controller: 'TransactionCreateModalController' 
  });  

});

})();