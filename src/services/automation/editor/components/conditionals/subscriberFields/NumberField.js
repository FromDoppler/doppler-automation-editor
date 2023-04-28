(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('NumberField', [
    'BaseField',
    function (BaseField) {
      function NumberField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.criteria = '';
        this.value = null;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      NumberField.prototype = Object.create(BaseField.prototype);
      NumberField.prototype.setData = function (data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('criteria')) {
          this.criteria = data.criteria;
        }
        if (data.hasOwnProperty('value')) {
          this.value = data.value;
        }
        if (data.hasOwnProperty('deleted')) {
          this.deleted = data.deleted;
        }
      };

      NumberField.prototype.checkCompleted = function () {
        return !!(!this.deleted && this.criteria.length && this.value);
      };

      return NumberField;
    },
  ]);
})();
