(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DayYearFrequency', ['$translate', 'BaseFrequency', 'TIME_UNIT', function($translate, BaseFrequency, TIME_UNIT) {

      function DayYearFrequency(data) {
        this.momentId = 0;
        this.momentType = TIME_UNIT.DAYS;
        // Note: in case to add more momentType update to unique value example this.frequencyValue
        this.momentDays = 1;
        this.momentWeeks = 0;
        this.customFields = [{
          id: 323,
          label: $translate.instant('automation_editor.components.initial_condition.scheduled_date.custom_birthday')
        }];
        // Inherited constructor.
        BaseFrequency.call(this, data);
      }

      // Prototype inherence from BaseFrequency.
      DayYearFrequency.prototype = Object.create(BaseFrequency.prototype);
      DayYearFrequency.prototype.checkCompleted = function() {
        var requiresOffset = this.momentId === 1 || this.momentId === 2;

        if (!requiresOffset) {
          return true;
        }

        if (this.momentType === TIME_UNIT.DAYS) {
          return Number(this.momentDays) > 0;
        }

        if (this.momentType === TIME_UNIT.WEEKS) {
          return Number(this.momentWeeks) > 0;
        }

        return false;
      };

      DayYearFrequency.prototype.setData = function(data) {
        BaseFrequency.prototype.setData.call(this, data);
        if (data.hasOwnProperty('momentId')) {
          this.momentId = data.momentId;
        }
        if (data.hasOwnProperty('momentDays')) {
          this.momentDays = data.momentDays;
        }
        if (data.hasOwnProperty('customFields')) {
          this.customFields = getFormattedCustomFields(this.customFields, data.customFields);
        }
        if (data.hasOwnProperty('momentWeeks')) {
          this.momentWeeks = data.momentWeeks;
          if( this.momentWeeks > 0) {
            this.momentType = TIME_UNIT.WEEKS;
          }
        }
      };

      function getFormattedCustomFields(frequencyCF, dataCF) {
        var birthdayIndex;
        if (dataCF.length) {
          birthdayIndex = _.findIndex(dataCF, function(customField) {
            return customField.id === 323;
          });
          if (birthdayIndex !== -1) {
            dataCF[birthdayIndex].label = $translate.instant('automation_editor.components.initial_condition.scheduled_date.custom_birthday');
          }
          return dataCF;
        }
        return frequencyCF;
      }

      return DayYearFrequency;
    }]);
})();
