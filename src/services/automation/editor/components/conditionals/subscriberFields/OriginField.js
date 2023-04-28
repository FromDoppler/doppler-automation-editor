(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('OriginField', [
    'BaseField',
    function (BaseField) {
      function OriginField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.origin = {
          id: 0,
          name: '',
        };

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      OriginField.prototype = Object.create(BaseField.prototype);
      OriginField.prototype.setData = function (data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('origin')) {
          this.origin = data.origin;
        }
      };

      OriginField.prototype.checkCompleted = function () {
        return !this.deleted && this.origin.id !== 0;
      };

      return OriginField;
    },
  ]);
})();
