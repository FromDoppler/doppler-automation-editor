(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('CampaignBehavior', [
    'BaseConditional',
    'CONDITIONAL_EVENT',
    'DUPLICATE_STATE',
    'emailLinksDataservice',
    function (
      BaseConditional,
      CONDITIONAL_EVENT,
      DUPLICATE_STATE,
      emailLinksDataservice
    ) {
      function CampaignBehavior(data) {
        // Inherited constructor.
        BaseConditional.call(this, data);

        this.event = '';
        this.email = {
          label: '',
          idEmail: 0,
          uidEmail: 0,
        };
        this.link = {
          idLink: 0,
          url: '',
        };

        if (data) {
          this.setData(data);
        }
      }

      // Prototype inherence from BaseConditional.
      CampaignBehavior.prototype = Object.create(BaseConditional.prototype);

      CampaignBehavior.prototype.setData = function (data) {
        BaseConditional.prototype.setData.call(this, data);
        if (data.hasOwnProperty('email')) {
          this.email = data.email;
        }
        if (data.hasOwnProperty('event')) {
          this.event = data.event;
        }
        if (data.hasOwnProperty('link')) {
          this.link = data.link;
          this.validateLink();
        }
      };

      CampaignBehavior.prototype.checkCompleted = function () {
        var linksByEmail = emailLinksDataservice.getLinksByEmail();
        var isCompleted = !!(
          this.event.length &&
          this.email.idEmail !== 0 &&
          (this.duplicate === DUPLICATE_STATE.FALSE ||
            this.duplicate === DUPLICATE_STATE.ORIGIN)
        );

        if (
          (this.event === CONDITIONAL_EVENT.LINK_CLICKED ||
            this.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED) &&
          this.link.idLink <= 0
        ) {
          isCompleted = false;
        }
        if (
          (this.event === CONDITIONAL_EVENT.ANY_LINK_CLICKED ||
            this.event === CONDITIONAL_EVENT.NO_LINK_CLICKED) &&
          (!linksByEmail[this.email.uidEmail] ||
            !linksByEmail[this.email.uidEmail].length)
        ) {
          isCompleted = false;
        }
        this.completed = isCompleted;
      };

      CampaignBehavior.prototype.validateLink = function () {
        if (
          this.link.idLink !== 0 &&
          !emailLinksDataservice.findLink(this.email.uidEmail, this.link.idLink)
        ) {
          this.link.idLink = -1;
        }
      };

      CampaignBehavior.prototype.isEqual = function (conditional) {
        var isEqual =
          this.event === conditional.event &&
          this.email.uidEmail === conditional.email.uidEmail;

        if (
          isEqual &&
          (this.event === CONDITIONAL_EVENT.LINK_CLICKED ||
            this.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED) &&
          this.link.idLink !== conditional.link.idLink
        ) {
          isEqual = false;
        }

        return isEqual;
      };

      CampaignBehavior.prototype.getPropertiesToWatch = function () {
        return ['event', 'email', 'link'];
      };

      return CampaignBehavior;
    },
  ]);
})();
