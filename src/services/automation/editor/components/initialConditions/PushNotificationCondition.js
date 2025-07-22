(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('PushNotificationCondition', ['BaseInitialConditionComponent', '$injector', 'SEND_TYPE', function (BaseInitialConditionComponent, $injector, SEND_TYPE) {

      function PushNotificationCondition(data) {
        this.domains = [];
        this.frequency = null;
        this.sendType = null;

        BaseInitialConditionComponent.call(this, data);
      }

      PushNotificationCondition.prototype = Object.create(BaseInitialConditionComponent.prototype);
      PushNotificationCondition.prototype.markup = '<dp-editor-push-notification-condition component="component"></dp-editor-push-notification-condition>';
      PushNotificationCondition.prototype.panelTemplate = '<div dp-editor-panel-push-notification-condition class="dp-editor-panel-push-notification-condition"></div>';

      PushNotificationCondition.prototype.checkCompleted = function() {
        if (this.sendType === SEND_TYPE.INMEDIATE) {
          this.completed = this.domains.length > 0;
        } else if (this.sendType === SEND_TYPE.SCHEDULED_DATE) {
          this.completed = this.frequency !== null && this.frequency.type !== 'date' 
            && this.frequency.checkCompleted() && this.domains.length > 0;
        } else {
          this.completed = this.frequency !== null && this.frequency.checkCompleted()
            && this.domains.length > 0;
        }
      };

      PushNotificationCondition.prototype.setFrequency = function(frequencyData) {
        var automation = $injector.get('automation');
        this.frequency = automation.createFrequency(frequencyData);
      };

      PushNotificationCondition.prototype.setData = function(data) {
        BaseInitialConditionComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('domains')) {
          this.domains = data.domains;
        }

        if (data.hasOwnProperty('frequency')) {
          data.frequency ? this.setFrequency(data.frequency) : this.frequency = data.frequency;
        }
        if (data.hasOwnProperty('sendType')) {
          this.sendType = data.sendType;
        }
        this.checkCompleted.call(this);
      };

      PushNotificationCondition.prototype.getPropertiesToWatch = function() {
        return [
          'frequency',
          'sendType'
        ];
      };

      return PushNotificationCondition;
    }]);
})();
