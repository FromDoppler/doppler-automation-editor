'use strict';

describe('vtex integration', function() {
  beforeEach(module('dopplerApp.controlPanel'));

  var vtexDataMock = {
    getStatus: function(connected){
      var result;
      if (connected) {
        result =  {
          success: true,
          connected: true,
          lastSyncDate: '01/01/2011',
          ListName: 'Vtex list',
          subscribersCount: 4,
          subscriberListStatus: 'ImportingSubscribers',
          idThirdPartyApp: 5,
          IdList: 155,
          model: { AccountName: 'dopplerStore' },
          integratedLists: [{IdList:5002}]
        };
      } else {
        result =  {
          success: false,
          connected: false
        };
      }
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getUserLists: function(connected) {
       var listResult;
       if (!connected) {
        listResult =  {
          lists: [{ IdList: 5002 }, {IdList:5003}],
          listId: 1225,
          success: true
        };
      } else {
        listResult =  {
          lists: [{ IdList: 5002 }, { IdList: 5003 }],
          listId: 1225,
          success: true,
          idListDefault: 0
        };
      }
      var deferred = $q.defer();
      deferred.resolve(listResult);
      return deferred.promise;
    },
    getUserEntities: function(connected) {
      var listResult;
      if (!connected) {
        listResult =  {
          lists: { entities: ["Entity1", "Entity2"] },
          success: true
        };
      } else {
        listResult =  {
          lists: { entities: ["Entity1", "Entity2"] },
          success: true,
        };
      }
      var deferred = $q.defer();
      deferred.resolve(listResult);
      return deferred.promise;
    },
    getChangedListState: function(pending){
      var response;
      if (!pending) {
        response =  {
          arePending: false,
          success: true
        };
      } else {
        response =  {
          arePending: true,
          success: true
        };
      }
      var deferred = $q.defer();
      deferred.resolve(response);
      return deferred.promise;
    },
    connect_success: function(){
      var result =  {
        success: true,
        lastSyncDate: '01/01/2001',
        store: 'other store'
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getSyncListData: function(){
       var result =  {
        SubscribersCount: 3
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getFields: function(){
      var result =  {
        success: true,
        fields: []
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    getFieldTypes: function () {
      var result = {
        success: true,
        types: []
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    },
    newFieldDefaults: function () {
      var result = {
        index: null,
        name: '',
        dataType: 2,
        isPrivate: "true",
        error: null
      };
      var deferred = $q.defer();
      deferred.resolve(result);
      return deferred.promise;
    }
  };

  var vtexServiceMock = {
    getIntegrationStatus: {},
    getUserLists: {},
    getUserEntities: {},
    getChangedState: {},
    getListData: {}
  };

  var INTEGRATION_CODES = {
    VTEX: 5
  }
  var IMPORTING_STATE = {
    IMPORTING_SUBSCRIBERS: 5
  }

  var IMPORTING_STATE_STR = {
    IMPORTING_SUBSCRIBERS: 5
  }

  var BASIC_FIELD = {
    EMAIL: 5
  }

  var VTEX_FIELD_TYPE = {
    EMAIL: 'Email'
  }

  var FIELD_TYPE = {
    BOOLEAN: 0,
    COUNTRY: 6,
    DATE: 3,
    EMAIL: 4,
    GENDER: 5,
    REAL: 1,
    STRING: 2,
    CONSENT: 7,
    ORIGIN: 8,
    SCORE: 9,
    PHONE: 10,
    PERMISSION: 11
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
  var ModalService;
  var $q;
  var $timeout;

  beforeEach(function() {
    module(function($provide) {
      $provide.value('$translate', $translate);
      $provide.value('vtexService', vtexServiceMock);
      $provide.value('ModalService', ModalService);
      $provide.value('$timeout', $timeout);
      $provide.value('INTEGRATION_CODES', INTEGRATION_CODES);
      $provide.value('IMPORTING_STATE', IMPORTING_STATE);
      $provide.value('IMPORTING_STATE_STR', IMPORTING_STATE_STR);
      $provide.value('BASIC_FIELD', BASIC_FIELD);
      $provide.value('VTEX_FIELD_TYPE', VTEX_FIELD_TYPE);
      $provide.value('FIELD_TYPE', FIELD_TYPE);
    });
  });

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));


  xit('load page with not connected user', function() {
    var $scope = $rootScope.$new();

    vtexServiceMock.getIntegrationStatus = function() {
      return vtexDataMock.getStatus(false);
    };

    vtexServiceMock.getUserLists = function(){
      return vtexDataMock.getUserLists(false);
    };

    vtexServiceMock.getUserEntities = function(){
      return vtexDataMock.getUserEntities(false);
    };

    // Act
    var vtexController = $controller('vtexIntegrationCtrl', {
      $scope: $rootScope.$new(),
      $translate: $translate,
      ModalService: ModalService,
      vtexService: vtexServiceMock,
      $timeout: $timeout
    });
     $rootScope.$apply();

    // Assert
    expect(vtexController).not.toBeUndefined();
    expect(vtexController.connected).toBeFalsy();

  });

  it('load page with connected user', function() {
    var $scope = $rootScope.$new();

    vtexServiceMock.getIntegrationStatus = function() {
       return vtexDataMock.getStatus(true);
    };

    vtexServiceMock.getChangedState = function(){
      return vtexDataMock.getChangedListState(false);
    };

    vtexServiceMock.getListData = function() {
      return vtexDataMock.getSyncListData();
    }

    vtexServiceMock.getUserLists = function(){
      return vtexDataMock.getUserLists(true);
    };

    vtexServiceMock.getVtexEntities = function(){
      return vtexDataMock.getUserEntities(true);
    };

    vtexServiceMock.getFields = function(){
      return vtexDataMock.getFields();
    };

    vtexServiceMock.getFieldTypes = function () {
      return vtexDataMock.getFieldTypes();
    };

    // Act
    var vtexController = $controller('vtexIntegrationCtrl', {
      $scope: $rootScope.$new(),
      $translate: $translate,
      ModalService: ModalService,
      vtexService: vtexServiceMock,
      $timeout: $timeout
    });
    $rootScope.$apply();
    // Assert
    expect(vtexController).not.toBeUndefined();
    expect(vtexController.connected).toBeTruthy();
    expect(vtexController.connectedStore).not.toBeUndefined();

  });

  it('filters user list with already integrated lists', function () {
    // Arrange
    var $scope = $rootScope.$new();

    vtexServiceMock.getIntegrationStatus = function () {
      return vtexDataMock.getStatus(true);
    };

    vtexServiceMock.getListData = function () {
      return vtexDataMock.getSyncListData();
    }

    vtexServiceMock.getUserLists = function () {
      return vtexDataMock.getUserLists(true);
    };

    vtexServiceMock.getVtexEntities = function () {
      return vtexDataMock.getUserEntities(true);
    };

    // Act
    var vtexController = $controller('vtexIntegrationCtrl', {
      $scope: $rootScope.$new(),
      $translate: $translate,
      ModalService: ModalService,
      vtexService: vtexServiceMock,
      $timeout: $timeout
    });
    $rootScope.$apply();
    // Assert
    expect(vtexController.integratedLists).not.toBeUndefined();
    expect(vtexController.userList).not.toBeUndefined();
    expect(vtexController.userList.length).toBeLessThan(vtexController.allUserList.length);

  });

});
