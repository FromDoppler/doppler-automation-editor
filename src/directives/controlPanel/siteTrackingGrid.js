(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .directive('siteTrackingGrid', siteTrackingGrid);

  siteTrackingGrid.$inject = [
    'gridService',
    'automationDataservice',
    'siteTrackingService',
    'PUSH_CONFIGURATION_STATUS',
  ];

  function siteTrackingGrid(
    gridService,
    automationDataservice,
    siteTrackingService,
    PUSH_CONFIGURATION_STATUS
  ) {
    var directive = {
      restrict: 'E',
      templateUrl: 'angularjs/partials/controlPanel/siteTrackingGrid.html',
      link: link,
      scope: {
        domains: '=',
        openEditDomain: '&',
        formatData: '&',
        openTrackingCode: '&',
        verifyDomain: '&',
      },
    };

    return directive;

    function link($scope) {
      automationDataservice.getSettings().then(function (response) {
        $scope.isPushEnable = response.data.isPushEnable;
      });
      $scope.isPendingVerify = false;

      $scope.closeErrorMessage = function (domain) {
        domain.cantDelete = false;
        domain.showConfirmDelete = false;
      };

      $scope.openDeleteDomain = function (domain) {
        if (!domain.CanBeDeleted) {
          domain.cantDelete = true;
        } else {
          domain.showConfirmDelete = true;
        }
      };

      $scope.deleteDomain = function (domain) {
        siteTrackingService
          .deleteDomain(domain.IdDomain)
          .then(function (domainsUpdated) {
            if (domainsUpdated) {
              $scope.domains = $scope.formatData({ data: domainsUpdated });
              domain.showConfirmDelete = false;
            }
          });
      };

      $scope.getIconStatus = function (status) {
        var icon = '';
        switch (status) {
          case 'verified':
            icon = 'icon-check';
            break;
          case 'pending':
            icon = 'icon-pending';
            break;
          case 'error':
            icon = 'icon-warning';
            break;
          default:
            break;
        }
        return icon;
      };

      $scope.getIconStatusPush = function (statusPush) {
        var icon = '';
        switch (statusPush) {
          case 'verified':
            icon = 'icon-check';
            break;
          case 'error':
            icon = 'icon-info-icon dp-color-green';
            break;
          default:
            icon = 'icon-pending';
            break;
        }
        return icon;
      };
    }
  }
})();
