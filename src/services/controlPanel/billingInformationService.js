(function() {
  'use strict';

  angular
    .module('dopplerApp')
    .factory('billingInformationService', billingInformationService);

  billingInformationService.$inject = [
    '$http',
    'COUNTRIES_WITH_TRANSFER',
    'utils'
  ];

  function billingInformationService($http, COUNTRIES_WITH_TRANSFER, utils) {

    var service = {
      getBillingInformationData: getBillingInformationData,
      getStatesByCountry: getStatesByCountry,
      saveBillingInformation: saveBillingInformation
    };

    return service;

    function getBillingInformationData() {
      return $http.get('/ControlPanel/AccountPreferences/GetBillingInformationSettings')
        .then(function(response){
          return {
            status: response.status,
            data: {
              firstname: response.data.userBillingInformationControlPanelModel.FirstName,
              lastname: response.data.userBillingInformationControlPanelModel.LastName,
              phone: response.data.userBillingInformationControlPanelModel.PhoneNumber,
              address: response.data.userBillingInformationControlPanelModel.Address,
              zipCode: response.data.userBillingInformationControlPanelModel.ZipCode,
              idCountry: response.data.userBillingInformationControlPanelModel.IdCountryBillingInformation,
              countriesList: _.map(response.data.userBillingInformationControlPanelModel.Countries, function(country) {
                return {
                  id: country.IdCountry,
                  name: country.Name
                };
              }),
              idState: response.data.userBillingInformationControlPanelModel.IdStateBillingInformation,
              statesList: _.map(response.data.userBillingInformationControlPanelModel.userListStates.States,
                function(state) {
                  return {
                    id: state.IdState,
                    name: state.Name
                  };
                }),
              city: response.data.userBillingInformationControlPanelModel.CityName,
              billingEmails: response.data.userBillingInformationControlPanelModel.BillingEmails,
              idPaymentMethod: response.data.userBillingInformationControlPanelModel.IdPaymentMethod,

              //CREDIT CARD
              ccHolderFullName: response.data.userBillingInformationControlPanelModel.CCHolderFullName,
              idCcType: response.data.userBillingInformationControlPanelModel.IdCCType,
              ccTypesList: _.map(response.data.userBillingInformationControlPanelModel.CreditCardTypes,
                function(ccType) {
                  return {
                    id: ccType.IdCCType,
                    name: ccType.Description
                  };
                }),
              ccNumber: response.data.userBillingInformationControlPanelModel.CCNumber,
              ccExpMonth: response.data.userBillingInformationControlPanelModel.CCExpMonth,
              ccExpMonthList: utils.getCCMonths(),
              ccExpYear: response.data.userBillingInformationControlPanelModel.CCExpYear,
              ccExpYearList: utils.getCCYears(),
              ccVerification: response.data.userBillingInformationControlPanelModel.CCVerification,
              ccIdentificationNumber: response.data.userBillingInformationControlPanelModel.CCIdentificationNumber,
              ccIdentificationType: response.data.userBillingInformationControlPanelModel.CCIdentificationType,
              ccIdentificationTypeList:
                _.map(response.data.userBillingInformationControlPanelModel.CCIdentificationTypes,
                  function(type) {
                    return {
                      id: type.Id,
                      name: type.Name
                    };
                  }),

              //TRANSFER
              idConsumerTypeArgentina: response.data.userBillingInformationControlPanelModel.ConsumerTypeIDArgentina,
              consumerTypesArgentinaList:
                _.map(response.data.userBillingInformationControlPanelModel.ConsumerTypesArgentina,
                  function(type) {
                    return {
                      id: type.IdConsumerType,
                      name: type.Description
                    };
                  }),
              idConsumerTypeMexico: response.data.userBillingInformationControlPanelModel.ConsumerTypeIDMexico,
              consumerTypesMexicoList: _.map(response.data.userBillingInformationControlPanelModel.ConsumerTypesMexico,
                function(type) {
                  return {
                    id: type.IdConsumerType,
                    name: type.Description
                  };
                }),
              cuit: response.data.userBillingInformationControlPanelModel.Cuit,
              rfc: response.data.userBillingInformationControlPanelModel.Rfc,
              responsableIVA: response.data.userBillingInformationControlPanelModel.ResponsableIVA,
              companyNameAr: response.data.userBillingInformationControlPanelModel.RazonSocial,
              companyNameMx: response.data.userBillingInformationControlPanelModel.MxRazonSocial,
              idPaymentType: response.data.userBillingInformationControlPanelModel.PaymentType,
              paymentTypesList: _.map(response.data.userBillingInformationControlPanelModel.PaymentTypes,
                function(paymentType) {
                  return {
                    id: paymentType,
                    name: paymentType
                  };
                }),
              idCdfiUse: response.data.userBillingInformationControlPanelModel.CFDIUse,
              cdfiUsesList: _.map(response.data.userBillingInformationControlPanelModel.CFDIUses, function(cdfiUse) {
                return {
                  id: cdfiUse,
                  name: cdfiUse
                };
              }),
              idPaymentWay: response.data.userBillingInformationControlPanelModel.PaymentWay,
              paymentWaysList: _.map(response.data.userBillingInformationControlPanelModel.PaymentWays,
                function(paymentWay) {
                  return {
                    id: paymentWay,
                    name: paymentWay
                  };
                }),
              bankAccount: response.data.userBillingInformationControlPanelModel.BankAccount,
              bankName: response.data.userBillingInformationControlPanelModel.BankName,
              invoicesUrl: response.data.userBillingInformationControlPanelModel.InvoicesUrl,
              idResponsibleBilling: response.data.userBillingInformationControlPanelModel.IdResponsibleBilling
            }
          };
        });
    }

    function saveBillingInformation(billingInformationModel) {
      var mapedBillingInformationModel = mapBillingInformationModel(billingInformationModel);
      return $http.post('/ControlPanel/AccountPreferences/SaveBillingInformationSettings', mapedBillingInformationModel)
        .then(function(response) {
          return response.data;
        });
    }

    function mapBillingInformationModel(model) {
      return {
        Payment_ConsumerType: model.idCountry === COUNTRIES_WITH_TRANSFER.MEXICO ? //eslint-disable-line
          model.idConsumerTypeMexico : model.idCountry === COUNTRIES_WITH_TRANSFER.ARGENTINA ? //eslint-disable-line
            model.idConsumerTypeArgentina : null, //eslint-disable-line
        FirstName: model.firstname,
        LastName: model.lastname,
        PhoneNumber: model.phone,
        Address: model.address,
        ZipCode: model.zipCode,
        IdCountryBillingInformation: model.idCountry,
        IdStateBillingInformation: model.idState,
        CityName: model.city,
        BillingEmails: model.billingEmails,
        IdPaymentMethod: model.idPaymentMethod,
        CCHolderFullName: model.ccHolderFullName,
        IdCCType: model.idCcType,
        CCNumber: model.ccNumber === model.ccNumberEncrypted ? null : model.ccNumber,
        CCExpMonth: model.ccExpMonth,
        CCExpYear: model.ccExpYear,
        CCVerification: model.ccVerification,
        CCIdentificationNumber: model.ccIdentificationNumber,
        CCIdentificationType: model.ccIdentificationType,
        ConsumerTypeIDArgentina: model.idConsumerTypeArgentina,
        Cuit: model.cuit,
        RazonSocial: model.companyNameAr,
        ConsumerTypeIDMexico: model.idConsumerTypeMexico,
        Rfc: model.rfc,
        MxRazonSocial: model.companyNameMx,
        CFDIUse: model.idCdfiUse,
        PaymentType: model.idPaymentType,
        PaymentWay: model.idPaymentWay,
        BankName: model.bankName,
        BankAccount: model.bankAccount,
        DniArg: model.dniArg,
        ResponsableIVA: model.responsableIVA
      };
    }

    function getStatesByCountry(idCountry) {
      return $http.get('/ControlPanel/AccountPreferences/GetStatesByCountry', { params: { idCountry: idCountry } })
        .then(function(response) {
          return {
            status: response.status,
            data: {
              statesList: _.map(_.drop(response.data), function(state) {
                return {
                  id: state.IdState,
                  name: state.Name
                };
              })
            }
          };
        });
    }
  }
})();
