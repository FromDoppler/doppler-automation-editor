(function () {
  'use strict';

  angular
    .module('dopplerApp')
    .controller(
      'modalExportAutomationReportsCtrl',
      modalExportAutomationReportsCtrl
    );

  modalExportAutomationReportsCtrl.$inject = [
    '$scope',
    'close',
    'data',
    '$translate',
    'automationReportsService',
    'ModalService',
  ];

  function modalExportAutomationReportsCtrl(
    $scope,
    close,
    data,
    $translate,
    automationReportsService,
    ModalService
  ) {
    $scope.data = data;
    $scope.data.maxlength = $scope.data.maxlength || 70;
    $scope.data.required = $scope.data.required || false;
    $scope.data.patternErrorMessage = $translate.instant(
      'validation_messages.email'
    );

    $scope.close = function (isConfirmed) {
      if (!isConfirmed) {
        close();
      } else {
        $scope.saveAndClose();
      }
    };

    $scope.saveAndClose = function () {
      if ($scope.validationForm.$valid) {
        automationReportsService
          .exportAutomationReport(
            $scope.data.scheduledTaskId,
            $scope.data.selectedActionIds,
            $scope.data.typeReport,
            $scope.validationForm.fieldValue.$viewValue,
            $scope.data.optionTimePeriod
          )
          .then(function (response) {
            if (response) {
              close(response);
              ModalService.showModal({
                templateUrl: 'angularjs/partials/shared/modalWithOneLink.html',
                controller: 'ModalYesOrNoCtrl',
                inputs: {
                  data: {
                    title: $translate.instant('ExportReports.title'),
                    description: $translate.instant(
                      'ExportReports.description'
                    ),
                    description2: $translate.instant(
                      'ExportReports.description2'
                    ),
                    buttonLabel: $translate.instant(
                      'ExportReports.buttonLabel'
                    ),
                    buttonContainerClass: 'align-left',
                    buttonClass: 'button--primary',
                    actionLink: '/DownloadCenter/DownloadCenter',
                  },
                },
              });
            }
          });
      }
    };
  }
})();
