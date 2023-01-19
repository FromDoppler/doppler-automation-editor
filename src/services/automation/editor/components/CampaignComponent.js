(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('CampaignComponent', ['BaseComponent', 'CAMPAIGN_TYPE', 'COMPONENT_TYPE', 'emailLinksDataservice', 'TEST_OPTION', function(BaseComponent, CAMPAIGN_TYPE, COMPONENT_TYPE, emailLinksDataservice, TEST_OPTION) {

      function CampaignComponent(data) {
        // Inherited constructor.
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.CAMPAIGN
        });

        this.id = 0;
        this.name = '';
        this.subject = '';
        this.preheader = '';
        this.fromName = '';
        this.fromEmail = '';
        this.replyEmail = '';
        this.socialShares = [];
        this.thumbnailUrl = '';
        this.contentType = '';
        this.editorType = null;
        this.innerHTML = '';
        this.DMARCAcceptedDomain = '';
        this.hasUnsavedChanges = true;
        this.viewOnlineLink = '';
        this.emailOption = TEST_OPTION.LIST;
        this.idList = 0;
        this.emailList = '';
        this.innerHTML = '';
        this.campaignType = data && data.campaignType ? data.campaignType : CAMPAIGN_TYPE.CAMPAIGN;
        this.DomainKeyLabel = '';
        this.dkimEmail = '';
        this.idDomainKeySelected = '';
        this.confirmedDomain = '';
        this.hasToIgnoreShippingLimit = true;

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseComponent.
      CampaignComponent.prototype = Object.create(BaseComponent.prototype);
      CampaignComponent.prototype.markup = '<dp-editor-campaign class="component--container campaign" component="component" branch="branch"></dp-editor-campaign>';
      CampaignComponent.prototype.panelTemplate = '<div dp-editor-panel-campaign></div>';

      CampaignComponent.prototype.setData = function(data) {
        BaseComponent.prototype.setData.call(this, data);
        emailLinksDataservice.addEmailComponentReference(this.uid);

        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
        if (data.hasOwnProperty('links') && data.links) {
          emailLinksDataservice.updateEmailComponentLinks(this.uid, data.links);
        }
        if (data.hasOwnProperty('name')) {
          this.name = data.name;
        }
        if (data.hasOwnProperty('subject')) {
          this.subject = data.subject;
        }
        if (data.hasOwnProperty('preheader')) {
          this.preheader = data.preheader;
        }
        if (data.hasOwnProperty('fromName')) {
          this.fromName = data.fromName;
        }
        if (data.hasOwnProperty('fromEmail')) {
          this.fromEmail = data.fromEmail;
        }
        if (data.hasOwnProperty('replyEmail')) {
          this.replyEmail = data.replyEmail;
        }
        if (data.hasOwnProperty('socialShares')) {
          this.socialShares = data.socialShares;
        }
        if (data.hasOwnProperty('thumbnailUrl')) {
          this.thumbnailUrl = data.thumbnailUrl;
        }
        if (data.hasOwnProperty('contentType')) {
          this.contentType = data.contentType;
        }
        if (data.hasOwnProperty('editorType')) {
          this.editorType = data.editorType;
        }
        if (data.hasOwnProperty('innerHTML')) {
          this.innerHTML = data.innerHTML;
        }
        if (data.hasOwnProperty('DMARCAcceptedDomain')) {
          this.DMARCAcceptedDomain = data.DMARCAcceptedDomain;
        }
        if (data.hasOwnProperty('hasUnsavedChanges')) {
          this.hasUnsavedChanges = false;
        }
        if (data.hasOwnProperty('viewOnlineLink')) {
          this.viewOnlineLink = data.viewOnlineLink;
        }
        if (data.hasOwnProperty('emailOption')) {
          this.emailOption = data.emailOption;
        }
        if (data.hasOwnProperty('idList')) {
          this.idList = data.idList;
        }
        if (data.hasOwnProperty('emailList')) {
          this.emailList = data.emailList;
        }
        if (data.hasOwnProperty('dkimEmail')) {
          this.dkimEmail = data.dkimEmail;
        }
        if (data.hasOwnProperty('DomainKeyLabel')) {
          this.DomainKeyLabel = data.DomainKeyLabel;
        }
        if (data.hasOwnProperty('idDomainKeySelected')) {
          this.idDomainKeySelected = data.idDomainKeySelected;
        }
        if (data.hasOwnProperty('confirmedDomain')) {
          this.confirmedDomain = data.confirmedDomain;
        }
        if (data.hasOwnProperty('hasToIgnoreShippingLimit')) {
          this.hasToIgnoreShippingLimit = data.hasToIgnoreShippingLimit;
        }
      };

      CampaignComponent.prototype.getPropertiesToWatch = function() {
        return [
          'subject',
          'fromName',
          'fromEmail',
          'replyEmail',
          'socialShares',
          'thumbnailUrl',
          'preheader',
          'emailOption',
          'idList',
          'emailList',
          'hasToIgnoreShippingLimit'
        ];
      };

      CampaignComponent.prototype.getCompletedPropertiesToWatch = function() {
        return [
          'name',
          'subject',
          'fromName',
          'fromEmail',
          'thumbnailUrl'
        ];
      };

      CampaignComponent.prototype.checkCompleted = function() {
        BaseComponent.prototype.checkCompleted.call(this);
        this.completed = this.completed && ((!!this.dkimEmail && this.fromEmail.indexOf(this.dkimEmail + '@' + this.DomainKeyLabel) !== -1) || (!!this.confirmedDomain &&
         this.confirmedDomain.length > 0 && this.fromEmail.indexOf(this.confirmedDomain) !== -1));
        return this.completed;
      };


      return CampaignComponent;
    }]);
})();
