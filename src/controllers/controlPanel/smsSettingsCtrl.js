
(function() {
  'use strict';

  angular
    .module('dopplerApp.controlPanel')
    .controller('smsSettingsCtrl', smsSettingsCtrl);

  smsSettingsCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$translate',
    '$timeout',
    'smsSettingsService',
    'utils',
    'PAYMENT_METHOD',
    'CONSUMER_TYPE',
    'ModalService',
    'COUNTRIES_WITH_TRANSFER'
  ];

  function smsSettingsCtrl($scope, $rootScope, $translate, $timeout, smsSettingsService,
    utils, PAYMENT_METHOD, CONSUMER_TYPE, ModalService, COUNTRIES_WITH_TRANSFER) {
    var vm = this;
    vm.isLoading = false;
    vm.screenToShow = 'settingsScreen';
    vm.showAddCountry = false;
    vm.selectedCountries = [];
    vm.countriesList = [];
    vm.estimateCountriesList = [];
    vm.balance = 0;
    vm.creditToBuy = 0;
    vm.estimateCountryUniqueId = 0;
    vm.availableCountries = [];
    vm.showAddCountry = false;
    vm.months = getMonths();
    vm.years = getYears();
    vm.saving = false;
    vm.enableSave = false;
    vm.regexCC = null;
    vm.creditCardTypes = [];
    vm.errorMsg = '';
    vm.cvvLength = 3;
    vm.PAYMENT_METHOD = PAYMENT_METHOD;
    vm.CONSUMER_TYPE = CONSUMER_TYPE;
    vm.selectedPaymentMethod = vm.PAYMENT_METHOD.CC;
    vm.smsSettingsService = smsSettingsService;
    vm.minPurchase = 50;
    vm.COUNTRIES_WITH_TRANSFER = COUNTRIES_WITH_TRANSFER;
    vm.isCM = false;
    vm.allowedCountries = [ 
      vm.COUNTRIES_WITH_TRANSFER.ARGENTINA, 
      vm.COUNTRIES_WITH_TRANSFER.COLOMBIA, 
      vm.COUNTRIES_WITH_TRANSFER.MEXICO];

    $translate.onReady().then(function() {
      vm.countryPlaceholder = $translate.instant('sms_settings.calc_credit_screen.country_grid.country_placeholder');
      vm.purchaseButton = $translate.instant('sms_settings.buy_screen.buy_button');
      vm.selectOptionPlaceholder = $translate.instant('sms_settings.buy_screen.credit_card.select_option_placehoder');
      vm.ccExpMonthPlaceholder = $translate.instant('sms_settings.buy_screen.credit_card.month_placeholder');
      vm.ccExpYearPlaceholder = $translate.instant('sms_settings.buy_screen.credit_card.year_placeholder');
      activate();
    });

    function activate() {
      vm.isLoading = true;
      smsSettingsService.getUserSmsData()
        .then(function(response) {
          if (response.status === 200) {
            vm.countriesList = _.sortBy(response.data.enabledCountries, 'name');
            vm.selectedCountries = _.filter(vm.countriesList, function(country) {
              return _.find(response.data.selectedCountries, function(regionCode) {
                return regionCode === country.regionCode;
              });
            });
            vm.balance = response.data.totalBalance;
            vm.creditCardTypes = response.data.creditCardTypes;
            vm.consumerTypes = response.data.consumerTypes;
            vm.CFDIUses = response.data.CFDIUses;
            vm.paymentTypes = response.data.paymentTypes;
            vm.paymentWays = response.data.paymentWays;
            vm.paymentInProccess = response.data.paymentInProccess;
            vm.isCM = response.data.isCM;
            vm.paymentData = {
              billingInformation: {
                ccExpMonth: null,
                ccExpYear: null,
                idCCType: null,
                idConsumerType: null,
                CFDIUse: null,
                paymentType: null,
                paymentWay: null,
                idCountry: response.data.idCountry, 
                responsableIVA: response.data.responsableIVA
              }
            };
            vm.smsDelivery = response.data.smsDelivery;
            vm.setAvailableCountries();
            vm.isLoading = false;
          }
        });
    }

    vm.findCountry = function(regionCode) {
      return _.find(vm.countriesList, function(country) {
        return country.regionCode === regionCode;
      });
    };

    vm.showCalcCreditScreen = function() {
      vm.isLoading = true;
      vm.estimateCountriesList = [];
      vm.creditToBuy = 0;
      vm.availableCountriesToEstimate = vm.countriesList;
      if (vm.selectedCountries.length) {
        _.each(vm.selectedCountries, function(country) {
          vm.addCountryToEstimate(country.regionCode);
        });
      } else {
        vm.addCountryToEstimate(null);
      }
      vm.screenToShow = 'calcCreditScreen';
      $rootScope.$on('ngRepeatFinished', function() {
        vm.updateEstimateScreenInformation();
      });
      vm.isLoading = false;
    };

    vm.isAddCountryToEstimateEnable = function() {
      return !_.find(vm.estimateCountriesList, function(country) {
        return country.regionCode === null;
      }) && vm.estimateCountriesList.length !== vm.countriesList.length
        || vm.estimateCountriesList.length === 0;
    };

    vm.isTransferCountry = function(idCountry){
      return vm.allowedCountries.includes(idCountry);
    };

    vm.updateEstimateScreenInformation = function(regionCode) {
      vm.updatePrices(regionCode);
      vm.setAvailableCountriesToEstimate();
    };

    vm.updatePrices = function(regionCode) {
      var total = 0;
      _.each(vm.estimateCountriesList, function(countryToEstimate) {
        var countryPrice = countryToEstimate.regionCode ?
          vm.findCountry(countryToEstimate.regionCode).price : 0;
        if (countryToEstimate.regionCode === regionCode) {
          countryToEstimate.count = vm.getDefaultCountryCount(countryPrice);
        }
        total += vm.getRoundedPrice(countryToEstimate.count, countryPrice);
        countryToEstimate.price = countryPrice;
      });
      vm.creditToBuy = total;
    };

    vm.addCountryToEstimate = function(regionCode) {
      var country = vm.findCountry(regionCode);
      if (vm.isAddCountryToEstimateEnable()){
        vm.estimateCountriesList.push({
          id: vm.estimateCountryUniqueId,
          regionCode: regionCode,
          count: country ? vm.getDefaultCountryCount(country.price) : null
        });
        vm.estimateCountryUniqueId++;
      }
    };

    vm.validDeliveryFrom = function () {
      if (vm.smsDelivery.ShippingSchedulesFrom < 0) {
        vm.smsDelivery.ShippingSchedulesFrom = 0;
      } else if (vm.smsDelivery.ShippingSchedulesFrom > vm.smsDelivery.ShippingSchedulesTo) {
        vm.smsDelivery.ShippingSchedulesFrom = vm.smsDelivery.ShippingSchedulesTo;
      }
    };

    vm.validDeliveryTo = function () {
      if (vm.smsDelivery.ShippingSchedulesTo > 24) {
        vm.smsDelivery.ShippingSchedulesTo = 24;
      } else if (vm.smsDelivery.ShippingSchedulesTo < vm.smsDelivery.ShippingSchedulesFrom) {
        vm.smsDelivery.ShippingSchedulesTo = vm.smsDelivery.ShippingSchedulesFrom;
      }
    };

    vm.SetAllowSave = function () {
      vm.enableSave = true;
    };

    vm.getDefaultCountryCount = function(price) {
      var count = Math.floor(vm.minPurchase / price);
      return vm.getRoundedPrice(count, price) >= vm.minPurchase ? count : count + 1;
    };

    vm.getRoundedPrice = function(count, price) {
      return Math.ceil(100 * count * price) / 100;
    };

    vm.deleteCountryToEstimate = function(index) {
      vm.estimateCountriesList.splice(index, 1);
      vm.updateEstimateScreenInformation();
    };

    vm.addCountryToSendSMS = function() {
      if (vm.selectedCountryId !== null) {
        vm.selectedCountries.push(vm.findCountry(vm.selectedCountryId));
        vm.setAvailableCountries();
        vm.showAddCountry = false;
        vm.enableSave = true;
      }
    };

    vm.deleteCountryToSendSMS = function(regionCode) {
      vm.selectedCountries = _.filter(vm.selectedCountries, function(country) {
        return country.regionCode !== regionCode;
      });
      vm.setAvailableCountries();
      vm.enableSave = true;
    };

    vm.cancelAddCountryToSendSMS = function() {
      vm.showAddCountry = false;
      vm.selectedCountryId = null;
    };

    vm.saveChanges = function() {
      if (!vm.saving) {
        vm.saving = true;
        var regionCodes = _.map(vm.selectedCountries, function(country) {
          return country.regionCode;
        }) || [];
        
        var promiseSmsCountries = smsSettingsService.saveSelectedSmsCountries(regionCodes);
        var promiseSmsConfig = smsSettingsService.saveDeliverySmsConfig(vm.smsDelivery);
        Promise.all([promiseSmsCountries, promiseSmsConfig]).then(function (responses) {
          $timeout(function () {
            vm.saving = false;
            vm.enableSave = !responses[0].success && !responses[1].success;
          }, 500);
        });
      }
    };

    vm.setAvailableCountries = function() {
      vm.availableCountries = _.sortBy(_.filter(vm.countriesList, function(country) {
        return !_.includes(vm.selectedCountries, country);
      }), 'name');
      vm.selectedCountryId = null;
    };

    vm.setAvailableCountriesToEstimate = function() {
      vm.availableCountriesToEstimate = _.sortBy(_.filter(vm.countriesList, function(country) {
        return !_.find(vm.estimateCountriesList, function(estimateCountry) {
          return estimateCountry.regionCode === country.regionCode;
        });
      }), 'name');
    };

    vm.showBuyScreen = function() {
      vm.screenToShow = 'buyScreen';
    };

    vm.updateRegExCC = function() {
      vm.cvvLength = 3;
      switch (vm.paymentData.billingInformation.idCCType) {
      case 1:
        vm.regexCC = utils.REGEX_CC_VISA;
        break;
      case 2:
        vm.regexCC = utils.REGEX_CC_MASTER;
        break;
      case 3:
        vm.regexCC = utils.REGEX_CC_AMERICAN;
        vm.cvvLength = 4;
        break;
      default:
        vm.regexCC = utils.REGEX_CC_NONE;
        break;
      }
    };

    vm.saveUpdatedActiveCountries = function() {
      var estimatedRegionCodes = vm.estimateCountriesList.map(function(obj) {
        return obj.regionCode;
      });
      var selectedRegionCodes = vm.selectedCountries.map(function(obj) {
        return obj.regionCode;
      });
      var updatedActiveCountries = _.union(estimatedRegionCodes, selectedRegionCodes);
      return smsSettingsService.saveSelectedSmsCountries(updatedActiveCountries);
    };

    vm.buy = function(billingInformationForm) {
      if (billingInformationForm.$valid) {
        smsSettingsService.loadingModal = true;
        if (vm.selectedPaymentMethod === PAYMENT_METHOD.TR) {
          vm.formatRFC();
        }
        showPaymentModal();
        smsSettingsService.buySmsCredits(vm.paymentData.billingInformation, vm.creditToBuy, vm.selectedPaymentMethod)
          .then(function(response) {
            if (response.success) {
              vm.screenToShow = 'settingsScreen';
              vm.saveUpdatedActiveCountries()
                .catch(function(e) {
                  console.log('Exception occured when updating active countries', e);
                })
                .finally(function() {
                  activate();
                  vm.resetForm(billingInformationForm);
                  smsSettingsService.loadingModal = false;
                });
            } else {
              showErrorMessage();
              $rootScope.$broadcast('closeSmsPaymentModal');
            }
            vm.selectedPaymentMethod = vm.PAYMENT_METHOD.CC;
          });
      }
    };

    vm.formatRFC = function() {
      if (vm.paymentData.billingInformation.idConsumerType === CONSUMER_TYPE.RFC) {
        vm.paymentData.billingInformation.cuit = utils.formatValidRfc(vm.paymentData.billingInformation.cuit);
      }
    };

    vm.changePaymentMethod = function(paymentMethod, billingInformationForm) {
      vm.selectedPaymentMethod = paymentMethod;
      vm.resetForm(billingInformationForm);
    };

    vm.resetForm = function(billingInformationForm) {
      billingInformationForm.$setPristine();
      billingInformationForm.$submitted = false;
    };

    vm.showCuit = function(consumerTypeId){
      return !!consumerTypeId && consumerTypeId !== vm.CONSUMER_TYPE.CF 
      && vm.paymentData.billingInformation.idCountry === vm.COUNTRIES_WITH_TRANSFER.ARGENTINA;
    };

    vm.showDNI = function(idCountry, idPaymentMethod, idConsumerTypeARG){
      return (idCountry === vm.COUNTRIES_WITH_TRANSFER.ARGENTINA &&
        idPaymentMethod === vm.PAYMENT_METHOD.TR &&
        idConsumerTypeARG === vm.CONSUMER_TYPE.CF );
    };

    function showPaymentModal() {
      var templateURL = vm.selectedPaymentMethod === PAYMENT_METHOD.TR
        ? 'angularjs/partials/shared/modalSmsPaymentTR.html'
        : 'angularjs/partials/shared/modalSmsPaymentCC.html';

      ModalService.showModal({
        templateUrl: templateURL,
        controller: 'ModalSmsPaymentCtrl',
        inputs: { data: {} }
      });
    }

    function showErrorMessage() {
      vm.errorMsg = $translate.instant('sms_settings.buy_screen.error_msg');
      $timeout(function() {
        vm.errorMsg = '';
      }, 8000);
    }

    function getMonths() {
      var months = [];
      for (var i = 1; i <= 12; i++) {
        months.push({id: i, name: i.toString()});
      }
      return months;
    }

    function getYears() {
      var years = [];
      for (var i = 0; i < 20; i++) {
        years.push({id: (new Date().getFullYear() + i), name: (new Date().getFullYear() + i).toString()});
      }
      return years;
    }
  }
})();
