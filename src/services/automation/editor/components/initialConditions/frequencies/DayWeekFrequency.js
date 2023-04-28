(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('DayWeekFrequency', [
    'BaseFrequency',
    function (BaseFrequency) {
      function DayWeekFrequency(data) {
        this.days = [];

        // Inherited constructor.
        BaseFrequency.call(this, data);
      }

      // Prototype inherence from BaseFrequency.
      DayWeekFrequency.prototype = Object.create(BaseFrequency.prototype);
      DayWeekFrequency.prototype.checkCompleted = function () {
        return this.days.length > 0;
      };

      DayWeekFrequency.prototype.setData = function (data) {
        BaseFrequency.prototype.setData.call(this, data);
        if (data.hasOwnProperty('days')) {
          this.days = data.days;
        }
      };

      return DayWeekFrequency;
    },
  ]);
})();
