(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller('landingPagesDomainsCtrl', landingPagesDomainsCtrl);

  landingPagesDomainsCtrl.$inject = [
    '$scope',
    '$translate',
    'customDomainService',
    'gridService',
    'ModalService',
  ];

  function landingPagesDomainsCtrl(
    $scope,
    $translate,
    customDomainService,
    gridService,
    ModalService
  ) {
    $scope.isLoading = true;
    $scope.showDeleteError = false;
    $scope.deleteErrorMessage = '';
    $scope.processing = false;

    $translate.onReady().then(function () {
      loadGridModel();
    });

    function loadGridModel() {
      var selectedItemOptions = {
        selectedItem: {},
        keyToCompare: 'IdSubscribersList',
        keyChecked: 'IsChecked',
      };
      $scope.gridModel = gridService.initGrid({
        getDataUrl: '/Lists/MasterCustomDomain/GetAll',
        isSelectElementGrid: true,
        idListsOrSegmentFilter: 2,
        selectedItemOptions: selectedItemOptions,
      });
      $scope.gridModel.getListData().then(function () {
        $scope.isLoading = false;
      });
    }

    $scope.getStatusText = function (row) {
      if (!row) {
        return '';
      }
      switch (Number(row.IdDomainVerificationStatus)) {
        case Enums.domainVerificationStatus.CONFIGURATIONERROR:
          return $translate.instant(
            'landing_pages_domains.grid.status.configuration_error'
          );
        case Enums.domainVerificationStatus.VERIFIED:
          return $translate.instant(
            'landing_pages_domains.grid.status.verified'
          );
        case Enums.domainVerificationStatus.NOTCONFIGURED:
          return (row.statusDisplayed = $translate.instant(
            'landing_pages_domains.grid.status.unconfigured'
          ));
        case Enums.domainVerificationStatus.PENDING:
          return (row.statusDisplayed = $translate.instant(
            'landing_pages_domains.grid.status.pending'
          ));
        default:
          throw new Error('Unknown domain verification status.');
      }
    };

    $scope.getStatusIconClass = function (row) {
      if (!row) {
        return '';
      }
      switch (Number(row.IdDomainVerificationStatus)) {
        case Enums.domainVerificationStatus.CONFIGURATIONERROR:
          return 'icon-warning';
        case Enums.domainVerificationStatus.VERIFIED:
          return 'icon-check';
        case Enums.domainVerificationStatus.NOTCONFIGURED:
          return 'icon-clock';
        case Enums.domainVerificationStatus.PENDING:
          return 'icon-pending';
        default:
          throw new Error('Unknown domain verification status.');
      }
    };

    $scope.openCreationModal = function () {
      return ModalService.showModal({
        templateUrl:
          'angularjs/partials/controlPanel/landing-pages-domains/createCustomDomain.html',
        controller: 'createCustomDomainCtrl',
      }).then(function (modal) {
        modal.close.then(function (newDomain) {
          if (newDomain) {
            $scope.gridModel.displayed.unshift(newDomain);
            $scope.openConfigurationModal($scope.gridModel.displayed[0]);
          }
        });
      });
    };

    $scope.openConfigurationModal = function (row) {
      return ModalService.showModal({
        templateUrl:
          'angularjs/partials/controlPanel/landing-pages-domains/configureCustomDomain.html',
        controller: 'configureCustomDomainCtrl',
        inputs: {
          data: {
            model: row,
            formDopplerPagesDomain: $scope.formDopplerPagesDomain,
          },
        },
      }).then(function (modal) {
        modal.close.then(function (domainData) {
          if (domainData) {
            $scope.updateRow(domainData);
            if (
              domainData.IdDomainVerificationStatus !==
              Enums.domainVerificationStatus.VERIFIED
            ) {
              $scope.openDomainVerificationErrorModal();
            }
          }
        });
      });
    };

    $scope.verify = function (row) {
      row.validating = true;
      $scope.processing = true;
      customDomainService
        .verify(row.IdCustomDomain)
        .then(function (response) {
          row.validating = false;
          $scope.processing = false;
          $scope.updateRow(response);
          if (
            response.IdDomainVerificationStatus !==
            Enums.domainVerificationStatus.VERIFIED
          ) {
            $scope.openDomainVerificationErrorModal();
          }
        })
        .catch(function () {
          row.validating = false;
          $scope.processing = false;
        });
    };

    $scope.updateRow = function (row) {
      var gridRow = _.find($scope.gridModel.displayed, function (item) {
        return item.IdCustomDomain === row.IdCustomDomain;
      });
      gridRow.IdDomainVerificationStatus = row.IdDomainVerificationStatus;
      gridRow.IdDomainStatus = row.IdDomainStatus;
      gridRow.VerifiedAt = row.VerifiedAt;
    };

    $scope.openDomainVerificationErrorModal = function () {
      return ModalService.showModal({
        templateUrl:
          'angularjs/partials/controlPanel/landing-pages-domains/domainVerificationError.html',
        controller: 'domainVerificationErrorCtrl',
        inputs: {
          data: {
            formDopplerPagesDomain: $scope.formDopplerPagesDomain,
          },
        },
      });
    };

    $scope.toggleDeleteConfirmation = function (row, value) {
      hideDeleteErrorMessage();
      row.deleting = value;
    };

    $scope.delete = function (row) {
      customDomainService
        .delete(row.IdCustomDomain)
        .then(function () {
          $scope.gridModel.displayed = _.without(
            $scope.gridModel.displayed,
            row
          );
          row.deleting = false;
        })
        .catch(function (response) {
          if (response.data.error === 'CustomDomainAssociatedToAForm') {
            showDeleteErrorMessage(
              $translate.instant(
                'landing_pages_domains.delete.error.form_associated'
              )
            );
          } else {
            showDeleteErrorMessage(
              $translate.instant('landing_pages_domains.delete.error.default')
            );
          }
        });
    };

    function showDeleteErrorMessage(message) {
      $scope.showDeleteError = true;
      $scope.deleteErrorMessage = message;
    }

    function hideDeleteErrorMessage() {
      $scope.showDeleteError = false;
      $scope.deleteErrorMessage = '';
    }
  }
})();
