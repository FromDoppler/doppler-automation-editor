(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('BaseOperation', [
    'utils',
    function (utils) {
      function BaseOperation(data) {
        // Defaults.
        this.uid = utils.newUid();
        this.type = data.type;
      }

      BaseOperation.prototype.setData = function (data) {
        if (data.hasOwnProperty('uid')) {
          this.uid = data.uid;
          utils.updateLastUid(data.uid);
        }
        if (data.hasOwnProperty('type')) {
          this.type = data.type;
        }
      };

      return BaseOperation;
    },
  ]);
})();
