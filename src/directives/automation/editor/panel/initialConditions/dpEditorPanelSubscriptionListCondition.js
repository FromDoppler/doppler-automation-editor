(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelSubscriptionListCondition', dpEditorPanelSubscriptionListCondition);

  dpEditorPanelSubscriptionListCondition.$inject = ['LIST_SELECTION_STATE', 'automation'];

  function dpEditorPanelSubscriptionListCondition(LIST_SELECTION_STATE, automation) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-subscription-list-condition.html',
      link: link
    };

    return directive;

    function link(scope) {
      scope.showListSelectionSimple = function() {
        scope.toggleListSelection(LIST_SELECTION_STATE.SIMPLE);
      };

      scope.showInitConditionMessage = function () {
        var isReplica = automation.getModel().isReplica;
        return scope.selectedComponent.completed === false && isReplica;
      }
    }
  }
})();
