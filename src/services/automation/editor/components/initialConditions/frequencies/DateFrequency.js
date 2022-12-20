(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DateFrequency', ['BaseFrequency', function(BaseFrequency) {

      function DateFrequency(data) {
        this.date = null;

        // Inherited constructor.
        BaseFrequency.call(this, data);
      }

      // Prototype inherence from BaseFrequency.
      DateFrequency.prototype = Object.create(BaseFrequency.prototype);
      DateFrequency.prototype.checkCompleted = function() {
        return this.date !== null;
      };

      DateFrequency.prototype.setData = function(data) {
        BaseFrequency.prototype.setData.call(this, data);
        if (data.hasOwnProperty('date')) {
          this.date = data.date;
        }
      };

      return DateFrequency;
    }]);
})();
