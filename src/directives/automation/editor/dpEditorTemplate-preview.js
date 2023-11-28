(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpEditorTemplatePreview', dpEditorTemplatePreview);

    dpEditorTemplatePreview.$inject = [
    'taskService',
    '$window',
    '$translate',
  ];

  function dpEditorTemplatePreview(taskService, $window, $translate) {
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

      scope.getRange = function(count) {
        return Array.from({ length: count }, (_, index) => index);
      };

      scope.translationExists = function(translationKey) {
        return $translate.instant(translationKey) !== translationKey;
      };
    
      scope.getItemTranslationKey = function(idAutomationTemplateSelected, index) {
        return 'automationTemplates.templatePreview.template_' + idAutomationTemplateSelected + '_allow_item' + index;
      };
    }
  }
})();
