(function () {
  'use strict';

  angular
    .module('dopplerApp.automation')
    .controller(
      'automationCompleteInformationCtrl',
      automationCompleteInformationCtrl
    );

  automationCompleteInformationCtrl.$inject = [
    '$scope',
    '$translate',
    'taskService',
    'summaryTaskService',
    'close',
    'Constants',
  ];

  function automationCompleteInformationCtrl(
    $scope,
    $translate,
    taskService,
    summaryTaskService,
    close,
    Constants
  ) {
    $translate.use(mainMenuData.user.lang);
    $scope.pageLoading = true;
    $scope.NameAttributePattern = Constants.NameAttributePattern;
    $scope.CompanyNamePattern = Constants.CompanyNamePattern;
    $scope.AddressPattern = Constants.AddressPattern;
    $scope.PhoneNumberPattern = Constants.PhoneNumberPattern;
    $scope.close = close;

    var iti = null;
    var smsForm = null;

    $translate.onReady().then(function () {
      summaryTaskService.getContactInformation().then(function (response) {
        if (response.data.success) {
          $scope.model = response.data.model;
          $scope.model.Countries[0].IdCountry = undefined;
          $scope.model.States[0].IdState = undefined;
          $scope.pageLoading = false;
          $scope.model.Industries.map(function (data) {
            return {
              IdIndustry: data.IdIndustry,
              Description: data.Description,
            };
          });
          $scope.model.Industries.splice(0, 0, {
            Description: $translate.instant(
              'CompleteInformation_IndustryDefault'
            ),
            IdIndustry: undefined,
          });
        }
        initializePhoneInput();
      });
    });

    $scope.loadStates = function () {
      if ($scope.model.IdCountry !== undefined) {
        summaryTaskService
          .getStatesByCountry($scope.model.IdCountry)
          .then(function (response) {
            $scope.model.States = response.data;
            $scope.model.IdState = $scope.model.States[0].IdState;
          });
      }
      $scope.model.CountryDirty = true;
    };

    $scope.saveContactInfo = function () {
      if ($scope.CompleteInformation.$valid) {
        var saveModel = $scope.model;
        saveModel.States = null;
        saveModel.Countries = null;

        summaryTaskService
          .saveContactInfo($scope.model)
          .then(function (response) {
            if (response.data.success) {
              $scope.close('ok');
            }
          });
      }
    };

    function initializePhoneInput() {
      var inputRef = null;
      var interval;

      function applyIntlInput() {
        smsForm = document.getElementsByName('CompleteInformation');
        inputRef = document.getElementById('phone_sms');
        if (inputRef !== null) {
          iti = window.intlTelInput(inputRef, {
            nationalMode: true,
            separateDialCode: false,
            autoPlaceholder: 'aggressive',
            preferredCountries: [
              'ar',
              'mx',
              'co',
              'es',
              'ec',
              'cl',
              'pe',
              'us',
            ],
            initialCountry: 'ar',
            customContainer: 'dropdown--full',
          });
          window.clearInterval(interval);
          $scope.changePhoneNumber(smsForm);
          inputRef.addEventListener('countrychange', function () {
            $scope.changePhoneNumber(smsForm);
          });
        }
      }

      interval = window.setInterval(applyIntlInput, 50);
    }

    $scope.changePhoneNumber = function changePhoneNumber(smsForm) {
      if (smsForm.PhoneNumber) {
        if (iti.getNumber()) {
          var isValid = iti.isValidNumber();
          if (isValid) {
            $scope.model.PhoneNumber = iti.getNumber(1);
            smsForm.PhoneNumber.$error = false;
            return;
          }
          evaluateIntlError(iti.getValidationError(), smsForm);
        } else {
          smsForm.PhoneNumber.$error = {
            required: true,
          };
        }
      }
    };

    function evaluateIntlError(errorCode, smsForm) {
      switch (errorCode) {
        case 0:
          smsForm.PhoneNumber.$error = {
            pattern: true,
            required: false,
          };
          break;
        case 3:
          smsForm.PhoneNumber.$error = {
            maxlength: true,
            required: false,
          };
          break;
        default:
          smsForm.PhoneNumber.$error = {
            pattern: true,
            required: false,
          };
      }
    }
  }
})();
