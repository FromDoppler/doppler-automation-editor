(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorSiteBehaviorCondition', dpEditorSiteBehaviorCondition);

  dpEditorSiteBehaviorCondition.$inject = [
    'automation',
    'AUTOMATION_COMPLETED_STATE'
  ];

  function dpEditorSiteBehaviorCondition(automation, AUTOMATION_COMPLETED_STATE) {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-site-behavior-condition.html'
    };

    function link(scope) {
      scope.isFlowComplete = automation.getIsFlowComplete;
      scope.hasErrors = function() {
        return scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN ||
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_DEMO_EXPIRED,
        scope.isFlowComplete() === AUTOMATION_COMPLETED_STATE.WITH_NON_INTEGRATION;
      };
    }

    return directive;
  }
})();
