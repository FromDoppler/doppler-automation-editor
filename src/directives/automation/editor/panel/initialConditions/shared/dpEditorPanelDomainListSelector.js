(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelDomainListSelector', dpEditorPanelDomainListSelector);

  dpEditorPanelDomainListSelector.$inject = [
    'DOMAINS_SELECTION_STATE'
  ];

  function dpEditorPanelDomainListSelector(DOMAINS_SELECTION_STATE) {
    return {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/shared/dp-editor-panel-domain-list-selector.html',
      link: link
    };

    function link(scope) {
      scope.DOMAINS_SELECTION_STATE =  DOMAINS_SELECTION_STATE;
    }
  }
})();