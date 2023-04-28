(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelSubscribersLists', dpEditorPanelSubscribersLists);

  dpEditorPanelSubscribersLists.$inject = ['automation'];

  function dpEditorPanelSubscribersLists(automation) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-subscribers-lists.html',
      link: link,
    };

    return directive;

    function link(scope) {
      scope.hasBlockedList = function () {
        return automation.hasBlockedList();
      };
    }
  }
})();
