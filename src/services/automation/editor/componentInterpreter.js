(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('componentInterpreter', componentInterpreter);

  componentInterpreter.$inject = [
    'ActionComponent',
    'AutomationComponent',
    'BooleanField',
    'CAMPAIGN_TYPE',
    'CampaignBehavior',
    'CampaignBehaviorCondition',
    'CampaignComponent',
    'CampaignRssComponent',
    'COMPONENT_TYPE',
    'CONDITION_TYPE',
    'CONDITIONAL_TYPE',
    'ACTION_TYPE',
    'ConditionComponent',
    'CountryField',
    'DateField',
    'DayWeekFrequency',
    'DayMonthFrequency',
    'DayYearFrequency',
    'DateFrequency',
    'DelayComponent',
    'FIELD_TYPE',
    'FREQUENCY_TYPE',
    'GenderField',
    'ListMembership',
    'NumberField',
    'RssCondition',
    'ScheduledDateCondition',
    'SiteBehaviorCondition',
    'SubscriberInformation',
    'SubscriptionListCondition',
    'TextField',
    'AddSubscriberToList',
    'ResendEmail',
    'ConsentField',
    'OriginField',
    'ScoreField',
    'SiteBehavior',
    'RemoveSubscriberFromList',
    'ChangeSubscriberField',
    'SmsComponent',
    'DynamicContentCondition',
    'AbandonedCartInformation',
    'PushComponent',
    'PushNotificationCondition',
    'GotoComponent'
  ];

  function componentInterpreter(ActionComponent, AutomationComponent, BooleanField, CAMPAIGN_TYPE, CampaignBehavior,
    CampaignBehaviorCondition, CampaignComponent, CampaignRssComponent, COMPONENT_TYPE, CONDITION_TYPE,
    CONDITIONAL_TYPE, ACTION_TYPE, ConditionComponent, CountryField, DateField, DayWeekFrequency, DayMonthFrequency,
    DayYearFrequency, DateFrequency, DelayComponent, FIELD_TYPE, FREQUENCY_TYPE, GenderField, ListMembership,
    NumberField, RssCondition, ScheduledDateCondition, SiteBehaviorCondition, SubscriberInformation,
    SubscriptionListCondition, TextField, AddSubscriberToList, ResendEmail, ConsentField, OriginField,
    ScoreField, SiteBehavior, RemoveSubscriberFromList, ChangeSubscriberField, SmsComponent,
    DynamicContentCondition, AbandonedCartInformation, PushComponent, PushNotificationCondition,
    GotoComponent  ) {
    var service = {
      createComponent: createComponent,
      createCondition: createCondition,
      createConditional: createConditional,
      createFrequency: createFrequency,
      createOperation: createOperation,
      createSubscriberField: createSubscriberField
    };

    return service;

    /**
     * Creates a new component based on its type with all its children and custom components.
     * @param  {Object} rawComponent the plain object to be created as a component.
     * @return the component's new instance.
     */
    function createComponent(rawComponent) {
      var component;

      switch (rawComponent.type) {
      case COMPONENT_TYPE.AUTOMATION:
        component = new AutomationComponent(rawComponent);
        break;

      case COMPONENT_TYPE.ACTION:
        component = new ActionComponent(rawComponent);
        break;

      case COMPONENT_TYPE.CAMPAIGN:
        if (rawComponent.campaignType === CAMPAIGN_TYPE.CAMPAIGN_RSS) {
          component = new CampaignRssComponent(rawComponent);
        } else {
          component = new CampaignComponent(rawComponent);
        }
        break;

      case COMPONENT_TYPE.CONDITION:
        component = new ConditionComponent(rawComponent);
        break;

      case COMPONENT_TYPE.DELAY:
        rawComponent.hasUnsavedChanges = false;
        component = new DelayComponent(rawComponent);
        break;

      case COMPONENT_TYPE.SMS:
        component = new SmsComponent(rawComponent);
        break;

      case COMPONENT_TYPE.PUSH_NOTIFICATION:
        component = new PushComponent(rawComponent);
          break;

        case COMPONENT_TYPE.GOTO_STEP:
        component = new GotoComponent(rawComponent);
        break;

      default:
        throw new Error('Component with unknown type cannot be parsed.');
      }

      return component;
    }

    function createCondition(rawCondition) {
      var condition;

      switch (rawCondition.type) {
      case CONDITION_TYPE.SUBSCRIPTION_LIST:
        condition = new SubscriptionListCondition(rawCondition);
        break;

      case CONDITION_TYPE.SCHEDULED_DATE:
        condition = new ScheduledDateCondition(rawCondition);
        break;

      case CONDITION_TYPE.RSS_TO_EMAIL:
        condition = new RssCondition(rawCondition);
        break;

      case CONDITION_TYPE.CAMPAIGN_BEHAVIOR:
        condition = new CampaignBehaviorCondition(rawCondition);
        break;

      case CONDITION_TYPE.SITE_BEHAVIOR:
        condition = new SiteBehaviorCondition(rawCondition);
        break;

      case CONDITION_TYPE.DYNAMIC_CONTENT:
        condition = new DynamicContentCondition(rawCondition);
        break;

      case CONDITION_TYPE.PUSH:
        condition = new PushNotificationCondition(rawCondition);
        break;

      case CONDITION_TYPE.NONE:
        break;

      default:
        throw new Error('Condition with unknown type cannot be parsed.');
      }

      return condition;
    }

    function createConditional(rawConditional) {
      var conditional;

      switch (rawConditional.type) {
      case CONDITIONAL_TYPE.SUBSCRIBER_INFORMATION:
        conditional = new SubscriberInformation(rawConditional);
        break;

      case CONDITIONAL_TYPE.SITE_BEHAVIOR:
        conditional = new SiteBehavior(rawConditional);
        break;

      case CONDITIONAL_TYPE.LIST_MEMBERSHIP:
        conditional = new ListMembership(rawConditional);
        break;

      case CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR:
        conditional = new CampaignBehavior(rawConditional);
        break;
      case CONDITIONAL_TYPE.ABANDONED_CART_INFORMATION:
        conditional = new AbandonedCartInformation(rawConditional);
        break;

      default:
        throw new Error('Conditional with unknown type cannot be parsed.');
      }

      return conditional;
    }

    function createFrequency(rawFrequency) {
      var frequency;

      switch (rawFrequency.type) {
      case FREQUENCY_TYPE.DAY_WEEK:
        frequency = new DayWeekFrequency(rawFrequency);
        break;

      case FREQUENCY_TYPE.DAY_MONTH:
        frequency = new DayMonthFrequency(rawFrequency);
        break;

      case FREQUENCY_TYPE.DAY_YEAR:
        frequency = new DayYearFrequency(rawFrequency);
        break;

      case FREQUENCY_TYPE.DATE:
        frequency = new DateFrequency(rawFrequency);
        break;

      default:
        throw new Error('Frequency with unknown type cannot be parsed.');
      }

      return frequency;
    }

    function createOperation(rawOperation) {
      var operation;

      switch (rawOperation.type) {
      case ACTION_TYPE.ASSOCIATE_SUBSCRIBER_TO_LIST:
        operation = new AddSubscriberToList(rawOperation);
        break;
      case ACTION_TYPE.RESEND_EMAIL:
        operation = new ResendEmail(rawOperation);
        break;
      case ACTION_TYPE.REMOVE_SUBSCRIBER_FROM_LIST:
        operation = new RemoveSubscriberFromList(rawOperation);
        break;
      case ACTION_TYPE.CHANGE_SUBSCRIBER_FIELD:
        operation = new ChangeSubscriberField(rawOperation);
        break;

      default:
        throw new Error('Operation with unknown type cannot be parsed.');
      }

      return operation;
    }

    function createSubscriberField(rawSubscriberField) {
      var subscriberField;

      switch (rawSubscriberField.type) {
      case FIELD_TYPE.COUNTRY:
        subscriberField = new CountryField(rawSubscriberField);
        break;

      case FIELD_TYPE.DATE:
        subscriberField = new DateField(rawSubscriberField);
        break;

      case FIELD_TYPE.EMAIL:
        subscriberField = new TextField(rawSubscriberField);
        break;

      case FIELD_TYPE.GENDER:
        subscriberField = new GenderField(rawSubscriberField);
        break;

      case FIELD_TYPE.STRING:
        subscriberField = new TextField(rawSubscriberField);
        break;

      case FIELD_TYPE.BOOLEAN:
        subscriberField = new BooleanField(rawSubscriberField);
        break;

      case FIELD_TYPE.REAL:
        subscriberField = new NumberField(rawSubscriberField);
        break;

      case FIELD_TYPE.CONSENT:
        subscriberField = new ConsentField(rawSubscriberField);
        break;

      case FIELD_TYPE.SCORE:
        subscriberField = new ScoreField(rawSubscriberField);
        break;

      case FIELD_TYPE.ORIGIN:
        subscriberField = new OriginField(rawSubscriberField);
        break;

      case FIELD_TYPE.PHONE:
        subscriberField = new TextField(rawSubscriberField);
        break;

      case FIELD_TYPE.PERMISSION:
        subscriberField = new BooleanField(rawSubscriberField);
        break;

      default:
        throw new Error('Subscriber field with unknown type cannot be parsed.');
      }

      return subscriberField;
    }
  }
})();
