(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTemplatePreview', dpEditorTemplatePreview);

    dpEditorTemplatePreview.$inject = [
    'taskService', '$window'
  ];

  function dpEditorTemplatePreview(taskService, $window) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-template-preview.html'
    };

    return directive;

    function link(scope) {
      scope.createAutomationFromTemplate = function() {
        taskService.createAutomationFromTemplate(scope.idAutomationTemplateSelected)
        .then(function(data) {
          if(data.success === true){
            $window.location.href = '/Automation/EditorConfig?idScheduledTask=' + data.idScheduledTask + '&automationType=' +  data.scheduledTaskType;
          }
        });
      };
    }
  }
})();
