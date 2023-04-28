'use strict';

describe('AutomationComponent', function () {
  beforeEach(module('dopplerApp.automation.editor'));

  var AutomationComponent;
  var COMPONENT_TYPE;
  var AUTOMATION_TYPE;
  var AUTOMATION_STATE;
  var AUTOMATION_COMPLETED_STATE;
  var DOMAIN_STATUS;
  var SEND_TYPE;
  var CONDITION_OPERATOR;
  var TIME_UNIT;
  var TIMES_BACK_AUTOMATION;
  var $translate;
  var ModalService;
  var goToService;

  beforeEach(function () {
    module(function ($provide) {
      $provide.value('$translate', $translate);
      $provide.value('DOMAIN_STATUS', DOMAIN_STATUS);
      $provide.value('ModalService', ModalService);
      $provide.value('goToService', goToService);
    });
  });

  beforeEach(inject(function (
    _AutomationComponent_,
    _COMPONENT_TYPE_,
    _AUTOMATION_TYPE_,
    _AUTOMATION_STATE_,
    _AUTOMATION_COMPLETED_STATE_,
    _SEND_TYPE_,
    _CONDITION_OPERATOR_,
    _TIME_UNIT_,
    _TIMES_BACK_AUTOMATION_
  ) {
    AutomationComponent = _AutomationComponent_;
    COMPONENT_TYPE = _COMPONENT_TYPE_;
    AUTOMATION_TYPE = _AUTOMATION_TYPE_;
    AUTOMATION_STATE = _AUTOMATION_STATE_;
    AUTOMATION_COMPLETED_STATE = _AUTOMATION_COMPLETED_STATE_;
    SEND_TYPE = _SEND_TYPE_;
    CONDITION_OPERATOR = _CONDITION_OPERATOR_;
    TIME_UNIT = _TIME_UNIT_;
    TIMES_BACK_AUTOMATION = _TIMES_BACK_AUTOMATION_;
  }));

  it('should be able to instantiate a new EMPTY Automation component for Subscription List', function () {
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SUBSCRIPTION_LIST,
    };
    // Act
    var emptyAutomationComponent = new AutomationComponent(
      automationComponentParams
    );

    // Assert
    expect(emptyAutomationComponent).not.toBeUndefined();
    expect(emptyAutomationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(emptyAutomationComponent.name).toEqual('');
    expect(emptyAutomationComponent.id).toEqual('');
    expect(emptyAutomationComponent.state).toEqual(AUTOMATION_STATE.DRAFT);
    expect(emptyAutomationComponent.initialCondition.type).toEqual(
      emptyAutomationComponent.automationType
    );
    expect(emptyAutomationComponent.completed).toEqual(0);
  });

  it('should be able to instantiate a new automation component with data for Subscription List', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SUBSCRIPTION_LIST,
      completed: AUTOMATION_COMPLETED_STATE.INCOMPLETE,
      name: 'Automation Name',
      id: 12002,
    };

    // Act
    var automationComponent = new AutomationComponent(
      automationComponentParams
    );
    // Assert
    expect(automationComponent).not.toBeUndefined();
    expect(automationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationComponent.completed).toBe(
      automationComponentParams.completed
    );
    expect(automationComponent.name).toBe(automationComponentParams.name);
    expect(automationComponent.id).toBe(automationComponentParams.id);
  });

  it('should be able to instantiate a new EMPTY Automation component for Scheduled Date', function () {
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SCHEDULED_DATE,
    };
    // Act
    var emptyAutomationComponent = new AutomationComponent(
      automationComponentParams
    );

    // Assert
    expect(emptyAutomationComponent).not.toBeUndefined();
    expect(emptyAutomationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(emptyAutomationComponent.name).toEqual('');
    expect(emptyAutomationComponent.initialCondition.frequency).toEqual(null);
    expect(emptyAutomationComponent.initialCondition.suscriptionLists).toEqual(
      []
    );
    expect(emptyAutomationComponent.id).toEqual('');
    expect(emptyAutomationComponent.state).toEqual(AUTOMATION_STATE.DRAFT);
    expect(emptyAutomationComponent.initialCondition.type).toEqual(
      emptyAutomationComponent.automationType
    );
    expect(emptyAutomationComponent.completed).toEqual(0);
  });

  it('should be able to instantiate a new automation component with data for Scheduled Date', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SCHEDULED_DATE,
      completed: AUTOMATION_COMPLETED_STATE.INCOMPLETE,
      name: 'Automation Name',
      id: 12002,
      initialCondition: {
        frequency: {
          day: 1,
          time: {
            hour: 2,
            minute: 45,
          },
          timezone: 6,
          uid: 0,
          type: 'day_month',
          completed: false,
          touched: false,
          parentUid: 0,
        },
        suscriptionLists: [],
      },
    };

    // Act
    var automationComponent = new AutomationComponent(
      automationComponentParams
    );
    // Assert
    expect(automationComponent).not.toBeUndefined();
    expect(automationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationComponent.initialCondition.frequency.day).toEqual(1);
    expect(automationComponent.initialCondition.suscriptionLists).toEqual([]);
    expect(automationComponent.completed).toBe(
      automationComponentParams.completed
    );
    expect(automationComponent.name).toBe(automationComponentParams.name);
    expect(automationComponent.id).toBe(automationComponentParams.id);
  });

  it('should be able to instantiate a new EMPTY Automation component for Campaign Behavior', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.CAMPAIGN_BEHAVIOR,
    };
    // Act
    var emptyAutomationComponent = new AutomationComponent(
      automationComponentParams
    );

    // Assert
    expect(emptyAutomationComponent).not.toBeUndefined();
    expect(emptyAutomationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(emptyAutomationComponent.name).toEqual('');
    expect(emptyAutomationComponent.id).toEqual('');
    expect(emptyAutomationComponent.state).toEqual(AUTOMATION_STATE.DRAFT);
    expect(emptyAutomationComponent.initialCondition.type).toEqual(
      emptyAutomationComponent.automationType
    );
    expect(emptyAutomationComponent.completed).toEqual(0);
  });

  it('should be able to instantiate a new automation component with data for Campaign Behavior', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.CAMPAIGN_BEHAVIOR,
      completed: AUTOMATION_COMPLETED_STATE.INCOMPLETE,
      name: 'Automation Name',
      id: 12002,
      initialCondition: {
        sendType: SEND_TYPE.INMEDIATE,
        confirmationEmailList: [],
      },
    };

    // Act
    var automationComponent = new AutomationComponent(
      automationComponentParams
    );
    // Assert
    expect(automationComponent).not.toBeUndefined();
    expect(automationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationComponent.initialCondition.sendType).toBe(
      automationComponentParams.initialCondition.sendType
    );
    expect(automationComponent.initialCondition.confirmationEmailList).toEqual(
      []
    );
    expect(automationComponent.completed).toBe(
      automationComponentParams.completed
    );
    expect(automationComponent.name).toBe(automationComponentParams.name);
    expect(automationComponent.id).toBe(automationComponentParams.id);
  });

  it('should be able to instantiate a new EMPTY Automation component for Rss to email', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.RSS_TO_EMAIL,
    };
    // Act
    var emptyAutomationComponent = new AutomationComponent(
      automationComponentParams
    );

    // Assert
    expect(emptyAutomationComponent).not.toBeUndefined();
    expect(emptyAutomationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(emptyAutomationComponent.name).toEqual('');
    expect(emptyAutomationComponent.id).toEqual('');
    expect(emptyAutomationComponent.state).toEqual(AUTOMATION_STATE.DRAFT);
    expect(emptyAutomationComponent.initialCondition.type).toEqual(
      emptyAutomationComponent.automationType
    );
    expect(emptyAutomationComponent.completed).toEqual(0);
  });

  it('should be able to instantiate a new automation component with data for Rss to email', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.RSS_TO_EMAIL,
      completed: AUTOMATION_COMPLETED_STATE.INCOMPLETE,
      name: 'Automation Name',
      id: 12002,
    };

    // Act
    var automationComponent = new AutomationComponent(
      automationComponentParams
    );
    // Assert
    expect(automationComponent).not.toBeUndefined();
    expect(automationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationComponent.completed).toBe(
      automationComponentParams.completed
    );
    expect(automationComponent.name).toBe(automationComponentParams.name);
    expect(automationComponent.id).toBe(automationComponentParams.id);
  });

  it('should be able to instantiate a new EMPTY Automation component for Site behavior', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
    };
    // Act
    var emptyAutomationComponent = new AutomationComponent(
      automationComponentParams
    );

    // Assert
    expect(emptyAutomationComponent).not.toBeUndefined();
    expect(emptyAutomationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(emptyAutomationComponent.name).toEqual('');
    expect(emptyAutomationComponent.id).toEqual('');
    expect(emptyAutomationComponent.state).toEqual(AUTOMATION_STATE.DRAFT);
    expect(emptyAutomationComponent.initialCondition.type).toEqual(
      emptyAutomationComponent.automationType
    );
    expect(emptyAutomationComponent.completed).toEqual(0);
  });

  it('should be able to instantiate a new automation component with data for Site Behavior', function () {
    // Arrange
    var automationComponentParams = {
      automationType: AUTOMATION_TYPE.SITE_BEHAVIOR,
      completed: AUTOMATION_COMPLETED_STATE.INCOMPLETE,
      name: 'Automation Name',
      id: 12002,
      initialCondition: {
        operator: CONDITION_OPERATOR.OR,
        verificationTime: 12,
        domains: [],
        timeUnit: TIME_UNIT.HOURS,
        timesBackAutomation: TIMES_BACK_AUTOMATION.ONE_TIME,
      },
    };

    // Act
    var automationComponent = new AutomationComponent(
      automationComponentParams
    );
    // Assert
    expect(automationComponent).not.toBeUndefined();
    expect(automationComponent.type).toEqual(COMPONENT_TYPE.AUTOMATION);
    expect(automationComponent.initialCondition.operator).toBe(
      automationComponentParams.initialCondition.operator
    );
    expect(automationComponent.initialCondition.verificationTime).toBe(
      automationComponentParams.initialCondition.verificationTime
    );
    expect(automationComponent.initialCondition.timeUnit).toBe(
      automationComponentParams.initialCondition.timeUnit
    );
    expect(automationComponent.initialCondition.timesBackAutomation).toBe(
      automationComponentParams.initialCondition.timesBackAutomation
    );
    expect(automationComponent.initialCondition.domains).toEqual([]);
    expect(automationComponent.completed).toBe(
      automationComponentParams.completed
    );
    expect(automationComponent.name).toBe(automationComponentParams.name);
    expect(automationComponent.id).toBe(automationComponentParams.id);
  });
});
