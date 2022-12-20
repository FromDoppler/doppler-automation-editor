(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('BaseFrequency', function() {
      function BaseFrequency(data) {
      // Defaults.
        this.type = data.type;
        this.time = {
          hour: 12,
          minute: 0
        };
        this.timezone = null;

        if (data) {
          this.setData(data);
        }
      }

      BaseFrequency.prototype.setData = function(data) {
        if (data.hasOwnProperty('time')) {
          this.time = data.time;
        }
        if (data.hasOwnProperty('timezone')) {
          this.timezone = data.timezone;
        }
      };

      return BaseFrequency;
    });
})();
