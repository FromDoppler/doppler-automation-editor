(function () {
  'use strict';

  angular.module('dopplerApp.automation.editor').factory('PushComponent', [
    'BaseComponent',
    'COMPONENT_TYPE',
    function (BaseComponent, COMPONENT_TYPE) {
      function PushComponent(data) {
        BaseComponent.call(this, {
          type: COMPONENT_TYPE.PUSH_NOTIFICATION,
        });

        this.id = 0;
        this.name = '';
        this.pushMessageTitle = '';
        this.pushMessageBody = '';
        this.pushMessageOnClickLink = '';
        this.pushMessageImageUrl = '';

        if (data) {
          this.setData(data);
        }
      }

      PushComponent.prototype = Object.create(BaseComponent.prototype);
      PushComponent.prototype.markup =
        '<dp-editor-push class="component--container push" component="component" branch="branch"></dp-editor-push>';
      PushComponent.prototype.panelTemplate =
        '<div dp-editor-panel-push></div>';

      PushComponent.prototype.setData = function (data) {
        BaseComponent.prototype.setData.call(this, data);
        if (data.hasOwnProperty('id')) {
          this.id = data.id;
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
      };

      PushComponent.prototype.checkCompleted = function () {
        this.completed =
          this.pushMessageTitle !== '' &&
          this.pushMessageBody !== '' &&
          this.pushMessageTitle !== undefined &&
          this.pushMessageBody !== undefined &&
          this.pushMessageOnClickLink !== undefined &&
          this.pushMessageImageUrl !== undefined &&
          this.name !== '';
      };

      PushComponent.prototype.getPropertiesToWatch = function () {
        var properties = BaseComponent.prototype.getPropertiesToWatch();
        return properties.concat([
          'name',
          'pushMessageTitle',
          'pushMessageBody',
          'pushMessageOnClickLink',
          'pushMessageImageUrl',
        ]);
      };

      return PushComponent;
    },
  ]);
})();
