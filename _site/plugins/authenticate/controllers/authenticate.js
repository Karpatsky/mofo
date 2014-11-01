(function () {
'use strict';
var module = angular.module('fim.base');
module.controller('AuthenticatePlugin', function($scope, $stateParams, modals, $q, nxt, plugins) {

  var authenticator_rs = 'FIM-XJXA-VCLN-4BWL-2SGAB';

  $scope.lender = {}
  $scope.lender.name = $stateParams.name;
  $scope.lender.url = decodeURIComponent($stateParams.url);
  $scope.confirmed = false;

  function getSecretPhrase() {
    var deferred = $q.defer();
    modals.open('secretPhrase', {
      resolve: {
        items: function () {
          return {
            sender: $stateParams.id_rs
          }
        }
      },
      close: function (items) {
        deferred.resolve(items.secretPhrase);
      },
      cancel: function (error) {
        deferred.reject();
      }
    });
    return deferred.promise;
  }

  function getAccountRS(secretPhrase) {
    return nxt.fim().crypto.getAccountId(secretPhrase, true);
  }

  function decryptAlias(secretPhrase, aliasURI) {
    return JSON.stringify({
      name: 'Alice',
      sn: '1234567890'
    })
  }

  /**
   * Reads and decrypts the personal data as JSON from the association 
   * namespaced alias.
   */
  function getAccountPersonalData(secretPhrase, id_rs) {
    var deferred = $q.defer();
    // nxt.fim().getNamespacedAlias({
    //   account:    authenticator_rs,
    //   aliasName:  'STORED:'+id_rs
    // }).then(
    //   function (data) {
    //     deferred.resolve(decryptAlias(secretPhrase, data.aliasURI))
    //   }
    // );
    deferred.resolve(decryptAlias());
    return deferred.promise;
  }

  $scope.login = function () {
    getSecretPhrase().then(
      function (secretPhrase) {
        var id_rs = getAccountRS(secretPhrase);
        getAccountPersonalData(secretPhrase, id_rs).then(
          function (data_str) {

            /* Confirm this is the correct account */
            plugins.get('alerts').confirm({
              title: 'Confirm this is your account',
              message: data_str
            }).then(
              function (confirmed) {
                if (confirmed) {
                  $scope.$evalAsync(function () {
                    $scope.confirmed = true;
                  });
                }
              }
            );
          }
        );
      }
    );
  }

  $scope.send = function () {
    plugins.get('alerts').confirm({
      title: 'Are you sure',
      message: "Are you sure you want to do this?"
    }).then(
      function (confirmed) {
        if (confirmed) {

          

        }
      }
    );
  }

});
})();