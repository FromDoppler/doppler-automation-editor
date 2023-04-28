(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorWarning', dpEditorWarning);

  dpEditorWarning.$inject = [
    'warningsStepsService',
    'automation',
    'selectedElementsService',
    '$translate',
    'goToService',
    'COMPONENT_TYPE',
  ];

  function dpEditorWarning(
    warningsStepsService,
    automation,
    selectedElementsService,
    $translate,
    goToService,
    COMPONENT_TYPE
  ) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/header/dp-editor-warnings.html',
      link: link,
      scope: {},
    };

    return directive;

    function link(scope) {
      scope.componentTypes = [
        'delay',
        'campaign',
        'action',
        'condition',
        'sms',
        'push_notification',
        'goto',
        'initial_condition',
      ];
      scope.isOpen = false;
      scope.warningsSteps = warningsStepsService.getAllWarningsSteps();
      scope.warningStepsCount = warningsStepsService.getWarningsStepsCount;
      scope.hasWarningSteps = warningsStepsService.getHasWarningSteps;

      scope.toogleStepsContainer = function () {
        scope.isOpen = !scope.isOpen;
      };

      scope.hasSteps = function () {
        return automation.getModel().children.length > 0;
      };

      scope.selectComponent = function (componentType) {
        var component = automation.getComponentByUid(
          scope.warningsSteps[componentType][0]
        );
        if (component) {
          selectedElementsService.setSelectedComponent(component);
          selectedElementsService.scrollIntoElement(component.uid);
          automation.toggleCollapsePanel(false);
          //hack to set scroll 0 at html element
          // TODO fix it #goto issues
          document.querySelector('html').scrollTop = 0;
          if (component.type !== COMPONENT_TYPE.GOTO_STEP) {
            goToService.unmarkAllComponentsInGotoSelection([
              'goto-connected',
              'goto-target-available',
              'goto-target-unavailable',
              'dp-tooltip-container',
            ]);
          }
        }
      };

      scope.closeDropdown = function () {
        scope.isOpen = false;
      };

      scope.$watch(
        'warningsSteps',
        function () {
          if (!scope.hasWarningSteps()) {
            scope.closeDropdown();
          }
        },
        true
      );

      scope.getWarningLabel = function () {
        var label;
        if (scope.hasWarningSteps()) {
          var count = scope.warningStepsCount();
          if (count === 1) {
            label = $translate.instant(
              'automation_editor.steps.one_incompleted'
            );
          } else if (count > 1) {
            label = $translate.instant(
              'automation_editor.steps.more_incompleted'
            );
          }
        } else {
          label = $translate.instant('automation_editor.steps.all_completed');
        }

        return label;
      };

      scope.getComponentWarningLabel = function (componentType) {
        var label;
        if (
          !scope.warningsSteps[componentType] ||
          !scope.warningsSteps[componentType].length ||
          scope.warningsSteps[componentType].length > 1
        ) {
          label = $translate.instant(
            'automation_editor.steps.' + componentType + 's_not_defined'
          );
        } else if (scope.warningsSteps[componentType].length === 1) {
          label = $translate.instant(
            'automation_editor.steps.' + componentType + '_not_defined'
          );
        }

        return label;
      };

      scope.hasBlockedList = function () {
        return automation.hasBlockedList();
      };
    }
  }
})();
