(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('modalReplicateAutomationCtrl', modalReplicateAutomationCtrl);

  modalReplicateAutomationCtrl.$inject = [
    '$scope',
    'close',
    'data',
    'taskService',
    '$translate',
  ];

  function modalReplicateAutomationCtrl(
    $scope,
    close,
    data,
    taskService,
    $translate
  ) {
    $scope.data = data;
    $scope.lastAutomationTypeSelected = null;
    $scope.automationTypesList = [];

    function moveToFirstPosition(types, idItemToMove) {
      var index = types.findIndex(function (item) {
        return item.Id == idItemToMove;
      });

      // if item to move does not exists in the array
      if (index === -1) {
        return types;
      }

      // remove items (it will be only one)
      var itemsToMove = types.splice(index, 1);
      // add item to the beginning
      types.unshift(itemsToMove[0]);
      return types;
    }

    taskService
      .getAutomationTypeList($scope.data.automationTaskType)
      .then(function (automationTypes) {
        var mappedTypes = automationTypes
          .filter(function (t) {
            return !!t.EnableToReplication;
          })
          .map(function (t) {
            return {
              Id: t.Type,
              Name: $translate.instant('automationTypes.info.title' + t.Type),
            };
          });
        mappedTypes = moveToFirstPosition(
          mappedTypes,
          $scope.data.automationTaskType
        );
        $scope.automationTypesList = mappedTypes;
        $scope.lastAutomationTypeSelected = mappedTypes[0];
      });

    $scope.close = function (result) {
      close(result);
    };

    $scope.onAutomationTypeSelect = function (automationTypeSelected) {
      $scope.lastAutomationTypeSelected = automationTypeSelected;
    };

    $scope.createReplica = function () {
      taskService
        .createReplica(
          $scope.data.idScheduledTask,
          $scope.lastAutomationTypeSelected.Id
        )
        .then(function (response) {
          if (response.success) {
            $scope.close({
              success: true,
              idScheduledTask: response.idScheduledTask,
              scheduledTaskType: response.scheduledTaskType,
            });
          } else {
            // TODO: show some possible error?
          }
        });
    };
  }
})();
