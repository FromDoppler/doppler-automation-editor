(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorListsGrid', dpEditorListsGrid);

  dpEditorListsGrid.$inject = [
    '$rootScope',
    '$translate',
    'automation',
    'CHANGE_TYPE',
    'changesManager',
    'COMPONENT_TYPE',
    'gridService',
    'selectedElementsService',
    'utils',
    'warningsStepsService',
    'BLOCKED_STATUS',
  ];

  function dpEditorListsGrid(
    $rootScope,
    $translate,
    automation,
    CHANGE_TYPE,
    changesManager,
    COMPONENT_TYPE,
    gridService,
    selectedElementsService,
    utils,
    warningsStepsService,
    BLOCKED_STATUS
  ) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/dp-editor-lists-grid.html',
      controller: controller,
    };

    return directive;

    function controller($scope) {
      $scope.showHeader =
        $scope.$parent.showHeader !== undefined
          ? $scope.$parent.showHeader
          : true;
      $scope.blockedStatus = BLOCKED_STATUS.VALUE;
      var checked = false;
      var selectedItemOptions = {
        selectedItem: getSelectedItem(),
        keyToCompare: 'IdSubscribersList',
        keyChecked: 'IsChecked',
      };
      var selectedItemId = 0;
      if (
        selectedItemOptions.selectedItem &&
        selectedItemOptions.selectedItem.IdSubscribersList
      ) {
        selectedItemId = selectedItemOptions.selectedItem.IdSubscribersList;
      }

      $scope.listTitle =
        $scope.listTitle ||
        $translate.instant('automation_editor.lists_grid.title');
      $scope.showHelpLink = !$scope.listSubtitle;
      $scope.listSubtitle =
        $scope.listSubtitle ||
        $translate.instant('automation_editor.lists_grid.description');

      $scope.gridModel = gridService.initGrid({
        getDataUrl: '/Automation/Task/GetSubscribersLists',
        isSelectElementGrid: true,
        idListsOrSegmentFilter: 2,
        selectedItemOptions: selectedItemOptions,
      });

      $scope.gridModel.getLabels();
      $scope.gridModel.currentSort = 'LAST_SENT_DATE';
      $scope.gridModel.getListData();

      function getSelectedItem() {
        var selectedComponent = selectedElementsService.getSelectedComponent();
        if (selectedComponent) {
          if (selectedComponent.type === COMPONENT_TYPE.CONDITION) {
            return selectedElementsService.getSelectedConditional()
              .subscriptionList;
          } else if (selectedComponent.type === COMPONENT_TYPE.ACTION) {
            return selectedComponent.operation.suscriptionList;
          }
          return selectedComponent.suscriptionList;
        }
        return {};
      }

      $scope.selectRow = function (item) {
        if (
          !item.IsChecked &&
          (!this.isDisabled(item) || item.IdSubscribersList === selectedItemId)
        ) {
          var result = _.find($scope.gridModel.displayed, function (item) {
            return item.IsChecked === true;
          });
          if (result) {
            result.IsChecked = false;
          }
          item.IsChecked = true;
          $scope.gridModel.selectedItem = item;
          if (!checked) {
            $rootScope.$broadcast('SUSCRIPTION_LIST.ENABLE_BUTTON');
          }
          checked = true;
        }
      };

      $scope.isDisabled = function (row) {
        return row.ListStatus === $scope.blockedStatus;
      };

      $scope.isFirstSelected = function (row) {
        return row.IdSubscribersList === selectedItemId;
      };

      $scope.$on('COMPONENT_LIST.CONFIRM_SELECTION', function () {
        if (!$scope.gridModel.selectedItem) {
          return;
        }
        var data;
        var newComponentData;
        var oldComponentData;
        var path;
        var selectedComponent = selectedElementsService.getSelectedComponent();

        if (selectedComponent.type === COMPONENT_TYPE.ACTION) {
          path = 'operation.suscriptionList';
          data = {
            operation: {
              suscriptionList: $scope.gridModel.selectedItem,
            },
          };
        } else {
          path = 'suscriptionList';
          data = {
            suscriptionList: $scope.gridModel.selectedItem,
          };
        }

        oldComponentData = JSON.parse(
          JSON.stringify(utils.getDeepValue(selectedComponent, path))
        );
        selectedComponent.setData(data);
        newComponentData = JSON.parse(
          JSON.stringify(utils.getDeepValue(selectedComponent, path))
        );

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: selectedComponent.uid,
          key: path,
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData),
        });

        selectedComponent.checkCompleted();
        automation.checkCompleted();
        automation.checkActionsCompleted();
        warningsStepsService.checkWarningStep(selectedComponent);
      });

      $scope.$on('CONDITIONAL_LIST.CONFIRM_SELECTION', function () {
        var selectedConditional;

        if (!$scope.gridModel.selectedItem) {
          return;
        }
        selectedConditional = selectedElementsService.getSelectedConditional();
        selectedConditional.setData({
          subscriptionList: $scope.gridModel.selectedItem,
        });
      });
    }
  }
})();
