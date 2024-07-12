(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorWhatsapp', dpEditorWhatsapp);

  dpEditorWhatsapp.$inject = [
    'userFieldsDataservice',
    'automation',
    'warningsStepsService'
  ];

  function dpEditorWhatsapp(userFieldsDataservice, automation, warningsStepsService) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/dp-editor-whatsapp.html',
      link: link
    };

    

    return directive;

    function link(scope) {
      userFieldsDataservice.getPhoneCustoms()
        .then(function(data){
          if (data.length && userFieldsDataservice.isFieldDeleted(scope.component.field, data)) {
            scope.component.setData({ room: null, template: null, id: 0, name: '' });
            scope.component.checkCompleted();
            automation.checkCompleted();
            warningsStepsService.checkWarningStep(scope.component);
          }
        });
    }

    

  }
})();
