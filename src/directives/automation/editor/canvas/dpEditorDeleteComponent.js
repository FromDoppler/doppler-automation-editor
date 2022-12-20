(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDeleteComponent', dpEditorDeleteComponent);

  function dpEditorDeleteComponent() {
    var directive = {
      link: link,
      restrict: 'E',
      scope: {
        onDeleteComponent: '&',
        onClickIcon: '&',
        clickValidation: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/canvas/dp-editor-delete-component.html'
    };

    return directive;

    function link(scope, element) {
      var actionsContainer = element.parent();

      actionsContainer.parent().bind('mouseleave', function() {
        if (scope.showConfirmation) {
          element[0].classList.toggle("remove-component-confirmation");
          scope.$apply(function() {
            scope.showConfirmation = false;
            scope.$root.$broadcast('DELETE_COMPONENT_HIDE_CONFIRMATION');
          });
        }
      });

      scope.toggleConfirmation = function(value) {
        if (scope.clickValidation && !scope.onClickIcon() && value) {
          return;
        } else if (value !== scope.showConfirmation) {
          element[0].classList.toggle("remove-component-confirmation");
        }
        
        scope.showConfirmation = value;
        scope.$root.$broadcast(value ? 'DELETE_COMPONENT_SHOW_CONFIRMATION' : 'DELETE_COMPONENT_HIDE_CONFIRMATION');
      };
    }
  }
})();
