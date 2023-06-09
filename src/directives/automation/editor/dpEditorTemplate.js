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

      const TEMPLATES = {
        EMPTY: 0,
        REVALIDATION_SUBSCRIBERS: 1,
        BIRTHDAY_GREETING: 2,
        WELCOME_NEW_CONTACTS: 3,
        ABANDONED_CART: 4
      };

      const templateCardOrder = [
        TEMPLATES.EMPTY,
        TEMPLATES.WELCOME_NEW_CONTACTS,
        TEMPLATES.BIRTHDAY_GREETING,
        TEMPLATES.ABANDONED_CART,
        TEMPLATES.REVALIDATION_SUBSCRIBERS
      ];

      function sortTemplateCards(templatesCardsUnsorted){
        return templateCardOrder.reduce((templates, templateId) => {
          return templates.concat(templatesCardsUnsorted[templateId])
        }, [])
      }

      taskService.getAutomationTemplateList()
      .then(function(templatesCards) {
        scope.templates = sortTemplateCards(templatesCards);
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
