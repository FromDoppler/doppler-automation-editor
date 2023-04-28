(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDomainsGrid', dpEditorDomainsGrid);

  dpEditorDomainsGrid.$inject = [
    'CHANGE_TYPE',
    'changesManager',
    'gridService',
    'selectedElementsService',
    'automation',
    '$translate',
    'DOMAINS_SELECTION_STATE',
  ];

  function dpEditorDomainsGrid(
    CHANGE_TYPE,
    changesManager,
    gridService,
    selectedElementsService,
    automation,
    $translate,
    DOMAINS_SELECTION_STATE
  ) {
    var directive = {
      restrict: 'E',
      templateUrl:
        'angularjs/partials/automation/editor/directives/dp-editor-domains-grid.html',
      controller: controller,
    };

    return directive;

    function controller($scope) {
      $scope.isLoading = true;
      $scope.gridLoading = true;

      var selectedComponent = selectedElementsService.getSelectedComponent();

      var oldComponentData = JSON.parse(
        JSON.stringify({
          domains: selectedComponent.domains,
        })
      );

      var selectedItemOptions = {
        selectedItems: JSON.parse(
          JSON.stringify(
            selectedComponent.operation
              ? selectedComponent.operation.domains
              : selectedComponent.domains
          )
        ),
        keyToCompare: 'IdDomain',
        keyChecked: 'IsChecked',
      };

      var automationModel = automation.getModel();

      $scope.gridModel = gridService.initGrid({
        getDataUrl: '/Automation/Task/GetPushValidDomains',
        isSelectElementGrid: true,
        selectedItemOptions: selectedItemOptions,
        automationId: selectedComponent.operation ? automationModel.id : 0,
      });

      $translate.onReady().then(function () {
        loadData();
      });

      function loadData() {
        $scope.gridModel.getListData().then(function () {
          $scope.isLoading = false;
          $scope.gridLoading = false;
        });
      }

      $scope.selectRow = function (item) {
        if (!document.getElementById('checkbox-' + item.IdDomain).disabled) {
          var result;
          item.IsChecked = !item.IsChecked;
          if (item.IsChecked) {
            $scope.gridModel.selectedItems.push(item);
          } else {
            result = _.reject($scope.gridModel.selectedItems, function (data) {
              return data.IdDomain && data.IdDomain === item.IdDomain;
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

      $scope.saveSelectedItems = function () {
        var data = {};
        if ($scope.gridModel.selectedItems.length) {
          data = {
            domains: $scope.gridModel.selectedItems,
          };
        }

        selectedComponent.setData(data);
        automation.checkActionsCompleted();

        var newComponentData = JSON.parse(
          JSON.stringify({
            domains: selectedComponent.domains,
          })
        );

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: selectedComponent.uid,
          key: 'EditorDomainGrid',
          oldValue: angular.copy(oldComponentData),
          newValue: angular.copy(newComponentData),
        });

        $scope.backToEditor();
      };

      $scope.backToEditor = function () {
        $scope.toggleDomainsSelection(DOMAINS_SELECTION_STATE.HIDING);
      };
    }
  }
})();
