(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorSubscriptionListCondition', dpEditorSubscriptionListCondition);

  function dpEditorSubscriptionListCondition() {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-subscription-list-condition.html'
    };

    return directive;
  }
})();
