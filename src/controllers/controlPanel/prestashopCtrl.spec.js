'use strict';

describe('prestashopCtrl tests', function () {
  var $controller, $rootScope;
  var $q,
    ModalService,
    $translate = {
      instant: function (text) {
        return text;
      },
      onReady: function () {
        return createResolvePromise({});
      },
    };

  var prestashopServiceMock = {};
  var INTEGRATION_CODES = {
    VTEX: 5,
  };

  var INTEGRATION_ERROR_CODES = {};

  var IMPORTING_STATE_STR = {
    IMPORTING_SUBSCRIBERS: 5,
  };

  beforeEach(module('dopplerApp.controlPanel'));

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('prestashopService', prestashopServiceMock);
      $provide.value('$translate', $translate);
      $provide.value('ModalService', ModalService);
      $provide.value('INTEGRATION_CODES', INTEGRATION_CODES);
      $provide.value('INTEGRATION_ERROR_CODES', INTEGRATION_ERROR_CODES);
      $provide.value('IMPORTING_STATE_STR', IMPORTING_STATE_STR);
    });
  });

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('should load ctrl without fail', function () {
    //Arrange
    mockGetStatusDisconnected();
    mockGetUserList();
    // Act
    var prestaCtrl = $controller('prestashopCtrl', {});
  });

  it('should connect to prestashop', function () {
    // Arrange
    mockGetUserList();
    mockGetStatus();
    mockConnect();
    var $scope = $rootScope.$new();

    // Act
    var prestaCtrl = $controller('prestashopCtrl', {});
    prestaCtrl.integrationData = {
      appKey: 'zfdsflksjfsld000',
      url: 'http://mysite.com',
      listId: 15512,
    };

    prestaCtrl.connect();
    $rootScope.$apply();

    // Assert
    expect(prestaCtrl.connected).toBeTruthy();
  });

  it('should get status is connected on load', function () {
    //Arrange
    mockGetStatus();

    // Act
    var prestaCtrl = $controller('prestashopCtrl', {});
    $rootScope.$apply();

    // Assert
    expect(prestaCtrl.connected).toBeTruthy();
    expect(prestaCtrl.lists).toBe(undefined);
  });

  it('should get sincronize and get list status without fail', function () {
    //Arrange
    mockGetStatus();
    mockDoManualSync();
    mockGetListStatusReady();

    // Act
    var prestaCtrl = $controller('prestashopCtrl', {});
    $rootScope.$apply();

    prestaCtrl.synchronize();
  });

  function createResolvePromise(object) {
    var deferred = $q.defer();
    deferred.resolve(object);
    return deferred.promise;
  }

  function mockDoManualSync() {
    prestashopServiceMock.manualSync = function () {
      var response = {
        success: true,
      };
      return createResolvePromise(response);
    };
  }

  function mockGetListStatusReady() {
    prestashopServiceMock.getChangedState = function () {
      var response = {
        success: true,
        arePending: false,
      };
      return createResolvePromise(response);
    };
  }

  function mockGetStatusDisconnected() {
    prestashopServiceMock.getStatus = function () {
      var result = {
        success: true,
        connected: false,
      };
      return createResolvePromise(result);
    };
  }

  function mockGetUserList() {
    prestashopServiceMock.getUserLists = function () {
      var listResult = {
        success: true,
        lists: [{ IdList: 21255, ListName: 'List1' }],
      };
      return createResolvePromise(listResult);
    };
  }

  function mockConnect() {
    prestashopServiceMock.connect = function () {
      var result = {
        success: true,
        connect: true,
      };
      return createResolvePromise(result);
    };
  }

  function mockGetStatus() {
    prestashopServiceMock.getStatus = function () {
      var result = {
        success: true,
        connected: true,
      };
      return createResolvePromise(result);
    };
  }
});
