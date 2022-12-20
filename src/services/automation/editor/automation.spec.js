'use strict';

describe('automation', function() {
  beforeEach(module('dopplerApp.automation.editor'));

  var AutomationComponent;
  var $q;
  var settingsService;
  var userFieldsDataservice;
  var automation;
  var changesManager;
  var AUTOMATION_TYPE;
  var AUTOMATION_COMPLETED_STATE;
  var $rootScope;
  var COMPONENT_TYPE;
  var FIELD_TYPE;
  var FREQUENCY_TYPE;
  var ModalService;
  var goToService;

  var DOMAIN_STATUS = {
    PENDING: 1,
    VERIFIED: 2
  };

  var $translate = {
    instant: function(key) {
      return 'text';
    }
  };

  var settingsServiceMock = {
    getSettings: function(data) {
      var response = {
        domains: data.domains || [],
        siteTrackingActive: data.siteTrackingActive || false
      };

      var deferred = $q.defer();
      deferred.resolve(response);
      return deferred.promise;
    }
  };

  var userFieldsDataservice = {
    getDeletedFieldsByType: function(customFields, fieldType) {
      return [{id: 1, fieldName: 'example' }];
    }
  }


  beforeEach(function() {

    module(function($provide) {
      $provide.value('$translate', $translate);
      $provide.value('DOMAIN_STATUS', DOMAIN_STATUS);
      $provide.value('userFieldsDataservice', userFieldsDataservice);
      $provide.value('ModalService', ModalService);
      $provide.value('goToService', goToService);
    });

    inject(function($injector) {
      automation = $injector.get('automation');
    });

  });

  beforeEach(inject(function(_$q_,_settingsService_, _changesManager_, _AUTOMATION_TYPE_, _AUTOMATION_COMPLETED_STATE_, _$rootScope_, _COMPONENT_TYPE_, _FIELD_TYPE_, _FREQUENCY_TYPE_) {
    $q = _$q_;
    settingsService = _settingsService_;
    changesManager = _changesManager_;
    AUTOMATION_TYPE = _AUTOMATION_TYPE_;
    AUTOMATION_COMPLETED_STATE = _AUTOMATION_COMPLETED_STATE_;
    $rootScope = _$rootScope_;
    COMPONENT_TYPE = _COMPONENT_TYPE_;
    FIELD_TYPE = _FIELD_TYPE_;
    FREQUENCY_TYPE = _FREQUENCY_TYPE_;
  }));

  it('should be able to load an empty suscription list automation and has an incomplete state', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({});
    };

    automation.setData({
        type: COMPONENT_TYPE.AUTOMATION,
        automationType: AUTOMATION_TYPE.SUBSCRIPTION_LIST,
        id: 0
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.INCOMPLETE);
  });

  it('should be able to load an empty site behavior automation with site tracking disabled', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({siteTrackingActive: false});
    };

    automation.setData({
        type: COMPONENT_TYPE.AUTOMATION,
        automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
        id: 0
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED);
  });

  it('should be able to load a site behavior automation with deleted domains', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({siteTrackingActive: true});
    };

    automation.setData({
        type: COMPONENT_TYPE.AUTOMATION,
        automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
        id: 0
    });

    var model = automation.getModel();
    model.setData({
      initialCondition: {
        type: AUTOMATION_TYPE.SITE_BEHAVIOR,
        parentUid: 0,
        domains: [{ url: 'google.com', idDomain: 1}]
      }
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN);
  });

  it('should be able to load a site behavior automation with non registred domain', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({siteTrackingActive: true});
    };

    automation.setData({
      type: COMPONENT_TYPE.AUTOMATION,
      automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
      id: 0
    });

    var model = automation.getModel();
    model.setData({
      initialCondition: {
        type: AUTOMATION_TYPE.SITE_BEHAVIOR,
        parentUid: 0,
        domains: [{ url: 'google.com', idDomain: 0 }]
      }
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN);
  });

  it('should be able to load a site behavior automation with non verified domain', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({
        siteTrackingActive: true,
        domains: [{ url: 'google.com', IdDomain: 1, status: DOMAIN_STATUS.PENDING }]
      });
    };

    automation.setData({
      type: COMPONENT_TYPE.AUTOMATION,
      automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
      id: 0
    });

    var model = automation.getModel();
    model.setData({
      initialCondition: {
        type: AUTOMATION_TYPE.SITE_BEHAVIOR,
        parentUid: 0,
        domains: [{ url: 'google.com', idDomain: 1}]
      }
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN);
  });

  it('should be able to load a site behavior automation with registred domain and verified', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({
        siteTrackingActive: true,
        domains: [{ Url: 'google.com', IdDomain: 1, Status: DOMAIN_STATUS.VERIFIED }]
      });
    };

    automation.setData({
      type: COMPONENT_TYPE.AUTOMATION,
      automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
      id: 0
    });

    var model = automation.getModel();
    model.setData({
      initialCondition: {
        type: AUTOMATION_TYPE.SITE_BEHAVIOR,
        parentUid: 0,
        domains: [{ url: 'google.com', idDomain: 1, status: DOMAIN_STATUS.VERIFIED}]
      }
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.INCOMPLETE);
  });

  it('should be able to load a scheduled date automation with deleted fields', function() {

    // Arrange
    var $scope = $rootScope.$new();
    settingsService.getSettings = function() {
      return settingsServiceMock.getSettings({});
    };

    automation.setData({
      type: COMPONENT_TYPE.AUTOMATION,
      automationType: AUTOMATION_TYPE.SCHEDULED_DATE,
      id: 0
    });

    var model = automation.getModel();
    model.setData({
      initialCondition: {
        type: AUTOMATION_TYPE.SCHEDULED_DATE,
        parentUid: 0,
        frequency: {
          date: new Date().toISOString(),
          time: {
            hour: parseInt('11'),
            minute: parseInt('04')
          },
          timezone: parseInt('21'),
          type: FREQUENCY_TYPE.DAY_YEAR
        }
      }
    });

    // Act
    automation.updateAutomationFlowState();
    $rootScope.$apply();
    var automationModel = automation.getModel();

    // Assert
    expect(automationModel.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationModel.completed).toBe(AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS);
  });

});
