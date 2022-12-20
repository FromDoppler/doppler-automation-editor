(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('AbandonedCartInformation', ['$injector', 'BaseConditional', 'DUPLICATE_STATE', function($injector, BaseConditional, DUPLICATE_STATE) {

      function AbandonedCartInformation(data) {
        // Inherited constructor.
        BaseConditional.call(this, data);
        this.field = null;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseConditional.
      AbandonedCartInformation.prototype = Object.create(BaseConditional.prototype);
      AbandonedCartInformation.prototype.setData = function(data) {
        var automation = $injector.get('automation');

        BaseConditional.prototype.setData.call(this, data);
        if (data.hasOwnProperty('field') && data.field) {
          this.field = automation.createSubscriberField(data.field);
        }
      };

      AbandonedCartInformation.prototype.checkCompleted = function() {
        var isCompleted = !!this.field && (this.duplicate === DUPLICATE_STATE.FALSE
          || this.duplicate === DUPLICATE_STATE.ORIGIN);

        if (isCompleted) {
          isCompleted = this.field.checkCompleted();
        }
        this.completed = isCompleted;
      };

      AbandonedCartInformation.prototype.isEqual = function(conditional) {
        return _.isEqual(this.field, conditional.field);
      };

      AbandonedCartInformation.prototype.getPropertiesToWatch = function() {
        return [
          'field'
        ];
      };

      return AbandonedCartInformation;
    }]);
})();
