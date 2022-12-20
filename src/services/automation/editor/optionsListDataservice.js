(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('optionsListDataservice', optionsListDataservice);

  optionsListDataservice.$inject = [
    '$translate',
    'ACTION_TYPE',
    'CONDITIONAL_CRITERIA',
    'CONDITIONAL_EVENT',
    'CONDITIONAL_TYPE',
    'GENDER_TYPE',
    'TIME_UNIT',
    'TIMES_BACK_AUTOMATION',
    'DYNAMIC_CONTENT_HOURS',
    'ABANDONED_CART_INFORMATION_FIELDS'
  ];

  function optionsListDataservice($translate, ACTION_TYPE, CONDITIONAL_CRITERIA, CONDITIONAL_EVENT, CONDITIONAL_TYPE,
    GENDER_TYPE, TIME_UNIT, TIMES_BACK_AUTOMATION, DYNAMIC_CONTENT_HOURS, ABANDONED_CART_INFORMATION_FIELDS) {
    var actionOptions = [{
      label: $translate.instant('automation_editor.components.action.options.associate_subscriber_to_list'),
      value: ACTION_TYPE.ASSOCIATE_SUBSCRIBER_TO_LIST
    }, {
      label: $translate.instant('automation_editor.components.action.options.resend_email'),
      value: ACTION_TYPE.RESEND_EMAIL
    }, {
      label: $translate.instant('automation_editor.components.action.options.remove_subscriber_from_list'),
      value: ACTION_TYPE.REMOVE_SUBSCRIBER_FROM_LIST
    }, {
      label: $translate.instant('automation_editor.components.action.options.change_subscriber_field'),
      value: ACTION_TYPE.CHANGE_SUBSCRIBER_FIELD
    }];

    var booleanOptions = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.boolean.yes'),
      value: true
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.boolean.no'),
      value: false
    }];

    var consentOptions = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.boolean.yes'),
      value: true
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.boolean.no'),
      value: false
    }];

    var timeUnitOptions = [{
      label: $translate.instant('automation_editor.sidebar.time_unit.minutes'),
      value: TIME_UNIT.MINUTES
    }, {
      label: $translate.instant('automation_editor.sidebar.time_unit.hours'),
      value: TIME_UNIT.HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.time_unit.days'),
      value: TIME_UNIT.DAYS
    }, {
      label: $translate.instant('automation_editor.sidebar.time_unit.weeks'),
      value: TIME_UNIT.WEEKS
    }];

    var dayMoments = [{
      label: $translate.instant('automation_editor.components.initial_condition.scheduled_date.day_moment_before'),
      value: 1
    }, {
      label: $translate.instant('automation_editor.components.initial_condition.scheduled_date.day_moment_now'),
      value: 0
    }, {
      label: $translate.instant('automation_editor.components.initial_condition.scheduled_date.day_moment_after'),
      value: 2
    }];

    var pendingPaymentTimeOptions = [{
      label: $translate.instant('automation_editor.sidebar.pending_order.drop_down_time_options.option120'),
      value: DYNAMIC_CONTENT_HOURS.TWO_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.pending_order.drop_down_time_options.option360'),
      value: DYNAMIC_CONTENT_HOURS.SIX_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.pending_order.drop_down_time_options.option1440'),
      value: DYNAMIC_CONTENT_HOURS.TWENTYFOUR_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.pending_order.drop_down_time_options.option2880'),
      value: DYNAMIC_CONTENT_HOURS.FORTYEIGHT_HOURS
    }];

    var abandonedCartTimeOptions = [{
      label: $translate.instant('automation_editor.sidebar.abandoned_cart.drop_down_time_options.option120'),
      value: DYNAMIC_CONTENT_HOURS.TWO_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.abandoned_cart.drop_down_time_options.option360'),
      value: DYNAMIC_CONTENT_HOURS.SIX_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.abandoned_cart.drop_down_time_options.option1440'),
      value: DYNAMIC_CONTENT_HOURS.TWENTYFOUR_HOURS
    }];

    var abandonedCartWaitOptions = [{
      label: $translate.instant('automation_editor.sidebar.abandoned_cart.drop_down_wait_options.option0'),
      value: DYNAMIC_CONTENT_HOURS.ZERO_HOURS
    }];

    var visitedProductsTimeOptions = [{
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_time_options.option1440'),
      value: DYNAMIC_CONTENT_HOURS.TWENTYFOUR_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_time_options.option2880'),
      value: DYNAMIC_CONTENT_HOURS.FORTYEIGHT_HOURS
    }, {
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_time_options.option4320'),
      value: DYNAMIC_CONTENT_HOURS.SEVENTYTWO_HOURS
    }];

    var visitedProductsWaitOptions = [{
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_wait_options.option10080'),
      value: DYNAMIC_CONTENT_HOURS.ONE_WEEK
    }, {
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_wait_options.option20160'),
      value: DYNAMIC_CONTENT_HOURS.TWO_WEEKS
    }, {
      label: $translate.instant('automation_editor.sidebar.visited_products.drop_down_wait_options.option30240'),
      value: DYNAMIC_CONTENT_HOURS.THREE_WEEKS
    }];

    var campaignBehaviorEvents = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.open_email'),
      value: CONDITIONAL_EVENT.OPEN_EMAIL
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.email_not_open'),
      value: CONDITIONAL_EVENT.EMAIL_NOT_OPEN
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.any_link_clicked'),
      value: CONDITIONAL_EVENT.ANY_LINK_CLICKED
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.no_link_clicked'),
      value: CONDITIONAL_EVENT.NO_LINK_CLICKED
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.any_dynamic_link_clicked'),
      value: CONDITIONAL_EVENT.ANY_DYNAMIC_LINK_CLICKED
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.no_dynamic_link_clicked'),
      value: CONDITIONAL_EVENT.NO_DYNAMIC_LINK_CLICKED
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.link_clicked'),
      value: CONDITIONAL_EVENT.LINK_CLICKED
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.events.link_not_clicked'),
      value: CONDITIONAL_EVENT.LINK_NOT_CLICKED
    }];

    var listMembershipEvents = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.list_membership.events.belongs'),
      value: CONDITIONAL_EVENT.BELONGS
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.list_membership.events.not_belongs'),
      value: CONDITIONAL_EVENT.NOT_BELONGS
    }];

    var negativeConditionalEvents = [
      CONDITIONAL_EVENT.EMAIL_NOT_OPEN,
      CONDITIONAL_EVENT.NO_LINK_CLICKED,
      CONDITIONAL_EVENT.LINK_NOT_CLICKED,
      CONDITIONAL_EVENT.NO_VISITED
    ];

    var conditionalOptions = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.label'),
      value: CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.list_membership.label'),
      value: CONDITIONAL_TYPE.LIST_MEMBERSHIP
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.label'),
      value: CONDITIONAL_TYPE.SUBSCRIBER_INFORMATION
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.site_behavior.label'),
      value: CONDITIONAL_TYPE.SITE_BEHAVIOR
    }];

    var comparisonOperators = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.operators.less_than'),
      value: CONDITIONAL_CRITERIA.LESS_THAN
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.operators.less_than_or_equals_to'),
      value: CONDITIONAL_CRITERIA.LESS_THAN_OR_EQUALS_TO
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.operators.greater_than'),
      value: CONDITIONAL_CRITERIA.GREATER_THAN
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.operators.greater_than_or_equals_to'),
      value: CONDITIONAL_CRITERIA.GREATER_THAN_OR_EQUALS_TO
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.operators.equals_to'),
      value: CONDITIONAL_CRITERIA.EQUALS_TO
    }];

    var textFieldCriteria = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.starts_with'),
      value: CONDITIONAL_CRITERIA.STARTS_WITH
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.not_starts_with'),
      value: CONDITIONAL_CRITERIA.NOT_STARTS_WITH
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.contains'),
      value: CONDITIONAL_CRITERIA.CONTAINS
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.not_contains'),
      value: CONDITIONAL_CRITERIA.NOT_CONTAINS
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.ends_with'),
      value: CONDITIONAL_CRITERIA.ENDS_WITH
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.not_ends_with'),
      value: CONDITIONAL_CRITERIA.NOT_ENDS_WITH
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.equals_to'),
      value: CONDITIONAL_CRITERIA.EQUALS_TO
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.criteria.not_equals_to'),
      value: CONDITIONAL_CRITERIA.NOT_EQUALS_TO
      }];

    var abandonedCartDefaultFields = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.date'),
      value: ABANDONED_CART_INFORMATION_FIELDS.DATE,
      embed: "[[[date]]]",
      id: 1,
      isBasic: true,
      name: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.date'),
      type: 3,
      deleted: false
    }, {
        label: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.amount_of_products'),
        embed: "[[[amountofproducts]]]",
        id: 2,
        isBasic: true,
        name: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.amount_of_products'),
        type: 1,
        deleted: false
    }, {
        label: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.status'),
        value: ABANDONED_CART_INFORMATION_FIELDS.STATUS,
        embed: "[[[status]]]",
        id: 3,
        isBasic: true,
        name: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.status'),
        type: 0,
        deleted: false
    }, {
        label: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.total'),
        embed: "[[[total]]]",
        id: 4,
        isBasic: true,
        name: $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.fields.total'),
        type: 1,
        deleted: false
    }];

    var genderFieldOptions = [{
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.gender.female'),
      value: GENDER_TYPE.FEMALE
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.gender.male'),
      value: GENDER_TYPE.MALE
    }, {
      label: $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.gender.n_a'),
      value: GENDER_TYPE.N_A
    }];

    var timesBackAutomation = [{
      value: TIMES_BACK_AUTOMATION.ONE_TIME,
      label: $translate.instant('automation_editor.components.initial_condition.site_behavior.panel.times_value0')
    }, {
      value: TIMES_BACK_AUTOMATION.EVERY_3_MONTHS,
      label: $translate.instant('automation_editor.components.initial_condition.site_behavior.panel.times_value1')
    }, {
      value: TIMES_BACK_AUTOMATION.EVERY_6_MONTHS,
      label: $translate.instant('automation_editor.components.initial_condition.site_behavior.panel.times_value2')
    }];

    var visitedTimesOptions = [{
      value: 1,
      label: 1
    }, {
      value: 2,
      label: 2
    }, {
      value: 3,
      label: 3
    }, {
      value: 4,
      label: 4
    }, {
      value: 5,
      label: 5
    }, {
      value: 6,
      label: 6
    }, {
      value: 7,
      label: 7
    }, {
      value: 8,
      label: 8
    }, {
      value: 9,
      label: 9
    }, {
      value: 10,
      label: 10
    }];

    var exitOptions = [{
      label: $translate.instant('automation_editor.breadcrumb.exit_option5'),
      url: 'https://app.fromdoppler.com/dashboard'
    }, {
      label: $translate.instant('automation_editor.breadcrumb.exit_option3'),
      url: '/Automation/Automation/AutomationApp/'
    }, {
      label: $translate.instant('automation_editor.breadcrumb.exit_option1'),
      url: '/Campaigns/Draft'
    }, {
      label: $translate.instant('automation_editor.breadcrumb.exit_option2'),
      url: '/Lists/SubscribersList'
    }, {
      label: $translate.instant('automation_editor.breadcrumb.exit_option4'),
      url: '/ControlPanel/ControlPanel'
    }];

    var service = {
      getActionOptions: getActionOptions,
      getBooleanOptions: getBooleanOptions,
      getConditionalOptions: getConditionalOptions,
      getCampaignBehaviorEvents: getCampaignBehaviorEvents,
      getComparisonOperators: getComparisonOperators,
      getDayMoments: getDayMoments,
      getDayNumberOptions: getDayNumberOptions,
      getExitOptions: getExitOptions,
      getGenderFieldOptions: getGenderFieldOptions,
      getListMembershipEvents: getListMembershipEvents,
      getNegativeConditionalEvents: getNegativeConditionalEvents,
      getTextFieldCriteria: getTextFieldCriteria,
      getTimeOptions: getTimeOptions,
      getTimesBackAutomationOptions: getTimesBackAutomationOptions,
      getTimeUnitOptions: getTimeUnitOptions,
      getWeekDays: getWeekDays,
      getConsentOptions: getConsentOptions,
      getVisitedTimesOptions: getVisitedTimesOptions,
      getAbandonedCartTimeOptions: getAbandonedCartTimeOptions,
      getAbandonedCartWaitOptions: getAbandonedCartWaitOptions,
      getPendingPaymentTimeOptions: getPendingPaymentTimeOptions,
      getVisitedProductsTimeOptions: getVisitedProductsTimeOptions,
      getVisitedProductsWaitOptions: getVisitedProductsWaitOptions,
      getAbandonedCartInformationDefaultFields: getAbandonedCartInformationDefaultFields
    };

    function getActionOptions() {
      return actionOptions;
    }

    function getBooleanOptions() {
      return booleanOptions;
    }

    function getConsentOptions() {
      return consentOptions;
    }

    function getConditionalOptions() {
      return conditionalOptions;
    }

    function getCampaignBehaviorEvents() {
      return campaignBehaviorEvents;
    }

    function getComparisonOperators() {
      return comparisonOperators;
    }

    function getDayMoments() {
      return dayMoments;
    }

    function getGenderFieldOptions() {
      return genderFieldOptions;
    }

    function getNegativeConditionalEvents() {
      return negativeConditionalEvents;
    }

    function getTextFieldCriteria() {
      return textFieldCriteria;
    }

    function getAbandonedCartInformationDefaultFields() {
      return abandonedCartDefaultFields;
    }

    function getListMembershipEvents() {
      return listMembershipEvents;
    }

    function getPendingPaymentTimeOptions() {
      return pendingPaymentTimeOptions;
    }

    function getAbandonedCartTimeOptions() {
      return abandonedCartTimeOptions;
    }

    function getAbandonedCartWaitOptions() {
      return abandonedCartWaitOptions;
    }

    function getVisitedProductsTimeOptions() {
      return visitedProductsTimeOptions;
    }

    function getVisitedProductsWaitOptions() {
      return visitedProductsWaitOptions;
    }

    function getWeekDays() {
      var weekDays = [];
      var value;
      for (var i = 1; i <= 7; i++) {
        value = i === 7 ? 0 : i;
        weekDays.push({
          label: $translate.instant('automation_editor.sidebar.scheduled_date_day' + value),
          value: value
        });
      }

      return weekDays;
    }

    function getDayNumberOptions() {
      var dayNumberOptions = [];
      for (var i = 1; i <= 31; i++) {
        dayNumberOptions.push({
          label: i.toString(),
          value: i
        });
      }

      return dayNumberOptions;
    }

    function getTimeOptions() {
      var timeOptions = [];
      for (var i = 0; i <= 23; i++) {
        for (var j = 0; j <= 45; j = j + 15) {
          timeOptions.push({
            label: (i < 10 ? '0' + i.toString() : i.toString()) + ':' + ((j === 0 ? '0' + j.toString() : j.toString())) + ' h',
            value: {
              hour: i,
              minute: j
            }
          });
        }
      }

      return timeOptions;
    }

    function getTimeUnitOptions() {
      return timeUnitOptions;
    }

    function getTimesBackAutomationOptions() {
      return timesBackAutomation;
    }

    function getVisitedTimesOptions() {
      return visitedTimesOptions;
    }

    function getExitOptions() {
      return exitOptions;
    }

    return service;
  }
})();
