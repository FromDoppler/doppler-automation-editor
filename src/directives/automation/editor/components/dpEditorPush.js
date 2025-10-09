(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPush', dpEditorPush);

  function dpEditorPush() {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/dp-editor-push.html',
      link: link
    };

    return directive;

    function link() {}
  }
})();
