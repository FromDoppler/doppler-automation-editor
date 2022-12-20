(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DayMonthFrequency', ['BaseFrequency', function(BaseFrequency) {

      function DayMonthFrequency(data) {
        this.day = 1;

        // Inherited constructor.
        BaseFrequency.call(this, data);
      }

      // Prototype inherence from BaseFrequency.
      DayMonthFrequency.prototype = Object.create(BaseFrequency.prototype);
      DayMonthFrequency.prototype.checkCompleted = function() {
        return true;
      };

      DayMonthFrequency.prototype.setData = function(data) {
        BaseFrequency.prototype.setData.call(this, data);
        if (data.hasOwnProperty('day')) {
          this.day = data.day;
        }
      };

      return DayMonthFrequency;
    }]);
})();
