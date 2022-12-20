(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .directive('dpDkimSection', dpDkimSection);

  dpDkimSection.$inject = [
    'ModalService',
    'gridService',
    '$translate',
    'dkimService',
    '$timeout',
    'REGEX'
  ];

  function dpDkimSection(ModalService, gridService, $translate, dkimService, $timeout, REGEX) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/controlPanel/directives/dkim.html',
      link: link
    };

    return directive;

    function link($scope) {
      var selectedItemOptions = {
        selectedItem: {},
        keyToCompare: 'IdSubscribersList',
        keyChecked: 'IsChecked'
      };
      $scope.Enums = Enums;
      $scope.domainRegex = REGEX.DOMAIN;
      $scope.maxDomains = $scope.$root.maxDomains;

      $scope.gridModel = gridService.initGrid({
        getDataUrl: '/ControlPanel/AdvancedPreferences/GetUserDKIMList',
        isSelectElementGrid: true,
        idListsOrSegmentFilter: 2,
        selectedItemOptions: selectedItemOptions
      });

      $scope.gridModel.getLabels();
      $scope.gridModel.currentSort = 'CREATION_DATE';
      $scope.gridModel.getListData();

      $scope.openPopup = function() {
        return ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalCreateDkim.html',
          controller: 'ModalCreateDkimCtrl',
          inputs: {
            data: {
              title: $translate.instant('control_panel.dkim.add_domain.title'),
              description: $translate.instant('control_panel.dkim.add_domain.subtitle'),
              domainCurrentList: $scope.gridModel.displayed,
              domainRegex: $scope.domainRegex
            }
          }
        }).then(function(modal) {
          modal.close.then(function(response) {
            if (response.newDomain) {
              $scope.gridModel.displayed = _.union([response.newDomain], $scope.gridModel.displayed);
              if (response.newDomain.DomainStatus !== Enums.DkimState.ADMIN_VALIDATION){
                $scope.configureDkim(response.newDomain);
              }
            }
          });
        });
      };

      $scope.selectRow = function(item) {
        if (!item.IsDefault) {
          var result = _.find($scope.gridModel.displayed, function(other){
            return other.IsDefault === true;
          });
          if (result) {
            result.IsDefault = false;
          }
          item.IsDefault = true;
          $scope.gridModel.selectedItem = item;
          dkimService.setDefault(item);
        }
      };

      $scope.getStatusText = function(row) {
        if (row) {
          switch (Number(row.DomainStatus)) {
          case Enums.DkimState.DISABLED:
            row.statusDisplayed = $translate.instant('control_panel.dkim.grid_states.inactive');
            break;
          case Enums.DkimState.ENABLED:
            row.statusDisplayed = $translate.instant('control_panel.dkim.grid_states.active');
            break;
          case Enums.DkimState.NO_USER_CONF:
            row.statusDisplayed = $translate.instant('control_panel.dkim.grid_states.missing_user_conf');
            break;
          case Enums.DkimState.ADMIN_VALIDATION:
            row.statusDisplayed = $translate.instant('control_panel.dkim.grid_states.waiting_admin_validation');
            break;
          default:
            throw new Error('Status with unknown number cannot be parsed.');
          }
          return row.statusDisplayed;
        }
      };

      $scope.change = function(row) {
        $scope.getStatusText();
        dkimService.setEnabledState(row);
        $scope.trySetNewDefault(row);
      };

      $scope.deleteRowConfirmed = function(row) {
        row.deleting = false;
        dkimService.deleteDkim(row).then(function(response) {
          if (response.success) {
            $scope.trySetNewDefault(row);
            $scope.gridModel.displayed = _.without($scope.gridModel.displayed, row);
          }
        });
      };

      $scope.configureDkim = function(row) {
        return ModalService.showModal({
          templateUrl: 'angularjs/partials/shared/modalConfigureDkim.html',
          controller: 'ModalConfigureDkimCtrl',
          inputs: {
            data: {
              title: $translate.instant('control_panel.dkim.configure_domain.title'),
              description: row.DomainName,
              model: row
            }
          }
        }).then(function(modal) {
          modal.close.then(function(response) {
            if (response.verified) {
              updateRowStatus(response);
            }
          });
        });
      };

      $scope.trySetNewDefault = function(row) {
        if (row.IsDefault || _.find($scope.gridModel.displayed, function(item) {
          return item.IsDefault === true;
        }) === undefined) {
          row.IsDefault = false;
          //find enabled rows and get last of them
          var enabledRows = _.filter($scope.gridModel.displayed, function(item) {
            return item.DomainStatus === $scope.Enums.DkimState.ENABLED;
          });

          if (enabledRows.length > 0) {
            var newDefaultRow = enabledRows[enabledRows.length - 1];
            newDefaultRow.IsDefault = true;
            dkimService.setDefault(newDefaultRow);
          }
        }
      };

      function updateRowStatus(row) {
        var gridRow = _.find($scope.gridModel.displayed, function(item) {
          return item.DomainId === row.DomainId;
        });
        gridRow.DkimStatus = row.DkimStatus;
        gridRow.SpfStatus = row.SpfStatus;
        gridRow.DomainStatus = row.DomainStatus;
        gridRow.LastValidationDate = row.LastValidationDate;
      }

      $scope.verify = function(row) {
        row.validating = true;
        dkimService.verifyDomain(row.DomainId).then(function(response) {
          if (response.data.success) {
            updateRowStatus(response.data.row);
          }
          row.validating = false;
        });
      };
    }
  }
})();
