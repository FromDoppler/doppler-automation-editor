(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('CampaignBehaviorCondition', ['$injector', 'ScheduledDateCondition', 'SEND_TYPE', function($injector, ScheduledDateCondition, SEND_TYPE) {

      function CampaignBehaviorCondition(data) {
        this.sendType = null;
        this.confirmationEmailList = [];
        // Inherited constructor.
        ScheduledDateCondition.call(this, data);
      }

      // Prototype inherence from ScheduledDateCondition.
      CampaignBehaviorCondition.prototype = Object.create(ScheduledDateCondition.prototype);
      CampaignBehaviorCondition.prototype.markup = '<dp-editor-campaign-behavior-condition component="component"></dp-editor-scheduled-date-condition>';
      CampaignBehaviorCondition.prototype.panelTemplate = '<div dp-editor-panel-campaign-behavior-condition class="dp-editor-panel-campaign-condition"></div>';

      CampaignBehaviorCondition.prototype.checkCompleted = function() {
        if (this.sendType === SEND_TYPE.INMEDIATE) {
          this.completed = this.suscriptionLists.length > 0 || this.allSubscribers;
        } else {
          ScheduledDateCondition.prototype.checkCompleted.call(this);
          this.completed = !!(this.completed && this.sendType);
        }
      };

      CampaignBehaviorCondition.prototype.setData = function(data) {
        ScheduledDateCondition.prototype.setData.call(this, data);
        if (data.hasOwnProperty('sendType')) {
          this.sendType = data.sendType;
        }
        if (data.hasOwnProperty('confirmationEmailList')) {
          this.confirmationEmailList = data.confirmationEmailList;
        }
        this.checkCompleted.call(this);
      };

      CampaignBehaviorCondition.prototype.getPropertiesToWatch = function() {
        var properties = ScheduledDateCondition.prototype.getPropertiesToWatch();
        return properties.concat([
          'sendType'
        ]);
      };

      return CampaignBehaviorCondition;
    }]);
})();
