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
    'AUTOMATION_VIEW',
    'gridService',
    'ModalService',
    '$window'
  ];

  function AutomationGridCtrl($scope, _, $translate, AUTOMATION_STATE, AUTOMATION_TYPE, AUTOMATION_VIEW, gridService, modalService, $window) {
    $scope.isLoading = true;
    $scope.rows = 10;
    $scope.tasksQuantity = '';
    $scope.totalTasks = 0;
    $scope.idAutomationTemplateSelected = -1;
    $scope.lang = mainMenuData.user.lang;
    $scope.AUTOMATION_VIEW = AUTOMATION_VIEW;
    $scope.AUTOMATION_STATE = AUTOMATION_STATE;
    $scope.AUTOMATION_TYPE = AUTOMATION_TYPE;
    $scope.automationView = getViewByUrl();
    $scope.gridModel = gridService.initGrid({
      getDataUrl: '/Automation/Automation/GetAutomationTasks',
      deleteRowUrl: '/Automation/Task/DeleteTask'
    });

    $translate.onReady().then(function() {
      $scope.gridModel.currentSort = 'CREATION_DATE';
      loadData();
    });

    const baseUrl = $window.location.protocol.concat('//')
      .concat($window.location.host)
      .concat('/Automation/Automation/AutomationApp/');

    function loadData() {
      $scope.gridModel.getListData().then(function(response) {
        $scope.totalTasks = $scope.totalTasks === 0 ? response.data.tasksQuantity : $scope.totalTasks;
        $scope.isRegistrationCompleted = response.data.IsRegistrationCompleted;
        $scope.isLoading = false;
        $scope.gridLoading = false;
        $scope.replicateAutomationEnabled = response.data.ReplicateAutomationEnabled;
        if($scope.totalTasks === 0) {
          $scope.automationViewNavegate($scope.AUTOMATION_VIEW.TEMPLATES);
        }
      });
    }

    $scope.automationViewNavegate = function(navegate) {
      if(navegate) {
        $scope.automationView = navegate;
        const newUrl = baseUrl.concat(navegate);
        $window.history.pushState({ automationView : navegate }, '', newUrl);
      }
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
          if($scope.totalTasks === 0) {
            $scope.automationViewNavegate($scope.AUTOMATION_VIEW.TEMPLATES);
          }
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

    function getViewByUrl(){
      return  $window.location.href.indexOf("/selectAutomationType") > 0 ? $scope.AUTOMATION_VIEW.TYPES:
        $window.location.href.indexOf("/selectAutomationTemplate") > 0 ? $scope.AUTOMATION_VIEW.TEMPLATES: $scope.AUTOMATION_VIEW.GRID;
    }

    window.addEventListener("popstate", function (evt) {
      $scope.automationView = getViewByUrl();
      $scope.$apply();
    });

    $scope.setAutomationTemplateSelected = function (idAutomationTemplateSelected) {
      $scope.idAutomationTemplateSelected = idAutomationTemplateSelected;
    }
  }

})();
