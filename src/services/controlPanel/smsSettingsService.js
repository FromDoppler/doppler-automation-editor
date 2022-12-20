(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('smsSettingsService', smsSettingsService);

  smsSettingsService.$inject = [
    '$http',
    'PAYMENT_METHOD'
  ];

  function smsSettingsService($http, PAYMENT_METHOD) {

    var service = {
      getUserSmsData: getUserSmsData,
      saveSelectedSmsCountries: saveSelectedSmsCountries,
      buySmsCredits: buySmsCredits,
      mapBillingInformationModel: mapBillingInformationModel,
      saveDeliverySmsConfig: saveDeliverySmsConfig,
      loadingModal: false
    };

    return service;

    function getUserSmsData() {
      return $http.get('/ControlPanel/AccountPreferences/GetUserSmsData')
        .then(function(response){
          return {
            status: response.status,
            data: {
              enabledCountries: _.map(response.data.enabledCountries, function(country) {
                return {
                  id: country.IdSmsCountry,
                  regionCode: country.RegionCode,
                  name: country.Name,
                  price: country.Price
                };
              }),
              selectedCountries: response.data.selectedCountries,
              totalBalance: response.data.totalBalance,
              paymentInProccess: response.data.paymentInProccess,
              creditCardTypes: _.map(response.data.creditCardTypes, function(cardType) {
                return {
                  idCCType: cardType.IdCCType,
                  description: cardType.Description
                };
              }),
              consumerTypes: _.map(response.data.consumerTypes, function(consumerType) {
                return {
                  idConsumerType: consumerType.IdConsumerType,
                  name: consumerType.Name,
                  description: consumerType.Description,
                  countryId: consumerType.CountryID
                };
              }),
              CFDIUses: _.map(response.data.CFDIUses, function(CFDI) {
                return {
                  id: CFDI.Id,
                  description: CFDI.Description
                };
              }),
              paymentTypes: _.map(response.data.paymentTypes, function(paymentType) {
                return {
                  id: paymentType.Id,
                  description: paymentType.Description
                };
              }),
              paymentWays: _.map(response.data.paymentWays, function(paymentWay) {
                return {
                  id: paymentWay.Id,
                  description: paymentWay.Description
                };
              }),
              idCountry: response.data.IdCountry,
              // eslint-disable-next-line no-extra-boolean-cast 
              responsableIVA: !!response.data.ResponsableIVA ? response.data.ResponsableIVA : false,
              smsDelivery: response.data.smsDelivery,
              isCM: response.data.isCM,
            }
          };
        });
    }

    function saveSelectedSmsCountries(regionCodes) {
      return $http.post('/ControlPanel/AccountPreferences/SaveSelectedSmsCountries', regionCodes)
        .then(function(response){
          return response.data;
        });
    }

    function saveDeliverySmsConfig(deliveryConfig) {
      return $http.post('/ControlPanel/AccountPreferences/SaveSmsDeliverySettings', deliveryConfig)
        .then(function (response) {
          return response.data;
        });
    }

    function buySmsCredits(billingInformation, fee, paymentMethod) {
      var billingInformationModel = mapBillingInformationModel(billingInformation, fee, paymentMethod);
      return $http.post('/ControlPanel/AccountPreferences/BuySmsCredits', billingInformationModel)
        .then(function(response) {
          return response.data;
        });
    }

    function mapBillingInformationModel(billingInformation, fee, paymentMethod) {
      switch (paymentMethod) {
      case PAYMENT_METHOD.CC:
        return {
          IdPaymentMethod: PAYMENT_METHOD.CC,
          Fee: fee,
          CCNumber: billingInformation.ccNumber,
          CCExpMonth: billingInformation.ccExpMonth,
          CCExpYear: billingInformation.ccExpYear,
          CCHolderFullName: billingInformation.holderFullName,
          IdCCType: billingInformation.idCCType,
          CCVerification: billingInformation.ccVerification,
          DNIArg: billingInformation.dniArg,
          IdCountry: billingInformation.idCountry
        };
      case PAYMENT_METHOD.TR:
        return {
          IdPaymentMethod: PAYMENT_METHOD.TR,
          Fee: fee,
          IdConsumerType: billingInformation.idConsumerType,
          RazonSocial: billingInformation.companyName,
          Cuit: billingInformation.cuit,
          CFDIUse: billingInformation.CFDIUse,
          PaymentWay: billingInformation.paymentWay,
          PaymentType: billingInformation.paymentType,
          BankName: billingInformation.bankName,
          BankAccount: billingInformation.lastNumbers,
          DNIArg: billingInformation.dniArg,
          IdCountry: billingInformation.idCountry,
          ResponsableIVA: billingInformation.responsableIVA
        };
      default:
        console.warn('Unexpected Payment Method'); // eslint-disable-line
        return {};
      }
    }
  }
})();
