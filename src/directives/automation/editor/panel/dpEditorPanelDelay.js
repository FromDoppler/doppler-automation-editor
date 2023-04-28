(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelDelay', dpEditorPanelDelay);

  dpEditorPanelDelay.$inject = ['optionsListDataservice', 'automation'];

  function dpEditorPanelDelay(optionsListDataservice, automation) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-delay.html',
      link: link,
    };

    return directive;

    function link(scope) {
      scope.timeUnitOptions = optionsListDataservice.getTimeUnitOptions();
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.onTimeUnitSelected = function (value) {
        scope.selectedComponent.timeUnit = value;
      };
      scope.canEdit = function () {
        return !automation.isReadOnly() || automation.isPaused();
      };
    }
  }
})();
