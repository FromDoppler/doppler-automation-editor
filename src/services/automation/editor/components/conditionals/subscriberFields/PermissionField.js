(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('PermissionField', ['BaseField', function(BaseField) {

      function PermissionField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.value = true;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      PermissionField.prototype = Object.create(BaseField.prototype);
      PermissionField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('value')) {
          this.value = data.value;
        }
      };

      PermissionField.prototype.checkCompleted = function() {
        return !this.deleted;
      };

      return PermissionField;
    }]);
})();
