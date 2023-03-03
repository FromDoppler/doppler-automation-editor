(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorListsScheduledGrid', dpEditorListsScheduledGrid);

  dpEditorListsScheduledGrid.$inject = [
    'CHANGE_TYPE',
    'changesManager',
    'gridService',
    'selectedElementsService',
    'LIST_SELECTION_STATE',
    'automation',
    '$translate',
    'BLOCKED_STATUS'
  ];

  function dpEditorListsScheduledGrid(CHANGE_TYPE, changesManager, gridService, selectedElementsService,
    LIST_SELECTION_STATE, automation, $translate, BLOCKED_STATUS) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/automation/editor/directives/dp-editor-lists-scheduled-grid.html',
      controller: controller
    };

    return directive;

    function controller($scope) {
      var selectedComponent = selectedElementsService.getSelectedComponent();
      $scope.blockedStatus = BLOCKED_STATUS.VALUE;
      $scope.checkedRows = [];
      var oldComponentData = JSON.parse(JSON.stringify({
        allSubscribers: selectedComponent.allSubscribers,
        suscriptionLists: selectedComponent.suscriptionLists
      }));
      var automationModel = automation.getModel();
      var selectedItemOptions = {
        selectedItems: JSON.parse(JSON.stringify(selectedComponent.operation ?
          selectedComponent.operation.suscriptionLists : selectedComponent.suscriptionLists)),
        keyToCompare: 'IdSubscribersList',
        keyChecked: 'IsChecked'
      };
      $scope.listTitle = $scope.listTitle || $translate.instant('automation_editor.lists_scheduled_grid.title');
      $scope.listSubtitle = $scope.listSubtitle || $translate.instant('automation_editor.lists_scheduled_grid.description');

      $scope.showSelectAll = !selectedComponent.operation;
      $scope.gridModel = gridService.initGrid({
        getDataUrl: '/Automation/Task/GetSubscribersLists',
        isSelectElementGrid: true,
        selectedItemOptions: selectedItemOptions,
        // value 2 show only lists
        idListsOrSegmentFilter: $scope.showSelectAll ? 0 : 2,
        automationId: selectedComponent.operation
        && !automationModel.initialCondition.allSubscribers ? automationModel.id : 0
      });
      $scope.gridModel.selectAllSubscribers = selectedComponent.allSubscribers;
      $scope.gridModel.getLabels(true);
      $scope.gridModel.currentSort = 'LAST_SENT_DATE';
      $scope.gridModel.getListData();
      
      $scope.gridModel.selectedItems.forEach(function (e) {
        $scope.checkedRows.push(e.IdSubscribersList);
      })

      $scope.selectRow = function(item) {
        if (!document.getElementById('checkbox-' + item.IdSubscribersList).disabled) {
          var result;
          item.IsChecked = !item.IsChecked;
          if (item.IsChecked) {
            $scope.gridModel.selectedItems.push(item);
          } else {
            result = _.reject($scope.gridModel.selectedItems, function(data){
              return data.IdSubscribersList && data.IdSubscribersList === item.IdSubscribersList;
            });
            if (!Array.isArray(result)) {
              $scope.gridModel.selectedItems = [];
              $scope.gridModel.selectedItems.push(result);
            } else {
              $scope.gridModel.selectedItems = result;
            }
          }
        }
      };

      $scope.saveSelectedItems = function() {
        var data = {};
        if ($scope.gridModel.selectAllSubscribers) {
          data = {
            allSubscribers: true,
            suscriptionLists: []
          };
        } else if ($scope.gridModel.selectedItems.length) {
          data = {
            allSubscribers: false,
            suscriptionLists: $scope.gridModel.selectedItems
          };
        }

        if (!$scope.showSelectAll) {
          selectedComponent.operation.setData(data);
        } else {
          selectedComponent.setData(data);
          automation.checkActionsCompleted();
        }

        var newComponentData = JSON.parse(JSON.stringify({
          allSubscribers: selectedComponent.allSubscribers,
          suscriptionLists: selectedComponent.suscriptionLists
        }));

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: selectedComponent.uid,
          key: 'suscriptionLists.allSubscribers',
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData)
        });

        automation.checkCompleted();

        $scope.backToEditor();
      };

      $scope.backToEditor = function() {
        $scope.toggleListSelection(LIST_SELECTION_STATE.NONE);
      };

      $scope.IsDisabledRowStatus = function(row) {
        return row.ListStatus == $scope.blockedStatus && !row.IsChecked && !$scope.checkedRows.includes(row.IdSubscribersList);
      }; 
    }
  }
})();
