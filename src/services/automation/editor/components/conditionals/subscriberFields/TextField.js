(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('TextField', ['BaseField', function(BaseField) {

      function TextField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.criteria = '';
        this.value = '';

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      TextField.prototype = Object.create(BaseField.prototype);
      TextField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('criteria')) {
          this.criteria = data.criteria;
        }
        if (data.hasOwnProperty('value')) {
          this.value = data.value;
        }
      };

      TextField.prototype.checkCompleted = function() {
        return !!(!this.deleted && this.criteria.length && this.value.length);
      };

      return TextField;
    }]);
})();
