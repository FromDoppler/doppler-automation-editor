(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('BooleanField', [
    'BaseField',
    function (BaseField) {
      function BooleanField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.value = true;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      BooleanField.prototype = Object.create(BaseField.prototype);
      BooleanField.prototype.setData = function (data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('value')) {
          this.value = data.value;
        }
        if (data.hasOwnProperty('deleted')) {
          this.deleted = data.deleted;
        }
      };

      BooleanField.prototype.checkCompleted = function () {
        return !this.deleted;
      };

      return BooleanField;
    },
  ]);
})();
