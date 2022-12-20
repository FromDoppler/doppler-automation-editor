(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('GenderField', ['BaseField', function(BaseField) {

      function GenderField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.gender = '';

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      GenderField.prototype = Object.create(BaseField.prototype);
      GenderField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('gender')) {
          this.gender = data.gender;
        }
      };

      GenderField.prototype.checkCompleted = function() {
        return !!(!this.deleted && this.gender.length);
      };

      return GenderField;
    }]);
})();
