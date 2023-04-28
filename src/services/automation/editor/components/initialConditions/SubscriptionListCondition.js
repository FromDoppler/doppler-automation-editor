(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('SubscriptionListCondition', [
      'BaseInitialConditionComponent',
      function (BaseInitialConditionComponent) {
        function SubscriptionListCondition(data) {
          this.suscriptionList = null;

          // Inherited constructor.
          BaseInitialConditionComponent.call(this, data);
        }

        // Prototype inherence from BaseInitialConditionComponent.
        SubscriptionListCondition.prototype = Object.create(
          BaseInitialConditionComponent.prototype
        );
        SubscriptionListCondition.prototype.markup =
          '<dp-editor-subscription-list-condition component="component"></dp-editor-subscription-list-condition>';
        SubscriptionListCondition.prototype.panelTemplate =
          '<div dp-editor-panel-subscription-list-condition></div>';

        SubscriptionListCondition.prototype.checkCompleted = function () {
          this.completed = this.suscriptionList !== null;
        };

        SubscriptionListCondition.prototype.setData = function (data) {
          BaseInitialConditionComponent.prototype.setData.call(this, data);
          if (data.hasOwnProperty('suscriptionList')) {
            this.suscriptionList = data.suscriptionList;
          }
          this.checkCompleted.call(this);
        };

        SubscriptionListCondition.prototype.getCompletedPropertiesToWatch =
          function () {
            return [
              'suscriptionList.IdSubscribersList',
              'suscriptionList.ListName',
            ];
          };

        return SubscriptionListCondition;
      },
    ]);
})();
