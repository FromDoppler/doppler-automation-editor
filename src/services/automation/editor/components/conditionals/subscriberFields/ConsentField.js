(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ConsentField', ['BaseField', function(BaseField) {

      function ConsentField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.value = false;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      ConsentField.prototype = Object.create(BaseField.prototype);
      ConsentField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('value')) {
          this.value = data.value;
        }
      };

      ConsentField.prototype.checkCompleted = function() {
        return !this.deleted;
      };

      return ConsentField;
    }]);
})();
  