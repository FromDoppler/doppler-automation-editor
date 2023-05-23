(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTemplate', dpEditorTemplate);

  dpEditorTemplate.$inject = [
    'taskService', '$window'
  ];

  function dpEditorTemplate(taskService, $window) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-template.html'
    };

    return directive;

    function link(scope) {
      scope.templates = [];
      scope.isLoading = true;

      taskService.getAutomationTemplateList()
      .then(function(data) {
        scope.templates = data;
        scope.isLoading = false;
      });
      
      scope.selectAutomationTemplate = function(idAutomationTemplate, status) {
        if (status === 'active') {
          if(idAutomationTemplate == 0){
            scope.automationViewNavegate({view:'TYPES', url:'selectAutomationType'})
          } else {
            taskService.createAutomationFromTemplate(idAutomationTemplate)
            .then(function(data) {
              if(data.success === true){
                $window.location.href = '/Automation/EditorConfig?idScheduledTask=' + data.idScheduledTask + '&automationType=' +  data.scheduledTaskType;
              }
            });
          }
        }
      };
    }
  }
})();
