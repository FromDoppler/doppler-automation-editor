(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPushNotificationCondition', ['automation', 'COMPONENT_TYPE', 'SEND_TYPE', '$translate',
      'AUTOMATION_STATE', '$interval', 'dateValidation', 'settingsService', 'pushService', dpEditorPushNotificationCondition]);

  function dpEditorPushNotificationCondition(automation, COMPONENT_TYPE, SEND_TYPE, $translate,
    AUTOMATION_STATE, $interval, dateValidation, settingsService, pushService) {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-push-notification-condition.html'
    };

    return directive;

    function link(scope) {

      var dateValidationService = {};
      dateValidation.getService().then(function (result) {
        dateValidationService = result;
        scope.component.hasStartDateExpired = dateValidationService.isTrialExpired();
        automation.checkCompleted();
      });
      scope.hasErrors = function() {
        // TODO: determinate if current state has errors
      };

      var updateDateIfNotValidInterval = 900000;

      scope.SEND_TYPE = SEND_TYPE;
      scope.format = $translate.instant('automation_editor.date_format').toUpperCase();
      scope.timeZone = '';
      scope.date = scope.component.frequency ? moment(scope.component.frequency.date).format(scope.format) : new Date();

      settingsService.getSettings().then(function(response) {
        scope.timeZones = response.timeZones;
      });

      if (automation.getModel().state !== AUTOMATION_STATE.ACTIVE) {
        dateValidation.updateDateIfNotValid();
        $interval(function() {
          dateValidation.updateDateIfNotValid();
        }, updateDateIfNotValidInterval);
      }

      scope.$watch('component.frequency.date', function() {
        if (scope.component.frequency) {
          scope.date = moment(scope.component.frequency.date).format(scope.format);
        }
      });

      scope.$watch('component.frequency.timezone', function() {
        if (scope.component.frequency) {
          var timezoneResult = _.find(scope.timeZones, function(item) {
            return item.IdUserTimeZone === scope.component.frequency.timezone;
          });
          if (timezoneResult) {
            scope.timeZone = timezoneResult.Name.split(')')[0] + ')';
          }
        }
      });

      scope.isInitialConditionComplete = function() {
        if (scope.component.completed) {
          pushService.setInitialComponentCompleted(true);
          return true;
        }else{
          pushService.setInitialComponentCompleted(false);
          return false;
        }
      }
    }
  }
})();
