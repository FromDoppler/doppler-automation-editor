(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorSave', dpEditorSave);

  dpEditorSave.$inject = [
    '$interval',
    '$translate',
    'automation',
    'changesManager',
    '$location',
  ];

  function dpEditorSave(
    $interval,
    $translate,
    automation,
    changesManager,
    $location
  ) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/header/dp-editor-save.html',
      controller: ['$scope', controller],
    };

    return directive;

    function controller($scope) {
      var interval;
      var timerAutoSave = 60000;
      var classes = {
        SAVE: 'icon-editor-save',
        SAVING: 'icon-editor-saving',
        SAVED: 'icon-check',
      };
      $scope.resources = {
        SAVE: $translate.instant('actions.save'),
        SAVING: $translate.instant('automation_editor.saving'),
        SAVED: $translate.instant('automation_editor.saved'),
      };
      $scope.rootComponent = automation.getModel();
      $scope.stateText = $scope.resources.SAVED;
      $scope.stateClass = classes.SAVED;
      $scope.disabled = true;
      automation.setIsProcessing(false);

      $scope.$watch(
        changesManager.getUnsavedChanges,
        function (areUnsavedChanges) {
          if (areUnsavedChanges) {
            $scope.stateText = $scope.resources.SAVE;
            $scope.stateClass = classes.SAVE;
            $scope.disabled = false;
          }
        }
      );

      $scope.saveChanges = function () {
        if (
          $scope.stateText !== $scope.resources.SAVE ||
          !changesManager.getUnsavedChanges() ||
          automation.getIsProcessing()
        ) {
          return;
        }
        $scope.stateText = $scope.resources.SAVING;
        $scope.stateClass = classes.SAVING;
        automation.saveChanges().then(function () {
          updateSavingState();
        });
      };

      function updateSavingState() {
        var idScheduledTask;
        var automationType;
        var urlParams = $location.search();
        $scope.disabled = true;
        $scope.stateText = $scope.resources.SAVED;
        $scope.stateClass = classes.SAVED;
        changesManager.setUnsavedChanges(false);
        if (urlParams.idTaskType) {
          idScheduledTask = automation.getModel().id;
          automationType = automation.getModel().automationType;
          $location.search('idTaskType', null);
          $location.search('idScheduledTask', idScheduledTask);
          $location.search('automationType', automationType);
          $location.replace();
        }
      }

      //Autosave every 1 minute
      interval = $interval(function () {
        if (changesManager.getUnsavedChanges()) {
          $scope.saveChanges();
        }
      }, timerAutoSave);

      $scope.$on('UPDATE_SAVING_STATE', updateSavingState);

      $scope.$on('$destroy', function () {
        if (angular.isDefined(interval)) {
          $interval.cancel(interval);
          interval = undefined;
        }
      });
    }
  }
})();
