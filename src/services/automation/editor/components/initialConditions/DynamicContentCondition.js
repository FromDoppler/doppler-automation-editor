(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('DynamicContentCondition', [
      '$injector',
      'BaseInitialConditionComponent',
      '$translate',
      'AUTOMATION_TYPE',
      function (
        $injector,
        BaseInitialConditionComponent,
        $translate,
        AUTOMATION_TYPE
      ) {
        function DynamicContentCondition(data) {
          BaseInitialConditionComponent.call(this, data);
        }

        DynamicContentCondition.prototype = Object.create(
          BaseInitialConditionComponent.prototype
        );
        DynamicContentCondition.prototype.markup =
          '<dp-editor-dynamic-content-condition component="component"></dp-editor-dynamic-content-condition>';
        DynamicContentCondition.prototype.panelTemplate =
          '<div dp-editor-panel-dynamic-content-condition class="dp-editor-panel-dynamic-content-condition"></div>';

        DynamicContentCondition.prototype.checkCompleted = function () {
          this.completed = true;
        };

        DynamicContentCondition.prototype.setData = function (data) {
          BaseInitialConditionComponent.prototype.setData.call(this, data);
          if (data.hasOwnProperty('idThirdPartyApp')) {
            this.idThirdPartyApp = data.idThirdPartyApp;
          }
          if (data.hasOwnProperty('eventWaitMinutes')) {
            this.eventWaitMinutes = data.eventWaitMinutes;
          }
          if (data.hasOwnProperty('availableStock')) {
            this.availableStock = data.availableStock;
          }
          if (data.hasOwnProperty('automationType')) {
            this.automationType = data.automationType;
            this.idDynamicAction = getDynamicAction(data.automationType);
          }
          if (data.hasOwnProperty('eventIntervalMinutes')) {
            this.eventIntervalMinutes = data.eventIntervalMinutes;
            this.eventIntervalMinutesLabel = $translate.instant(
              'automation_editor.sidebar.' +
                this.automationType +
                '.drop_down_time_options.option' +
                data.eventIntervalMinutes
            );
          }
          this.checkCompleted.call(this);
        };

        function getDynamicAction(automationType) {
          var action;
          switch (automationType) {
            case AUTOMATION_TYPE.VISITED_PRODUCTS:
              action = 1;
              break;
            case AUTOMATION_TYPE.ABANDONED_CART:
              action = 2;
              break;
            case AUTOMATION_TYPE.PENDING_ORDER:
              action = 6;
              break;
            case AUTOMATION_TYPE.CONFIRMATION_ORDER:
              action = 7;
              break;
            default:
              throw new Error('Invalid automationType');
          }
          return action;
        }

        return DynamicContentCondition;
      },
    ]);
})();
