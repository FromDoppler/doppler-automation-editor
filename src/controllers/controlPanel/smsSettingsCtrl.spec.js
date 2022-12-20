'use strict';

describe('SMS settings', function() {
  beforeEach(module('dopplerApp.controlPanel'));

  var smsSettingsDataMock = {
    getUserSmsData: function() {
      var result = {
        data: {
          enabledCountries: [
            {
              id: 1,
              regionCode: "US",
              name: "Estados Unidos",
              price: 10
            },
            {
              id: 52,
              regionCode: "MX",
              name: "México",
              price: 40
            },
            {
              id: 54,
              regionCode: "AR",
              name: "Argentina",
              price: 10
            },
            {
              id: 55,
              regionCode: "ES",
              name: "España",
              price: 0.01410
            },
            {
              id: 56,
              regionCode: "UR",
              name: "Uruguay",
              price: 0.06790
            }
          ],
          selectedCountries: ['US','MX','CO']
        },
        status: 200,
        totalBalance: 400
      };

      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    }

  }

  var smsSettingsServiceMock = {
    getUserSmsData: {},
    saveSelectedSmsCountries: function(){
      var deferred = $q.defer();
      deferred.resolve({success: true});
      return deferred.promise;
    },
  }

  var utils = {};
  var PAYMENT_METHOD = {
    CC: 1,
    TR: 3,
    MP: 5,
    NONE: 4
  };
  var CONSUMER_TYPE = {
    CF: 1,
    RI: 2,
    RFC: 4
  };
  var COUNTRIES_WITH_TRANSFER = {
    ARGENTINA: 10,
    MEXICO: 157,
    COLOMBIA: 49
  }
  var ModalService = {};

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
      $provide.value('smsSettingsService', smsSettingsServiceMock);
      $provide.value('utils', utils);
      $provide.value('PAYMENT_METHOD', PAYMENT_METHOD);
      $provide.value('CONSUMER_TYPE', CONSUMER_TYPE);
      $provide.value('ModalService', ModalService);
      $provide.value('COUNTRIES_WITH_TRANSFER', COUNTRIES_WITH_TRANSFER);
    });
  });

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should get selected countries data', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    expect(smsSettingsCtrl.selectedCountries[0].id).toBe(1)
    expect(smsSettingsCtrl.selectedCountries[0].regionCode).toBe('US');
    expect(smsSettingsCtrl.selectedCountries[0].name).toBe('Estados Unidos');
    expect(smsSettingsCtrl.selectedCountries[0].price).toBe(10);

    expect(smsSettingsCtrl.selectedCountries[1].id).toBe(52)
    expect(smsSettingsCtrl.selectedCountries[1].regionCode).toBe('MX');
    expect(smsSettingsCtrl.selectedCountries[1].name).toBe('México');
    expect(smsSettingsCtrl.selectedCountries[1].price).toBe(40);
  });

  it('should not break if recieve selected coutries that aren´t in countries list', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    expect(smsSettingsCtrl.selectedCountries.length).toBe(2);
  });

  it('should estimate purchase with selected countries by default', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();
    $rootScope.$on('ngRepeatFinished', function() {
      smsSettingsCtrl.showCalcCreditScreen();

      expect(smsSettingsCtrl.estimateCountriesList.length).toBe(2);
      expect(smsSettingsCtrl.creditToBuy).toBe(25000);
    });
  });

  it('should recalc total', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    smsSettingsCtrl.addCountryToEstimate('AR');
    smsSettingsCtrl.estimateCountriesList[0].count = 100;
    smsSettingsCtrl.updatePrices();

    expect(smsSettingsCtrl.creditToBuy).toBe(1000);

    smsSettingsCtrl.addCountryToEstimate('MX');
    smsSettingsCtrl.estimateCountriesList[1].count = 100;
    smsSettingsCtrl.updatePrices();

    expect(smsSettingsCtrl.creditToBuy).toBe(5000); // 100 messages for AR 100*10 + 100*40 messages for MX total 5000
  });

  it('should reset calc screen when you start again', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    smsSettingsCtrl.addCountryToEstimate('AR');
    smsSettingsCtrl.estimateCountriesList[0].count = 100;
    smsSettingsCtrl.updatePrices();
    smsSettingsCtrl.screenToShow = 'settingsScreen';
    smsSettingsCtrl.showCalcCreditScreen();

    expect(smsSettingsCtrl.creditToBuy).toBe(0);
  });

  it('should not break with formatRFC with other consumer types', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();
    smsSettingsCtrl.paymentData.billingInformation.idConsumerType = CONSUMER_TYPE.RI;
    smsSettingsCtrl.paymentData.billingInformation.cuit = '27348514143';
    smsSettingsCtrl.formatRFC();

    expect(smsSettingsCtrl.paymentData.billingInformation.cuit).toBe('27348514143');
  });

  it('should order countries by name correctly', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

   /*
    Countries List:
    - Argentina
    - España
    - Estados Unidos
    - México
    - Uruguay

    Countries to send SMS:
    - Estados Unidos
    - México

    Available countries:
    - Argentina
    */

    expect(smsSettingsCtrl.countriesList[0].name).toBe('Argentina');

    smsSettingsCtrl.deleteCountryToSendSMS('MX');
    smsSettingsCtrl.deleteCountryToSendSMS('US');

    smsSettingsCtrl.selectedCountryId = 'AR'
    smsSettingsCtrl.addCountryToSendSMS();

    /*
    Countries List:
    - Argentina
    - España
    - Estados Unidos
    - México
    - Uruguay

    Countries to send SMS:
    - Argentina

    Available countries:
    - España
    - Estados Unidos
    - México
    */

    expect(smsSettingsCtrl.availableCountries[0].name).toBe('España');
    expect(smsSettingsCtrl.availableCountries[1].name).toBe('Estados Unidos');

    smsSettingsCtrl.deleteCountryToSendSMS('AR');

    /*
    Countries List:
    - Argentina
    - España
    - Estados Unidos
    - México
    - Uruguay

    Countries to send SMS:
    (none)

    Available countries:
    - Argentina
    - España
    - Estados Unidos
    - México
    */

   expect(smsSettingsCtrl.availableCountries[0].name).toBe('Argentina');
   expect(smsSettingsCtrl.availableCountries[1].name).toBe('España');
   expect(smsSettingsCtrl.availableCountries[2].name).toBe('Estados Unidos');
  });

  it('should order countries by name correctly in estimate screen', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

   /*
    Countries List:
    - Argentina
    - España
    - Estados Unidos
    - México
    - Uruguay

    Countries to estimate:
    - Estados Unidos
    - México

    Available countries to estimate:
    - Argentina
    */

    smsSettingsCtrl.showCalcCreditScreen();
    expect(smsSettingsCtrl.availableCountriesToEstimate[0].name).toBe('Argentina');

    smsSettingsCtrl.addCountryToEstimate('AR');
    smsSettingsCtrl.deleteCountryToEstimate(0); // Estados Unidos
    smsSettingsCtrl.deleteCountryToEstimate(1); // Argentina

    /*
    Countries List:
    - Argentina
    - España
    - Estados Unidos
    - México
    - Uruguay

    Countries to estimate:
    - Argentina
    - México

    Available countries to estimate:
    - Estados Unidos
    */

    expect(smsSettingsCtrl.availableCountriesToEstimate[0].name).toBe('Argentina');
    expect(smsSettingsCtrl.availableCountriesToEstimate[1].name).toBe('España');
  });

  it('should calc the most appropiate sms count', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    smsSettingsCtrl.addCountryToEstimate('ES');
    smsSettingsCtrl.addCountryToEstimate('UR');
    smsSettingsCtrl.updatePrices();

    expect(smsSettingsCtrl.estimateCountriesList[0].count).toBe(3546);
    expect(smsSettingsCtrl.estimateCountriesList[1].count).toBe(737);
  });

  it('should show the most appropiate sms rounded amount', function () {
    var $scope = $rootScope.$new();

    smsSettingsServiceMock.getUserSmsData = function() {
      return smsSettingsDataMock.getUserSmsData();
    }

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    smsSettingsCtrl.addCountryToEstimate('ES');
    smsSettingsCtrl.addCountryToEstimate('UR');
    smsSettingsCtrl.updatePrices();

    expect(smsSettingsCtrl.getRoundedPrice(smsSettingsCtrl.estimateCountriesList[0].price, smsSettingsCtrl.estimateCountriesList[0].count)).toBe(50);
    expect(smsSettingsCtrl.getRoundedPrice(smsSettingsCtrl.estimateCountriesList[1].price, smsSettingsCtrl.estimateCountriesList[1].count)).toBe(50.05);
  });

  it('should not show cuit or DNI for Mexico with Transfer and consumer type selected', function () {
    var $scope = $rootScope.$new();
    var consumerTypeRFC = 4;
    var mexicoCountryCode = 154;

    smsSettingsServiceMock.getUserSmsData = function() {
      var result = {
        status:200,
        data: 
        {
          enabledCountries:[],
          selectedCountries: ["AR"],
          totalBalance: 50.00004,
          paymentInProccess: true,
          creditCardTypes: [],
          consumerTypes: [],
          CFDIUses:[],
          idCountry: mexicoCountryCode
        }
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    };

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });
    smsSettingsCtrl.selectedPaymentMethod = smsSettingsCtrl.PAYMENT_METHOD.TR;

    $rootScope.$apply();

    expect(smsSettingsCtrl.showCuit(consumerTypeRFC)).toBe(false);
    expect(smsSettingsCtrl.showDNI(smsSettingsCtrl.paymentData.billingInformation.idCountry,smsSettingsCtrl.selectedPaymentMethod,consumerTypeRFC)).toBe(false);
  });

  it('should not show DNI for CC for all countries', function () {
    var $scope = $rootScope.$new();
    var countryCodes = {
      mexico: 154,
      argentina: 10
    };
    smsSettingsServiceMock.getUserSmsData = function() {
      var result = {
        status:200,
        data: 
        {
          enabledCountries:[],
          selectedCountries: ["AR"],
          totalBalance: 50.00004,
          paymentInProccess: true,
          creditCardTypes: [],
          consumerTypes: [],
          CFDIUses:[],
          idCountry: countryCodes.mexico
        }
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    };

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock
    });

    $rootScope.$apply();

    expect(smsSettingsCtrl.showDNI(countryCodes.argentina, smsSettingsCtrl.PAYMENT_METHOD.TR, smsSettingsCtrl.CONSUMER_TYPE.RI)).toBe(false);
    expect(smsSettingsCtrl.showDNI(countryCodes.mexico, smsSettingsCtrl.PAYMENT_METHOD.TR,smsSettingsCtrl.CONSUMER_TYPE.RFC)).toBe(false);
    expect(smsSettingsCtrl.showDNI(countryCodes.argentina, smsSettingsCtrl.PAYMENT_METHOD.CC, smsSettingsCtrl.CONSUMER_TYPE.CF)).toBe(false);
  });

  it('should complete map correctly fields into service for Colombia transfer', function () {
    var $scope = $rootScope.$new();
    var colombiaCountryCode = 49;

    smsSettingsServiceMock.getUserSmsData = function() {
      var result = {
        status:200,
        data: 
        {
          enabledCountries:[],
          selectedCountries: ["AR"],
          totalBalance: 50.00004,
          paymentInProccess: true,
          creditCardTypes: [],
          consumerTypes: [],
          CFDIUses:[],
          idCountry: colombiaCountryCode
        }
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    };

    smsSettingsServiceMock.buySmsCredits = function() {
      var deferred = $q.defer();
      deferred.resolve({success: true});
      return deferred.promise;
    };

    var form = {
      '$valid': true,
      '$setPristine': function(){},
      '$submitted': true
    };

    var smsSettingsCtrl = $controller('smsSettingsCtrl', {
      $scope: $scope,
      $translate: $translate,
      smsSettingsService: smsSettingsServiceMock,
      ModalService: {
        showModal: function () { 
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        }
      },
      creditToBuy: 30
    });
    smsSettingsCtrl.selectedPaymentMethod = smsSettingsCtrl.PAYMENT_METHOD.TR;
    smsSettingsCtrl.paymentData = {
      billingInformation: {
        cuit: 1235544,
        companyName: 'Some name',
        responsableIVA: true,
        ccExpMonth: null, 
        ccExpYear: null,
        idCCType: null,
        idConsumerType: null,
        CFDIUse: null,
        paymentType: null,
        paymentWay: null,
        idCountry: 49
      }
    };
    var previousPaymentData = smsSettingsCtrl.paymentData.billingInformation;
    spyOn(smsSettingsServiceMock, 'buySmsCredits').and.callThrough();
    smsSettingsCtrl.buy(form);

    $rootScope.$apply();
    expect(smsSettingsServiceMock.buySmsCredits).toHaveBeenCalled();
    expect(smsSettingsServiceMock.buySmsCredits).toHaveBeenCalledWith(previousPaymentData, smsSettingsCtrl.creditToBuy,  smsSettingsCtrl.PAYMENT_METHOD.TR);
  });
});
