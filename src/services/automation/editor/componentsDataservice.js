(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('componentsDataservice', componentsDataservice);

  componentsDataservice.$inject = [
    'COMPONENT_TYPE',
    'automation',
    'AUTOMATION_TYPE',
    'CAMPAIGN_TYPE',
    'settingsService',
  ];

  function componentsDataservice(
    COMPONENT_TYPE,
    automation,
    AUTOMATION_TYPE,
    CAMPAIGN_TYPE,
    settingsService
  ) {
    var settings = settingsService.getLoadedData();

    var service = {
      getComponents: getComponents,
    };

    return service;

    function getComponents() {
      var automationType = automation.getModel().automationType;
      return [
        {
          label: 'delay_icon',
          svg_path: '/../images/automation-delay.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-delay-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.DELAY,
          isEnable: true,
        },
        {
          label: 'campaign_icon',
          svg_path: '/../images/automation-campaign.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-campaign-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.CAMPAIGN,
          isEnable: true,
          campaignType:
            automationType === AUTOMATION_TYPE.RSS_TO_EMAIL
              ? CAMPAIGN_TYPE.CAMPAIGN_RSS
              : automationType,
        },
        {
          label: 'condition_icon',
          svg_path: '/../images/automation-condition.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-condition-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.CONDITION,
          isEnable: true,
        },
        {
          label: 'action_icon',
          svg_path: '/../images/automation-action.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-action-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.ACTION,
          isEnable: true,
        },
        {
          label: 'sms_icon',
          svg_path: '/../images/automation-sms.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-sms-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.SMS,
          isEnable: settings.isSmsEnable,
          hasWarning: !settings.hasSmsCredits, //does not hava a sms credit is a warnig to show
        },
        {
          label: 'push_icon',
          svg_path: '/../images/automation-push_notification.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-push_notification-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.PUSH_NOTIFICATION,
          isEnable:
            settings.isPushEnable &&
            automationType === AUTOMATION_TYPE.PUSH_NOTIFICATION,
        },
        {
          label: 'goto_icon',
          svg_path: '/../images/automation-goto.svg', // eslint-disable-line
          svg_hover_path: '/../images/automation-goto-hover.svg', // eslint-disable-line
          type: COMPONENT_TYPE.GOTO_STEP,
          isEnable: true,
        },
      ];
    }
  }
})();
