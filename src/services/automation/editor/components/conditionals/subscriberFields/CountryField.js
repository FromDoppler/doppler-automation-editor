(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('CountryField', [
    'BaseField',
    function (BaseField) {
      function CountryField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.country = {
          id: 0,
          name: '',
        };

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      CountryField.prototype = Object.create(BaseField.prototype);
      CountryField.prototype.setData = function (data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('country')) {
          this.country = data.country;
        }
      };

      CountryField.prototype.checkCompleted = function () {
        return !this.deleted && this.country.id !== 0;
      };

      return CountryField;
    },
  ]);
})();
