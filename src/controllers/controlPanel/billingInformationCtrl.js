(function () {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('billingInformationCtrl', billingInformationCtrl);

  billingInformationCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$translate',
    '$timeout',
    'utils',
    'billingInformationService',
    'PAYMENT_METHOD',
    'CONSUMER_TYPE',
    'COUNTRIES_WITH_TRANSFER',
    'MX_TYPE_OF_PAYMENT',
    'BILLING_SYSTEM',
  ];

  function billingInformationCtrl(
    $scope,
    $rootScope,
    $translate,
    $timeout,
    utils,
    billingInformationService,
    PAYMENT_METHOD,
    CONSUMER_TYPE,
    COUNTRIES_WITH_TRANSFER,
    MX_TYPE_OF_PAYMENT,
    BILLING_SYSTEM
  ) {
    var vm = this;
    vm.PAYMENT_METHOD = PAYMENT_METHOD;
    vm.CONSUMER_TYPE = CONSUMER_TYPE;
    vm.COUNTRIES_WITH_TRANSFER = COUNTRIES_WITH_TRANSFER;
    vm.MX_TYPE_OF_PAYMENT = MX_TYPE_OF_PAYMENT;
    vm.BILLING_SYSTEM = BILLING_SYSTEM;
    vm.billingInformationData = null;
    vm.billingEmailsRegExp = utils.REGEX_EMAILS_COMMA_SEPARATED;
    vm.isLoading = true;
    vm.saving = false;
    vm.showGeneralError = false;
    vm.errorMsg = '';

    var preferredCountries = ['ar', 'mx', 'co', 'es', 'ec', 'cl', 'pe', 'us'];
    var iti;

    $translate.onReady().then(function () {
      vm.saveButtonText = $translate.instant('actions.save');
      vm.generalPlaceholder = $translate.instant(
        'billing_information.general_placeholder'
      );
      vm.monthPlaceholder = $translate.instant(
        'billing_information.payment_ways.month'
      );
      vm.yearPlaceholder = $translate.instant(
        'billing_information.payment_ways.year'
      );

      activate();
    });

    function initializePhoneInput() {
      var input = document.getElementById('billing-phone');

      if (input !== null) {
        input.value = vm.billingInformationData.phone;

        // initialise plugin
        iti = window.intlTelInput(input, {
          nationalMode: true,
          separateDialCode: false,
          autoPlaceholder: 'aggressive',
          preferredCountries: preferredCountries,
          initialCountry: 'auto',
        });

        input.value = iti.getNumber(1);

        // on blur: validate
        $(input).blur(function () {
          changePhoneNumber();
        });

        // on change flag: reset
        input.addEventListener('change', changePhoneNumber);
      }

      function changePhoneNumber() {
        if (iti !== null && iti.getNumber()) {
          var isValid = iti.isValidNumber();
          if (isValid) {
            $scope.billingInformationForm.phone.$error = false;
            return;
          }
          evaluateIntlError(iti.getValidationError());
        } else {
          $scope.billingInformationForm.phone.$error = {
            isPhoneNumberInvalid: false,
            required: true,
          };
        }
      }

      function evaluateIntlError(errorCode) {
        switch (errorCode) {
          case 1:
            $scope.isPhoneNumberInvalidByChangeCountry = true;
            $scope.billingInformationForm.phone.$error = {
              isPhoneNumberInvalid: false,
              required: false,
            };
            break;
          case 2:
            $scope.isPhoneNumberInvalidByChangeCountry = false;
            $scope.billingInformationForm.phone.$error = {
              isPhoneNumberInvalidTooShort: true,
              required: false,
            };
            break;
          case 3:
            $scope.isPhoneNumberInvalidByChangeCountry = false;
            $scope.billingInformationForm.phone.$error = {
              isPhoneNumberInvalidTooLong: true,
              required: false,
            };
            break;
          default:
            $scope.isPhoneNumberInvalidByChangeCountry = false;
            $scope.billingInformationForm.phone.$error = {
              isPhoneNumberInvalid: true,
              required: false,
            };
        }
      }
    }

    function activate() {
      billingInformationService
        .getBillingInformationData()
        .then(function (response) {
          vm.billingInformationData = response.data;
          if (vm.billingInformationData.ccNumber) {
            vm.billingInformationData.ccNumberEncrypted =
              vm.billingInformationData.ccNumber;
          }
          if (
            vm.showDNI(
              vm.billingInformationData.idCountry,
              vm.billingInformationData.idPaymentMethod,
              vm.billingInformationData.idConsumerTypeArgentina
            )
          ) {
            vm.billingInformationData.dniArg = vm.billingInformationData.cuit;
            vm.billingInformationData.cuit = '';
          }
          vm.updateIdentificationNumberLength(
            vm.billingInformationData.ccIdentificationType
          );
          vm.PaymentMethodOrigin = vm.billingInformationData.idPaymentMethod;
          vm.updateRegExCC(vm.billingInformationData.ccNumber);
          vm.isLoading = false;

          initializePhoneInput();
        });
    }

    vm.onCountryChange = function (idCountry) {
      vm.getStatesByCountry(idCountry);
      vm.changePaymentMethod(vm.PAYMENT_METHOD.CC);
    };

    vm.getStatesByCountry = function (idCountry) {
      billingInformationService
        .getStatesByCountry(idCountry)
        .then(function (response) {
          vm.billingInformationData.idState = null;
          vm.billingInformationData.statesList = response.data.statesList;
        });
    };

    vm.changePaymentMethod = function (paymentMethod) {
      if (
        vm.PaymentMethodOrigin === vm.PAYMENT_METHOD.TR ||
        (vm.PaymentMethodOrigin !== vm.PAYMENT_METHOD.TR &&
          paymentMethod !== vm.PAYMENT_METHOD.TR)
      ) {
        vm.billingInformationData.idPaymentMethod = paymentMethod;
      }
    };

    vm.save = function (billingInformationForm) {
      var isExpDateValid = vm.validateExpDate(billingInformationForm);
      if (billingInformationForm.$valid && isExpDateValid) {
        vm.saving = true;
        billingInformationService
          .saveBillingInformation(vm.billingInformationData)
          .then(function (response) {
            if (response.success) {
              window.location =
                '/ControlPanel/ControlPanel?section=CampaignsPreferences';
            } else {
              showErrorMessage(response.errorCode);
              vm.saving = false;
            }
          })
          .catch(function () {
            showErrorMessage();
            vm.errorMsg = $translate.instant(
              'billing_information.credit_card_error'
            );
            vm.saving = false;
          });
      }
    };

    vm.validateExpDate = function (billingInformationForm) {
      if (
        vm.billingInformationData.ccExpMonth &&
        vm.billingInformationData.ccExpYear &&
        (vm.billingInformationData.idPaymentMethod === vm.PAYMENT_METHOD.CC ||
          vm.billingInformationData.idPaymentMethod === vm.PAYMENT_METHOD.MP)
      ) {
        var isInvalidExpDate = !utils.isValidExpDate(
          Date.now(),
          vm.billingInformationData.ccExpMonth,
          vm.billingInformationData.ccExpYear
        );
        if (isInvalidExpDate) {
          billingInformationForm.ccExpMonth.$invalid = true;
          billingInformationForm.ccExpYear.$invalid = true;
          billingInformationForm.ccExpMonth.$error = { invalidExpDate: true };
          billingInformationForm.ccExpYear.$error = { invalidExpDate: true };
          return false;
        }
        billingInformationForm.ccExpMonth.$invalid = false;
        billingInformationForm.ccExpYear.$invalid = false;
        billingInformationForm.ccExpMonth.$error = {};
        billingInformationForm.ccExpYear.$error = {};
        return true;
      }
      return true;
    };

    vm.updateRegExCC = function (ccNumber) {
      vm.cvvLength = 3;
      var isCcNumberEncrypted =
        !!vm.billingInformationData.ccNumberEncrypted &&
        vm.billingInformationData.ccNumberEncrypted === ccNumber;
      switch (vm.billingInformationData.idCcType) {
        case 1:
          vm.regexCC = !isCcNumberEncrypted ? utils.REGEX_CC_VISA : null;
          break;
        case 2:
          vm.regexCC = !isCcNumberEncrypted ? utils.REGEX_CC_MASTER : null;
          break;
        case 3:
          vm.regexCC = !isCcNumberEncrypted ? utils.REGEX_CC_AMERICAN : null;
          vm.cvvLength = 4;
          break;
        default:
          vm.regexCC = !isCcNumberEncrypted ? utils.REGEX_CC_NONE : null;
          break;
      }
    };

    vm.updateIdentificationNumberLength = function (idIdentificationType) {
      vm.identificationNumberLength =
        utils.getIdentificationLengthRange(idIdentificationType);
    };

    vm.showCuit = function (consumerTypeId) {
      return consumerTypeId !== vm.CONSUMER_TYPE.CF && consumerTypeId !== null;
    };

    vm.showDNI = function (idCountry, idPaymentMethod, idConsumerTypeARG) {
      return (
        idCountry === vm.COUNTRIES_WITH_TRANSFER.ARGENTINA &&
        idPaymentMethod === vm.PAYMENT_METHOD.TR &&
        idConsumerTypeARG === vm.CONSUMER_TYPE.CF
      );
    };

    function showErrorMessage(errorCode) {
      switch (errorCode) {
        case 'InvalidCreditCard':
          vm.errorMsg = $translate.instant(
            'billing_information.credit_card_error'
          );
          break;
        default:
          vm.errorMsg = $translate.instant(
            'validation_messages.generic_error_msg'
          );
          break;
      }

      $timeout(function () {
        vm.errorMsg = '';
      }, 8000);
    }
  }
})();
