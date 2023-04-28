(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('CampaignRssComponent', [
      'CampaignComponent',
      'CAMPAIGN_TYPE',
      function (CampaignComponent, CAMPAIGN_TYPE) {
        function CampaignRssComponent(data) {
          // Inherited constructor.
          CampaignComponent.call(this, {
            campaignType: CAMPAIGN_TYPE.CAMPAIGN_RSS,
          });

          this.rss = '';

          if (data) {
            this.setData(data);
          }
        }

        // Prototype inherence from CampaignRssComponent.
        CampaignRssComponent.prototype = Object.create(
          CampaignComponent.prototype
        );
        CampaignRssComponent.prototype.setData = function (data) {
          CampaignComponent.prototype.setData.call(this, data);
          if (data.hasOwnProperty('rss')) {
            this.rss = data.rss;
          }
        };

        CampaignRssComponent.prototype.getCompletedPropertiesToWatch =
          function () {
            var properties =
              CampaignComponent.prototype.getCompletedPropertiesToWatch();
            return properties.concat(['rss']);
          };

        return CampaignRssComponent;
      },
    ]);
})();
