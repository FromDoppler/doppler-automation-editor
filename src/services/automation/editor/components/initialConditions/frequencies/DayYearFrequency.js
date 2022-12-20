(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DayYearFrequency', ['$translate', 'BaseFrequency', function($translate, BaseFrequency) {

      function DayYearFrequency(data) {
        this.momentId = 0;
        this.momentDays = 1;
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
        if (!this.momentDays && (this.momentId === 1 || this.momentId === 2)) {
          return false;
        }
        return true;
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
