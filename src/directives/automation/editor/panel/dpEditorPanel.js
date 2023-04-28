(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanel', [
      'automation',
      'selectedElementsService',
      'COMPONENT_TYPE',
      'CONDITION_TYPE',
      '$compile',
      dpEditorPanel,
    ]);

  function dpEditorPanel(
    automation,
    selectedElementsService,
    COMPONENT_TYPE,
    CONDITION_TYPE,
    $compile
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel.html',
      link: link,
      controller: ['$scope', '$element', controller],
    };

    return directive;

    function controller($scope, $element) {
      var cloneScope = null;
      $scope.$watch(
        selectedElementsService.getSelectedComponent,
        function (newComponent) {
          if (cloneScope) {
            cloneScope.$destroy();
            cloneScope = null;
          }
          $element[0].querySelector('.scroll-container').scrollTop = 0;
          var panelElement = angular.element(
            $element[0].querySelector('.component-panel-container')
          );
          var template = newComponent
            ? newComponent.panelTemplate
            : '<div></div>';
          var panelComponent = angular.element(template);
          cloneScope = $scope.$new();
          panelElement.empty().append(panelComponent);
          $compile(panelComponent)(cloneScope);
        }
      );
    }

    function link(scope) {
      scope.COMPONENT_TYPE = COMPONENT_TYPE;
      scope.CONDITION_TYPE = CONDITION_TYPE;
      scope.isCollapsed = automation.getIsPanelCollapsed;
      scope.toggleCollapsePanel = automation.toggleCollapsePanel;
      scope.isScrollOnTop = true;
      scope.selectedComponent = selectedElementsService.getSelectedComponent();

      scope.scrollBehaviour = function (isScrollOnTop) {
        scope.isScrollOnTop = isScrollOnTop;
        scope.$apply();
      };

      scope.hasSelectedElement = function () {
        return (
          scope.selectedComponent &&
          (scope.selectedComponent.type === COMPONENT_TYPE.DELAY ||
            scope.selectedComponent.type === COMPONENT_TYPE.CONDITION ||
            scope.selectedComponent.type === COMPONENT_TYPE.GOTO ||
            scope.selectedComponent.type === COMPONENT_TYPE.ACTION)
        );
      };

      scope.hasReports = function () {
        return (
          scope.selectedComponent &&
          scope.selectedComponent.type !== COMPONENT_TYPE.PUSH_NOTIFICATION &&
          scope.selectedComponent.type !== CONDITION_TYPE.PUSH
        );
      };
    }
  }
})();
