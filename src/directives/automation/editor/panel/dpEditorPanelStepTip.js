(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelStepTip', dpEditorPanelStepTip);

  function dpEditorPanelStepTip() {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-step-tip.html',
    };

    return directive;
  }
})();
