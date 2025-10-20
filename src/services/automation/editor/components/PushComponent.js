(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('PushComponent', ['BaseComponent', 'COMPONENT_TYPE', 'REGEX', function(BaseComponent, COMPONENT_TYPE, REGEX) {

      function PushComponent(data) {
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.PUSH_NOTIFICATION
        });

        this.id = 0;
        this.domains = [];
        this.name = '';
        this.pushMessageTitle = '';
        this.pushMessageBody = '';
        this.pushMessageOnClickLink = '';
        this.pushMessageImageUrl = '';
        this.pushPreferLargeImage =  false;
        this.pushActions = [
          {
            name: 'primary',
            label: '',
            icon: '',
            url: '',
          }
        ];

        if (data) {
          this.setData(data);
        }
      }

      function isFilled(value) {
        return value !== undefined && value !== null && !(typeof value === 'string' && value.trim() === '');
      }

      PushComponent.prototype = Object.create(BaseComponent.prototype);
      PushComponent.prototype.markup = '<dp-editor-push class="component--container push" component="component" branch="branch"></dp-editor-push>';
      PushComponent.prototype.panelTemplate = '<div dp-editor-panel-push></div>';

      PushComponent.prototype.setData = function(data) {
        BaseComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
        }
        if (data.hasOwnProperty('domains')) {
          this.domains = data.domains || [];
        }
        if (data.hasOwnProperty('name')) {
          this.name = data.name;
        }
        if (data.hasOwnProperty('pushMessageTitle')) {
          this.pushMessageTitle = data.pushMessageTitle;
        }
        if (data.hasOwnProperty('pushMessageBody')) {
          this.pushMessageBody = data.pushMessageBody;
        }
        if (data.hasOwnProperty('pushMessageOnClickLink')) {
          this.pushMessageOnClickLink = data.pushMessageOnClickLink;
        }
        if (data.hasOwnProperty('pushMessageImageUrl')) {
          this.pushMessageImageUrl = data.pushMessageImageUrl;
        }
        if (data.hasOwnProperty('pushPreferLargeImage')) {
          this.pushPreferLargeImage = data.pushPreferLargeImage;
        }
        if (data.hasOwnProperty('pushActions')) {
          this.pushActions = data.pushActions;
        }
      };

      PushComponent.prototype.checkCompleted = function() {
        const hasValidPushActions =
          Array.isArray(this.pushActions) &&
          (
            this.pushActions.length === 0 ||
            this.pushActions.every(action =>
              isFilled(action.label) && REGEX.STRICT_START_HTTPS.test(action.url)
            )
          );

        const fields = [
          this.pushMessageTitle,
          this.pushMessageBody,
          this.name
        ];

        const optionalUrlFields = [
          this.pushMessageOnClickLink,
          this.pushMessageImageUrl
        ];

        const areOptionalUrlsValid = optionalUrlFields.every(value =>
          value === '' ||  REGEX.DOMAIN_HTTP.test(value)
        );      

        this.completed =
          fields.every(isFilled) &&
          Array.isArray(this.domains) &&
          areOptionalUrlsValid &&
          this.domains.length > 0 &&
          hasValidPushActions;
      };

      PushComponent.prototype.getPropertiesToWatch = function() {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat([
          'name',
          'pushMessageTitle',
          'pushMessageBody',
          'pushMessageOnClickLink',
          'pushMessageImageUrl',
          'pushPreferLargeImage',
          'pushActions'
        ]);
      };

      return PushComponent;
    }]);
})();
