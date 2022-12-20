(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('ScheduledDateCondition', ['$injector', 'BaseInitialConditionComponent', function($injector, BaseInitialConditionComponent) {

      function ScheduledDateCondition(data) {
        this.suscriptionLists = [];
        this.allSubscribers = false;
        this.frequency = null;

        // Inherited constructor.
        BaseInitialConditionComponent.call(this, data);
      }

      // Prototype inherence from BaseInitialConditionComponent.
      ScheduledDateCondition.prototype = Object.create(BaseInitialConditionComponent.prototype);
      ScheduledDateCondition.prototype.markup = '<dp-editor-scheduled-date-condition component="component"></dp-editor-scheduled-date-condition>';
      ScheduledDateCondition.prototype.panelTemplate = '<div dp-editor-panel-scheduled-date-condition class="dp-editor-panel-scheduled-date-condition"></div>';

      ScheduledDateCondition.prototype.checkCompleted = function() {
        this.completed = this.frequency !== null && this.frequency.checkCompleted()
          && (this.suscriptionLists.length > 0 || this.allSubscribers);
      };

      ScheduledDateCondition.prototype.setFrequency = function(frequencyData) {
        var automation = $injector.get('automation');
        this.frequency = automation.createFrequency(frequencyData);
      };

      ScheduledDateCondition.prototype.setData = function(data) {
        BaseInitialConditionComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('suscriptionLists')) {
          this.suscriptionLists = data.suscriptionLists;
        }
        if (data.hasOwnProperty('allSubscribers')) {
          this.allSubscribers = data.allSubscribers;
        }
        if (data.hasOwnProperty('frequency')) {
          data.frequency ? this.setFrequency(data.frequency) : this.frequency = data.frequency;
        }
        this.checkCompleted.call(this);
      };

      ScheduledDateCondition.prototype.getPropertiesToWatch = function() {
        return [
          'frequency'
        ];
      };

      return ScheduledDateCondition;
    }]);
})();
