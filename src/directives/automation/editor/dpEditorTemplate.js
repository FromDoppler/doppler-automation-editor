(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTemplate', dpEditorTemplate);

  dpEditorTemplate.$inject = [
    'taskService', 'whatsappDataservice', '$window'
  ];

  function dpEditorTemplate(taskService, whatsappDataservice, $window) {
    var directive = {
      restrict: 'E',
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-template.html'
    };

    return directive;

    function link(scope) {
      scope.conversationsLink = whatsappDataservice.getConversationsLink();
      scope.conversationsPlanLink = whatsappDataservice.getConversationsPlanLink();
      scope.templates = [];
      scope.isLoading = true;

      taskService.getAutomationTemplateList()
      .then(function(templatesCards) {
        scope.templates = templatesCards;
        scope.isLoading = false;
      });
      
      scope.selectAutomationTemplate = function(idAutomationTemplate, status) {
        if (status === 'active') {
          if(idAutomationTemplate == 0){
            scope.automationViewNavegate(scope.AUTOMATION_VIEW.TYPES)
          } else {
            scope.setAutomationTemplateSelected(idAutomationTemplate);
            scope.automationViewNavegate(scope.AUTOMATION_VIEW.TEMPLATE_PREVIEW)
          }
        }
      };
    }
  }
})();
