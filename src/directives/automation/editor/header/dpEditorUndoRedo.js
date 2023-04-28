(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorUndoredo', dpEditorUndoredo);

  dpEditorUndoredo.$inject = ['$rootScope', 'automation', 'changesManager'];

  function dpEditorUndoredo($rootScope, automation, changesManager) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/header/dp-editor-undoredo.html',
      controller: ['$scope', controller],
    };

    return directive;

    function controller($scope) {
      $scope.undoChanges = function () {
        $rootScope.$broadcast('COMPONENTS_LIST:HIDE');
        changesManager.undo();
        automation.toggleCollapsePanel(false);
      };

      $scope.redoChanges = function () {
        $rootScope.$broadcast('COMPONENTS_LIST:HIDE');
        changesManager.redo();
        automation.toggleCollapsePanel(false);
      };

      $scope.canUndo = changesManager.canUndo;
      $scope.canRedo = changesManager.canRedo;
    }
  }
})();
