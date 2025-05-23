(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('componentsDataservice', componentsDataservice);

  componentsDataservice.$inject = [
    'COMPONENT_TYPE',
    'automation',
    'AUTOMATION_TYPE',
    'WHATSAPP_WARNING_TYPE',
    'CAMPAIGN_TYPE',
    'settingsService'
  ];

  function componentsDataservice(COMPONENT_TYPE, automation, AUTOMATION_TYPE, WHATSAPP_WARNING_TYPE, CAMPAIGN_TYPE, settingsService) {

    var settings = settingsService.getLoadedData();

    var service = {
      getComponents: getComponents
    };

    return service;

    function getComponents() {
      var automationType = automation.getModel().automationType;
      return [{
        label: 'campaign_icon',
        svg_path: '/../images/automation-campaign.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-campaign-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.CAMPAIGN,
        isEnable: true,
        campaignType: automationType === AUTOMATION_TYPE.RSS_TO_EMAIL ?
          CAMPAIGN_TYPE.CAMPAIGN_RSS : automationType
      }, {
        label: 'sms_icon',
        svg_path: '/../images/automation-sms.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-sms-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.SMS,
        isEnable: settings.isSmsEnable,
        hasWarning: !settings.hasSmsCredits //does not have a sms credit is a warnig to show
      }, {
        label: 'whatsapp_icon',
        svg_path: '/../images/automation-whatsapp.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-whatsapp-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.WHATSAPP,
        isEnable: settings.isWhatsappEnable,
        hasWarning: !settings.hasWhatsappCredits? WHATSAPP_WARNING_TYPE.CREDIT : !settings.hasWhatsappRooms? WHATSAPP_WARNING_TYPE.ROOM : false,
      }, {
        label: 'push_icon',
        svg_path: '/../images/automation-push_notification.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-push_notification-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.PUSH_NOTIFICATION,
        isEnable: settings.isPushEnable && automationType === AUTOMATION_TYPE.PUSH_NOTIFICATION
      }, {
        label: 'condition_icon',
        svg_path: '/../images/automation-condition.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-condition-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.CONDITION,
        isEnable: true
      }, {
        label: 'action_icon',
        svg_path: '/../images/automation-action.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-action-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.ACTION,
        isEnable: true
      }, {
        label: 'delay_icon',
        svg_path: '/../images/automation-delay.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-delay-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.DELAY,
        isEnable: true
      }, {
        label: 'goto_icon',
        svg_path: '/../images/automation-goto.svg', // eslint-disable-line
        svg_hover_path: '/../images/automation-goto-hover.svg', // eslint-disable-line
        type: COMPONENT_TYPE.GOTO_STEP,
        isEnable: true
      }];
    }
  }
})();
