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
      scope.templates = [];
      scope.isLoading = true;

      const TEMPLATES = {
        EMPTY: 0,
        REVALIDATION_SUBSCRIBERS: 1,
        BIRTHDAY_GREETING: 2,
        WELCOME_NEW_CONTACTS: 3,
        ABANDONED_CART: 4,
        SMS: 5,
        FIRST_PURCHASE: 6,
        WEBSITE_VISIT: 7,
        WHATSAPP: 8,
        PENDING_PAYMENT_REMINDER: 9,
        CONFIRMED_PAYMENT: 10,
      };

      const templateCardOrder = [
        TEMPLATES.EMPTY,
        TEMPLATES.WHATSAPP,
        TEMPLATES.PENDING_PAYMENT_REMINDER,
        TEMPLATES.CONFIRMED_PAYMENT,
        TEMPLATES.WEBSITE_VISIT,
        TEMPLATES.FIRST_PURCHASE,
        TEMPLATES.SMS,
        TEMPLATES.WELCOME_NEW_CONTACTS,
        TEMPLATES.BIRTHDAY_GREETING,
        TEMPLATES.ABANDONED_CART,
        TEMPLATES.REVALIDATION_SUBSCRIBERS,
      ];

      function sortTemplateCards(templatesCardsUnsorted) {
        return templateCardOrder.reduce((templates, templateId) => {
          const matchingTemplate = templatesCardsUnsorted.find(({ IdAutomationTemplate }) => IdAutomationTemplate === templateId);
      
          // Verify template existence before to concatenate
          return matchingTemplate ? templates.concat(matchingTemplate) : templates;
        }, []);
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
