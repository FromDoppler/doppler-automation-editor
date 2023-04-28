(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('SubscriberInformation', [
      '$injector',
      'BaseConditional',
      'DUPLICATE_STATE',
      function ($injector, BaseConditional, DUPLICATE_STATE) {
        function SubscriberInformation(data) {
          // Inherited constructor.
          BaseConditional.call(this, data);
          this.field = null;

          if (data) {
            this.setData(data);
          }
        }

        // Prototype inherence from BaseConditional.
        SubscriberInformation.prototype = Object.create(
          BaseConditional.prototype
        );
        SubscriberInformation.prototype.setData = function (data) {
          var automation = $injector.get('automation');

          BaseConditional.prototype.setData.call(this, data);
          if (data.hasOwnProperty('field') && data.field) {
            this.field = automation.createSubscriberField(data.field);
          }
        };

        SubscriberInformation.prototype.checkCompleted = function () {
          var isCompleted =
            !!this.field &&
            (this.duplicate === DUPLICATE_STATE.FALSE ||
              this.duplicate === DUPLICATE_STATE.ORIGIN);

          if (isCompleted) {
            isCompleted = this.field.checkCompleted();
          }
          this.completed = isCompleted;
        };

        SubscriberInformation.prototype.isEqual = function (conditional) {
          return _.isEqual(this.field, conditional.field);
        };

        SubscriberInformation.prototype.getPropertiesToWatch = function () {
          return ['field'];
        };

        return SubscriberInformation;
      },
    ]);
})();
