(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorNewStep', dpEditorNewStep);

  dpEditorNewStep.$inject = [
    'automation',
    'CHANGE_TYPE',
    'changesManager',
    'COMPONENT_TYPE',
    'AUTOMATION_TYPE',
    'WHATSAPP_WARNING_TYPE',
    'componentsDataservice',
    'CONDITION_BRANCH',
    'selectedElementsService',
    'goToService',
    'whatsappDataservice',
    '$translate',
  ];

  function dpEditorNewStep(automation, CHANGE_TYPE, changesManager, COMPONENT_TYPE, AUTOMATION_TYPE, WHATSAPP_WARNING_TYPE, componentsDataservice,
    CONDITION_BRANCH, selectedElementsService, goToService, whatsappDataservice, $translate) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '=',
        parentUid: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/canvas/dp-editor-new-step.html',
      link: link
    };

    return directive;

    function link(scope) {
      const conversationsLink = whatsappDataservice.getConversationsLink();
      const conversationsPlanLink = whatsappDataservice.getConversationsPlanLink();
      var automationType = automation.getModel().automationType;
      scope.stepOptions = componentsDataservice.getComponents();
      if (automationType === AUTOMATION_TYPE.PUSH_NOTIFICATION) {
        updateOptionsOnPushNotificationAutomationType();  
      }
      scope.showStepOptions = false;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      scope.addNewStep = function(option) {
        var newComponent;
        var newIndex = automation.getComponentIndex(scope.component, scope.parentUid
          || scope.component.parentUid, scope.branch) + 1;
        var rawData = {
          type: option.type,
          parentUid: scope.parentUid || scope.component.parentUid
        };

        if (option.type === COMPONENT_TYPE.CAMPAIGN) {
          rawData.campaignType = option.campaignType;
        }
        if (option.type === COMPONENT_TYPE.CONDITION && scope.hasNext()) {
          addConditionAndTransferChildren(rawData, newIndex);
          return;
        }

        newComponent = automation.addComponent(rawData, newIndex, scope.branch);
        newComponent.wasCreatedClickingNewStep = true;

        changesManager.add({
          type: CHANGE_TYPE.ADD_COMPONENT,
          component: newComponent,
          index: newIndex,
          branch: scope.branch
        });

        scope.showStepOptions = false;
        selectedElementsService.setSelectedComponent(newComponent);
      };

      scope.getToolTipContent = function (option) {
        var toolTipMsg = '';
        switch (option.type) {
          case COMPONENT_TYPE.SMS:
            toolTipMsg = $translate.instant('automation_editor.canvas.sms_new_step_not_credit');
            break;
          case COMPONENT_TYPE.WHATSAPP:
            toolTipMsg = option.hasWarning  === WHATSAPP_WARNING_TYPE.CREDIT ?
             $translate.instant('automation_editor.canvas.whatsapp_new_step_not_credit', { URL: conversationsPlanLink }):
             $translate.instant('automation_editor.canvas.whatsapp_new_step_not_room', { URL: conversationsLink });
            break;
          default:
        }
        return toolTipMsg;
      }

      function updateOptionsOnPushNotificationAutomationType() {
        var componentsAvailablesForPushNotification = [
          COMPONENT_TYPE.DELAY,
          COMPONENT_TYPE.PUSH_NOTIFICATION,
          COMPONENT_TYPE.GOTO_STEP,
          COMPONENT_TYPE.CONDITION
        ];
        for (var i = 0; i < scope.stepOptions.length; i++) {
          scope.stepOptions[i].isEnable =
            componentsAvailablesForPushNotification
              .indexOf(scope.stepOptions[i].type) > -1;
        }
      }

      function addConditionAndTransferChildren(rawData, index) {
        var childrenToTransfer = automation.getChildrenToTransfer(rawData, index, scope.branch);
        var newComponent = automation.addComponent(rawData, index, scope.branch);
        var parentUids = {
          new: newComponent.uid,
          old: newComponent.parentUid
        };
        var branch = {
          origin: scope.branch,
          destiny: CONDITION_BRANCH.POSITIVE
        };

        // remove all lines and, after to transfer all the condition children, regenerate them.
        goToService.removeAllGotoLinesButSavingComponentsRegistration();

        automation.transferChildren(parentUids, childrenToTransfer, 0, branch);

        changesManager.add({
          type: CHANGE_TYPE.ADD_CONDITION_AND_TRANSFER,
          branch: branch,
          children: childrenToTransfer,
          component: newComponent,
          index: index,
          parentUids: parentUids
        });

        scope.showStepOptions = false;
        selectedElementsService.setSelectedComponent(newComponent);

        // this is in charge to regenerate the lines previously removed.
        scope.$emit('ALTERING_CONDITION_FINISHED');
      }

      scope.showComponentList = function() {
        // set gotoStepOption enable when is end node
        var gotoStepOption = _.find(scope.stepOptions, function (stepOption) {
          return stepOption.type === COMPONENT_TYPE.GOTO_STEP;
        });
        gotoStepOption.isEnable = gotoStepOption.isEnable && !scope.hasNext();
        if (!automation.isReadOnly()) {
          scope.showStepOptions = !scope.showStepOptions;
          selectedElementsService.unsetSelectedComponent();
          scope.$emit('COMPONENTS_LIST:HIDE');
        }
      };

      scope.toggleComponentList = function() {
        if (!automation.getIsAutomationActive()) {
          scope.showStepOptions = !scope.showStepOptions;
          goToService.updateLinePosition();
        }
      };

      scope.isInitialCondition = function() {
        return automation.isInitialConditionComponent(scope.component);
      };

      scope.hasNext = function() {
        return automation.hasNextComponent(scope.component, scope.parentUid || scope.component.parentUid, scope.branch);
      };

      scope.isDynamicAutomation = function() {
        return scope.component.type === COMPONENT_TYPE.DYNAMIC_CONTENT;
      };

      scope.showWarning = function() {
        return !scope.hasNext() && (scope.component.type === COMPONENT_TYPE.CONDITION
          || scope.component.type === COMPONENT_TYPE.DELAY) && automation.getIsFlowComplete();
      };
    }
  }
})();
