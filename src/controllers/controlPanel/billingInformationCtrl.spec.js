'use strict';

describe('Billing Information', function() {
  beforeEach(module('dopplerApp.controlPanel'));

  var billingInformationDataMock = {
    getBillingInformationDataCC: function() {
      var result = {
        data: {
          firstname: 'Luciana',
          lastname: 'Garcia',
          phone: '4751111',
          address: 'Sarmiento 5897',
          zipCode: '7600',
          idCountry: 10,
          idState: 2189,
          city: 'Mar del Plata',
          billingEmails: '',
          idPaymentMethod: 1,
          ccHolderFullName: 'Luciana Garcia',
          idCcType: 1,
          ccNumber: '************5879',
          ccExpMonth: 2,
          ccExpYear: 2020,
          ccVerification: '123'
        }
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getBillingInformationDataTR: function() {
      var result = {
        data: {
          firstname: 'Luciana',
          lastname: 'Garcia',
          phone: '4751111',
          address: 'Sarmiento 5897',
          zipCode: '7600',
          idCountry: 10,
          idState: 2189,
          city: 'Mar del Plata',
          billingEmails: '',
          idPaymentMethod: 3,
          bankName: 'Banco',
          bankAccount: 1234
        }
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getStatesByCountryArgentina: function() {
      var result = {
        data: {
          statesList: [
            {
              id: 1,
              name: 'Buenos Aires'
            },
            {
              id: 2,
              name: 'Catamarca'
            }
          ]
        }
      }
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getStatesByCountryMexico: function() {
      var result = {
        data: {
          statesList: [
            {
              id: 3,
              name: 'Aguascalientes'
            },
            {
              id: 4,
              name: 'Baja California'
            }
          ]
        }
      }
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getStatesByCountry: function() {
      var result = {
        data: {
          statesList: [
            {
              id: 5,
              name: 'Un estado'
            },
            {
              id: 6,
              name: 'Otro estado'
            }
          ]
        }
      }
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    saveError: function() {
      var result = {
        success: false
      }
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    }
  }

  var billingInformationServiceMock = {
    getBillingInformationDataCC: {},
    getBillingInformationDataTR: {},
    getStatesByCountry: {},
    saveBillingInformation: {}
  }

  var utils = {
    getIdentificationLengthRange: function(){return {min: 4, max: 6};}
  };
  var PAYMENT_METHOD = {
    CC: 1,
    TR: 3,
    NONE: 4
  }
  var CONSUMER_TYPE = {
    CF: 1,
    RI: 2,
    RFC: 4
  };

  var COUNTRIES_WITH_TRANSFER = {
    ARGENTINA: 10,
    MEXICO: 157
  }

  var MX_TYPE_OF_PAYMENT = {
    TRANSFER: 'TRANSFER',
  }

  var BiilingSystem = {
    GB: 1,
    GB_BISIDE: 9,
    MERCADO_PAGO: 13
  }

  var $translate =  {
    instant: function (text){
      return text;
    },
    onReady: function(text) {
      var deferred = $q.defer();
      deferred.resolve(text);
      return deferred.promise;
    }
  };

  var $controller, $rootScope;
  var $q;
  beforeEach(function() {
    module(function($provide) {
      $provide.value('$translate', $translate);
      $provide.value('billingInformationSettings', billingInformationServiceMock);
      $provide.value('utils', utils);
      $provide.value('COUNTRIES_WITH_TRANSFER', COUNTRIES_WITH_TRANSFER);
      $provide.value('PAYMENT_METHOD', PAYMENT_METHOD);
      $provide.value('CONSUMER_TYPE', CONSUMER_TYPE);
      $provide.value('MX_TYPE_OF_PAYMENT', MX_TYPE_OF_PAYMENT);
      $provide.value('BILLING_SYSTEM', BiilingSystem);
    });
  });

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should not be able to change payment method to TRANSFER when origin one is CREDIT CARD', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataCC();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    billingInformationCtrl.changePaymentMethod(PAYMENT_METHOD.TR);

    expect(billingInformationCtrl.billingInformationData.idPaymentMethod).toBe(PAYMENT_METHOD.CC);
  });

  it('should be able to change payment method to CREDIT CARD when origin one is TRANSFER', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataTR();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    billingInformationCtrl.changePaymentMethod(PAYMENT_METHOD.CC);

    expect(billingInformationCtrl.billingInformationData.idPaymentMethod).toBe(PAYMENT_METHOD.CC);
  });

  it('should change countries list correctly', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getStatesByCountry = function(idCountry) {
      if (idCountry === COUNTRIES_WITH_TRANSFER.ARGENTINA) {
        return billingInformationDataMock.getStatesByCountryArgentina();
      } else if (idCountry === COUNTRIES_WITH_TRANSFER.MEXICO) {
        return billingInformationDataMock.getStatesByCountryMexico();
      }
    }

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataTR();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    billingInformationCtrl.getStatesByCountry(COUNTRIES_WITH_TRANSFER.ARGENTINA);
    $rootScope.$apply();
    expect(billingInformationCtrl.billingInformationData.statesList[0].name).toBe('Buenos Aires');

    billingInformationCtrl.getStatesByCountry(COUNTRIES_WITH_TRANSFER.MEXICO);
    $rootScope.$apply();
    expect(billingInformationCtrl.billingInformationData.statesList[1].name).toBe('Baja California');
  });

  it('should change selected payment method to credit card when country changes', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataTR();
    }

    billingInformationServiceMock.getStatesByCountry = function() {
      return billingInformationDataMock.getStatesByCountry();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    expect(billingInformationCtrl.billingInformationData.idPaymentMethod).toBe(PAYMENT_METHOD.TR);

    billingInformationCtrl.onCountryChange(3);
    $rootScope.$apply();
    expect(billingInformationCtrl.billingInformationData.idPaymentMethod).toBe(PAYMENT_METHOD.CC);
  });

  it('should show error message if save failed', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataTR();
    }

    billingInformationServiceMock.saveBillingInformation = function() {
      return billingInformationDataMock.saveError();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    var billingInformationFormMocked = {};
    billingInformationFormMocked.$valid = true;

    billingInformationCtrl.save(billingInformationFormMocked);

    $rootScope.$apply();

    expect(billingInformationCtrl.errorMsg).not.toBe('');
  });

  it('should have bank information data in model', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataTR();
    }

    billingInformationServiceMock.saveBillingInformation = function() {
      return billingInformationDataMock.saveError();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    expect(billingInformationCtrl.billingInformationData.bankName).toBe('Banco');
    expect(billingInformationCtrl.billingInformationData.bankAccount).toBe(1234);
  });

  it('should not show DNI for cc payment for Mexico or Argentina', function () {
    var $scope = $rootScope.$new();

    billingInformationServiceMock.getBillingInformationData = function() {
      return billingInformationDataMock.getBillingInformationDataCC();
    }

    var billingInformationCtrl = $controller('billingInformationCtrl', {
      $scope: $scope,
      $translate: $translate,
      billingInformationService: billingInformationServiceMock
    });

    $rootScope.$apply();

    expect(billingInformationCtrl.showDNI(COUNTRIES_WITH_TRANSFER.ARGENTINA, PAYMENT_METHOD.CC ,CONSUMER_TYPE.CF )).toBe(false);
    expect(billingInformationCtrl.showDNI(COUNTRIES_WITH_TRANSFER.MEXICO, PAYMENT_METHOD.CC ,CONSUMER_TYPE.RFC )).toBe(false);
    expect(billingInformationCtrl.showDNI(COUNTRIES_WITH_TRANSFER.ARGENTINA, PAYMENT_METHOD.CC ,CONSUMER_TYPE.RI )).toBe(false);
    
  });


});
