(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('AutomationComponent', [
      '$injector',
      'AUTOMATION_COMPLETED_STATE',
      'AUTOMATION_STATE',
      'COMPONENT_TYPE',
      'utils',
      function (
        $injector,
        AUTOMATION_COMPLETED_STATE,
        AUTOMATION_STATE,
        COMPONENT_TYPE,
        utils
      ) {
        function AutomationComponent(data) {
          var automation = $injector.get('automation');

          this.uid = utils.newUid();
          this.type = COMPONENT_TYPE.AUTOMATION;
          this.automationType = data.automationType;

          this.id = '';
          this.name = '';
          this.lastEmailIdName = 0;
          this.lastSmsIdName = 0;
          this.state = AUTOMATION_STATE.DRAFT;
          this.completed = AUTOMATION_COMPLETED_STATE.INCOMPLETE;

          this.initialCondition = automation.createCondition({
            type: automation.getConditionType(this.automationType),
            parentUid: this.uid,
            automationType: this.automationType,
            hasStartDateExpired: false,
          });

          this.isReplica = false;
          this.children = [];

          if (data) {
            this.setData(data);
          }
        }

        AutomationComponent.prototype.setData = function (data) {
          var automation = $injector.get('automation');
          if (data.hasOwnProperty('uid')) {
            this.uid = data.uid;
          }
          if (data.hasOwnProperty('automationType')) {
            this.automationType = data.automationType;
          }
          if (data.hasOwnProperty('id')) {
            this.id = data.id;
          }
          if (data.hasOwnProperty('name')) {
            this.name = data.name;
          }
          if (data.hasOwnProperty('state')) {
            this.state = data.state;
          }
          if (data.hasOwnProperty('automationType')) {
            this.automationType = data.automationType;
          }
          if (data.hasOwnProperty('lastEmailIdName')) {
            this.lastEmailIdName = data.lastEmailIdName;
          }
          if (data.hasOwnProperty('lastSmsIdName')) {
            this.lastSmsIdName = data.lastSmsIdName;
          }
          if (data.hasOwnProperty('initialCondition')) {
            if (!this.initialCondition) {
              this.initialCondition = automation.createCondition(
                data.initialCondition
              );
            } else {
              this.initialCondition.setData(data.initialCondition);
            }
          }
          if (data.hasOwnProperty('isReplica')) {
            this.isReplica = data.isReplica;
          }
        };

        AutomationComponent.prototype.addChildComponent = function (
          component,
          index
        ) {
          this.children.splice(index, 0, component);
        };

        AutomationComponent.prototype.removeChildComponent = function (
          component
        ) {
          this.children.splice(this.children.indexOf(component), 1);
        };

        AutomationComponent.prototype.getChildIndex = function (component) {
          return this.children.indexOf(component);
        };

        AutomationComponent.prototype.getChildByUid = function (uid) {
          return _.find(this.children, function (child) {
            return child.uid === uid;
          });
        };

        AutomationComponent.prototype.getEmailChildById = function (idEmail) {
          return _.find(this.children, function (child) {
            return (
              child.type === COMPONENT_TYPE.CAMPAIGN && child.id === idEmail
            );
          });
        };

        AutomationComponent.prototype.getEmailChildrenComponents = function () {
          return _.filter(this.children, function (child) {
            return child.type === COMPONENT_TYPE.CAMPAIGN;
          });
        };

        AutomationComponent.prototype.getEmailChildren = function (
          childUid,
          childIndex
        ) {
          var self = this;
          var emailComponents = [];

          _.each(
            _.filter(this.children, function (child) {
              var index = self.getChildIndex(child);
              return (
                child.type === COMPONENT_TYPE.CAMPAIGN && index < childIndex
              );
            }),
            function (emailComponent) {
              emailComponents.push({
                label: emailComponent.name,
                idEmail: emailComponent.id,
                uidEmail: emailComponent.uid,
              });
            }
          );
          return emailComponents.length > 1
            ? emailComponents.reverse()
            : emailComponents;
        };

        AutomationComponent.prototype.getChildrenToTransfer = function (index) {
          return this.children.slice(index, this.children.length);
        };

        AutomationComponent.prototype.hasNextComponent = function (component) {
          var nextIndex = this.children.indexOf(component) + 1;
          return !!this.children[nextIndex];
        };

        AutomationComponent.prototype.isFlowComplete = function () {
          var isFlowComplete = true;
          var hasWarnings = false;
          var hasStartDateExpired = false;
          var conditionFlowComplete;
          var hasAtLeastOneCampaign = false;
          var index = 0;

          hasStartDateExpired =
            this.initialCondition && this.initialCondition.hasStartDateExpired
              ? this.initialCondition.hasStartDateExpired
              : false;
          while (isFlowComplete && index < this.children.length) {
            if (isFlowComplete && !this.initialCondition.completed) {
              isFlowComplete = false;
            }
            if (isFlowComplete && !this.children[index].completed) {
              isFlowComplete = false;
            }
            if (
              isFlowComplete &&
              !hasAtLeastOneCampaign &&
              this.children[index].type === COMPONENT_TYPE.CAMPAIGN
            ) {
              hasAtLeastOneCampaign = true;
            }
            if (
              isFlowComplete &&
              this.children[index].type === COMPONENT_TYPE.CONDITION
            ) {
              conditionFlowComplete = this.children[index].isFlowComplete(
                hasAtLeastOneCampaign
              );
              isFlowComplete = conditionFlowComplete.isFlowComplete;
              hasWarnings = conditionFlowComplete.hasWarnings;
              if (!hasAtLeastOneCampaign) {
                hasAtLeastOneCampaign =
                  conditionFlowComplete.hasAtLeastOneCampaign;
              }
              if (isFlowComplete && !hasWarnings) {
                hasWarnings = this.children[index].hasWarnings();
              }
            }
            if (
              isFlowComplete &&
              !hasWarnings &&
              this.children[index].type === COMPONENT_TYPE.DELAY &&
              !this.children[index + 1]
            ) {
              hasWarnings = true;
            }
            index++;
          }

          if (isFlowComplete && this.children.length > 0) {
            if (hasWarnings) {
              this.completed =
                AUTOMATION_COMPLETED_STATE.COMPLETE_WITH_WARNINGS;
            } else if (hasStartDateExpired) {
              this.completed = AUTOMATION_COMPLETED_STATE.WITH_TRIAL_EXPIRED;
            } else {
              this.completed = AUTOMATION_COMPLETED_STATE.COMPLETED;
            }
          } else if (
            this.completed !== AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS &&
            this.completed !==
              AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED &&
            this.completed !== AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN &&
            this.completed !==
              AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN &&
            this.completed !==
              AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN &&
            this.completed !== AUTOMATION_COMPLETED_STATE.WITH_DEMO_EXPIRED &&
            this.completed !== AUTOMATION_COMPLETED_STATE.WITH_NON_INTEGRATION
          ) {
            this.completed = AUTOMATION_COMPLETED_STATE.INCOMPLETE;
          }

          if (
            this.state !== AUTOMATION_STATE.STOPPED &&
            this.state !== AUTOMATION_STATE.ACTIVE &&
            this.state !== AUTOMATION_STATE.PAUSED
          ) {
            this.state = AUTOMATION_STATE.DRAFT;
          }
        };

        return AutomationComponent;
      },
    ]);
})();
