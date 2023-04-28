(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDelay', dpEditorDelay);

  dpEditorDelay.$inject = ['$translate'];

  function dpEditorDelay($translate) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '=',
      },
      templateUrl:
        'angularjs/partials/automation/editor/directives/components/dp-editor-delay.html',
      link: link,
    };

    return directive;

    function link(scope) {
      var selectedComponent = scope.component;
      scope.$on('AUTOMATION_SAVED', function () {
        scope.component.hasUnsavedChanges = false;
      });
      scope.getTimeUnitLabel = function () {
        var timeUnitLabel = $translate.instant(
          'automation_editor.sidebar.time_unit.' + selectedComponent.timeUnit
        );
        timeUnitLabel =
          timeUnitLabel.charAt(0).toLowerCase() + timeUnitLabel.slice(1);
        if (scope.component.time && scope.component.time.toString() === '1') {
          timeUnitLabel = timeUnitLabel.slice(0, -1);
        }

        return timeUnitLabel;
      };
    }
  }
})();
