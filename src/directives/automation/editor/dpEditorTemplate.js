(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTemplate', dpEditorTemplate);

  dpEditorTemplate.$inject = [
    '$window'
  ];

  function dpEditorTemplate($window) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-template.html'
    };

    return directive;

    function link(scope) {
      scope.selectAutomationTemplate = function(type, status) {
        if (status === 'active') {
          if(type == 0){
            scope.automationViewNavegate({view:'TYPES', url:'selectAutomationType'})
          } else {
            /*add code to get the automation id to redirect*/
          }
        }
      };
    }
  }
})();
