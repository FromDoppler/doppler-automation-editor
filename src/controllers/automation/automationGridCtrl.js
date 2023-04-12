(function() {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .controller('AutomationGridCtrl', AutomationGridCtrl);

  AutomationGridCtrl.$inject = [
    '$scope',
    '_',
    '$translate',
    'AUTOMATION_STATE',
    'AUTOMATION_TYPE',
    'gridService',
    'ModalService',
    '$window'
  ];

  function AutomationGridCtrl($scope, _, $translate, AUTOMATION_STATE, AUTOMATION_TYPE, gridService, modalService, $window) {
    $scope.isLoading = true;
    $scope.rows = 10;
    $scope.tasksQuantity = '';
    $scope.totalTasks = 0;
    $scope.createNewAutomationView =  $window.location.href.indexOf("/selectAutomation") > 0;
    $scope.AUTOMATION_STATE = AUTOMATION_STATE;
    $scope.AUTOMATION_TYPE = AUTOMATION_TYPE;
    $scope.gridModel = gridService.initGrid({
      getDataUrl: '/Automation/Automation/GetAutomationTasks',
      deleteRowUrl: '/Automation/Task/DeleteTask'
    });

    $translate.onReady().then(function() {
      $scope.gridModel.currentSort = 'CREATION_DATE';
      loadData();
    });

    function loadData() {
      $scope.gridModel.getListData().then(function(response) {
        $scope.totalTasks = $scope.totalTasks === 0 ? response.data.tasksQuantity : $scope.totalTasks;
        $scope.isRegistrationCompleted = response.data.IsRegistrationCompleted;
        $scope.isLoading = false;
        $scope.gridLoading = false;
        $scope.replicateAutomationEnabled = response.data.ReplicateAutomationEnabled;
      });
    }

    $scope.createNewAutomation = function(value) {
      $window.history.pushState({ createNewAutomationView: value }, '', window.location.href.concat('selectAutomation'));
      $scope.createNewAutomationView =  value;
    }

    $scope.disableDeletedRows = function() {
      _.each($scope.gridModel.displayed, function(row) {
        row.deleting = false;
      });
    };

    $scope.deleteRowConfirmed = function(row) {
      $scope.gridModel.deleteRow(row, 'IdScheduledTask', {idTask: row.IdScheduledTask} ).then(function(response){
        if (response.data.success) {
          $scope.totalTasks--;
        }
      });
    };

    $scope.getStatusText = function(row) {
      updateDisplayedStatus(row);
      return row.statusDisplayed;
    };

    $scope.getImageText = function(row) {
      updateDisplayedStatus(row);
      return row.imageText;
    };

    $scope.openReplicationPopup = function (idScheduledTask, automationTaskType) {
      return modalService.showModal({
        templateUrl: 'angularjs/partials/shared/modalReplicateAutomation.html',
        controller: 'modalReplicateAutomationCtrl',
        inputs: {
          data: {
            idScheduledTask: idScheduledTask,
            automationTaskType: automationTaskType,
          }
        }
      }).then(function (modal) {
        modal.close.then(function (closeModalResult) {
          if (closeModalResult.success) {
            $window.location.href = '/Automation/EditorConfig?idScheduledTask=' + closeModalResult.idScheduledTask + '&automationType=' + closeModalResult.scheduledTaskType;
          }
        });
      });
    };

    function updateDisplayedStatus(item) {
      switch (Number(item.StatusId)) {
      case 1:
        item.statusDisplayed = $translate.instant('automation_grid_status.active');
        item.imageText = 'active';
        break;
      case 2:
        item.statusDisplayed = $translate.instant('automation_grid_status.paused');
        item.imageText = 'paused';
        break;
      case 5:
        item.statusDisplayed = $translate.instant('automation_grid_status.draft');
        item.imageText = 'draft';
        break;
      case 6:
        item.statusDisplayed = $translate.instant('automation_grid_status.stopped');
        item.imageText = 'stop';
        break;
      default:
        throw new Error('Status with unknown number cannot be parsed.');
      }
    }

    window.addEventListener("popstate", function () {
      $scope.createNewAutomationView = $window.location.href.indexOf("/selectAutomation") > 0;
      $scope.$apply();
    });
  }

})();
