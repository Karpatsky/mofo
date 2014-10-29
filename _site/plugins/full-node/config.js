(function () {
'use strict';
var module = angular.module('fim.base');
module.run(function (plugins) {  
  plugins.register({
    id: 'full-node',
    extends: 'settings',
    label: 'Local Server',
    icon_class: 'glyphicon glyphicon-hdd',
    templateURL: 'plugins/full-node/partials/full-node.html',
  });
});
})();