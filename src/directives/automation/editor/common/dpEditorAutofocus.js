(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorAutofocus', ['$timeout', dpEditorAutofocus]);

  function dpEditorAutofocus($timeout) {
    var directive = {
      restrict: 'A',
      link: link,
      scope: {
        autofocus: '=dpEditorAutofocus'
      }
    };

    return directive;

    function link(scope, element) {
      if (scope.autofocus) {
        $timeout(function() {
          element[0].focus();
        });
      }
    }
  }
})();
