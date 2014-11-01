(function () {
'use strict';
var module = angular.module('fim.base');
module.config(function($stateProvider) {  
  $stateProvider.state('authenticate', {
    url: '/authenticate/:id_rs/:name/{url:.*}',
    templateUrl: 'plugins/authenticate/partials/authenticate.html',
    controller: 'AuthenticatePlugin'
  });
});
})();

// http://localhost:9000/#/authenticate/FIM-J3Q5-N4P4-L479-2RDGS/Mega%20Loan%20Shark/https://superloans.com/auth.php%3Fu=xxx&p=yyy