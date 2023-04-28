(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorGoto', dpEditorGoto);

  dpEditorGoto.$inject = ['goToService'];

  function dpEditorGoto(goToService) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '=',
      },
      templateUrl:
        'angularjs/partials/automation/editor/directives/components/dp-editor-goto.html',
      link: link,
    };

    return directive;

    function link(scope, element) {
      var selectedComponent = scope.component;

      scope.$on('AUTOMATION_SAVED', function () {
        scope.component.hasUnsavedChanges = false;
      });

      scope.removeGotoComponent = function (component) {
        goToService.removeGotoLine(selectedComponent.uid);
        goToService.markComponentInGotoSelection(
          selectedComponent.goto,
          false,
          ['goto-connected']
        );
        scope.$parent.removeComponent(component);
      };

      // draw go to line
      // TODO: improve method to start to draw the lines, now is waiting 1,5 seg.
      // try to create a logic than after create the last element at the tree on the canvas
      // send a signal to start to draw all the lines
      setTimeout(function () {
        if (selectedComponent.goto !== 0) {
          goToService.removeGotoLine(selectedComponent.uid);
          selectedComponent.line = goToService.drawGoToLineBetweenComponents({
            sourceComponentUid: selectedComponent.uid,
            targetComponentUid: selectedComponent.goto,
          });
          goToService.addGotoLine(selectedComponent.uid, selectedComponent);
        }
      }, 1500);
    }
  }
})();
