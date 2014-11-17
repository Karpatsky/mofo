(function () {
'use strict';
var module = angular.module('fim.base');
module.config(function($stateProvider) {  
  $stateProvider.state('assets', {
    url: '/assets/:engine/:asset',
    views: {
      '': { 
        templateUrl: 'plugins/assets/partials/exchange.html',
        controller: 'ExchangePluginController'
      },
      'markets@assets': {
        templateUrl: 'plugins/assets/partials/markets.html',
        controller: 'ExchangePluginMarketsController'
      },      
      'buys@assets': {
        templateUrl: 'plugins/assets/partials/buys.html',
        controller: 'ExchangePluginBuysController'
      },
      'sells@assets': {
        templateUrl: 'plugins/assets/partials/sells.html',
        controller: 'ExchangePluginSellsController'
      },   
      'chart@assets': {
        templateUrl: 'plugins/assets/partials/chart.html',
        controller: 'ExchangePluginChartController'
      }, 
      'trades@assets': {
        templateUrl: 'plugins/assets/partials/trades.html',
        controller: 'ExchangePluginTradesController'
      },
      'info@assets': {
        templateUrl: 'plugins/assets/partials/info.html',
        controller: 'ExchangePluginInfoController'
      }
    }
  });
});

module.run(function (modals, plugins) {
  plugins.register({
    id: 'assets',
    extends: 'app',
    sref: 'assets',
    label: 'Assets',
    icon_class: 'glyphicon glyphicon-transfer'
  });  
});

})();