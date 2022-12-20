(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DateField', ['BaseField', function(BaseField) {

      function DateField(data) {
        // Inherited constructor.
        BaseField.call(this, data);
        this.criteria = '';
        this.date = '';

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseField.
      DateField.prototype = Object.create(BaseField.prototype);
      DateField.prototype.setData = function(data) {
        BaseField.prototype.setData.call(this, data);
        if (data.hasOwnProperty('date')) {
          this.date = data.date.length <= 10 ? data.date : data.date.substr(0, 10);
        }
        if (data.hasOwnProperty('criteria')) {
          this.criteria = data.criteria;
        }
        if (data.hasOwnProperty('deleted')) {
          this.deleted = data.deleted;
        }
      };

      DateField.prototype.checkCompleted = function() {
        return !!(!this.deleted && this.criteria.length && this.date.length);
      };

      return DateField;
    }]);
})();
