(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .factory('automation', automation);

  automation.$inject = [
    '$q',
    '$rootScope',
    '$timeout',
    '$translate',
    '$window',
    'AUTOMATION_COMPLETED_STATE',
    'AUTOMATION_STATE',
    'AUTOMATION_TYPE',
    'automationDataservice',
    'componentInterpreter',
    'conditionsDataservice',
    'COMPONENT_TYPE',
    'CONDITION_TYPE',
    'emailLinksDataservice',
    'FIELD_TYPE',
    'FREQUENCY_TYPE',
    'selectedElementsService',
    'userFieldsDataservice',
    'warningsStepsService',
    'settingsService',
    'DOMAIN_STATUS',
    'ModalService',
    'goToService',
  ];

  function automation($q, $rootScope, $timeout, $translate, $window, AUTOMATION_COMPLETED_STATE, AUTOMATION_STATE,
    AUTOMATION_TYPE, automationDataservice, componentInterpreter, conditionsDataservice, COMPONENT_TYPE, CONDITION_TYPE,
    emailLinksDataservice, FIELD_TYPE, FREQUENCY_TYPE, selectedElementsService, userFieldsDataservice,
    warningsStepsService, settingsService, DOMAIN_STATUS, ModalService, goToService) {
    var promise;
    var model;
    var automationNamePromise;
    var countriesPromise;
    var scoresPromise;
    var originsPromise;
    var isPanelCollapsed = false;
    var isModelLoaded = false;
    var isProcessing = false;
    var initialConditionTypes = [
      CONDITION_TYPE.SUBSCRIPTION_LIST,
      CONDITION_TYPE.SCHEDULED_DATE,
      CONDITION_TYPE.RSS_TO_EMAIL,
      CONDITION_TYPE.CAMPAIGN_BEHAVIOR,
      CONDITION_TYPE.SITE_BEHAVIOR,
      CONDITION_TYPE.PUSH
    ];
    var parentComponents = {};
    var selectedTaskThirdPartySelected;
    var thirdPartyAppsConnected;
    var siteTracking = false;

    var service = {
      addComponent: addComponent,
      addComponentAsParent: addComponentAsParent,
      buildAutomation: buildAutomation,
      centerCanvas: centerCanvas,
      checkCompleted: checkCompleted,
      createCondition: createCondition,
      createConditional: createConditional,
      createFrequency: createFrequency,
      createOperation: createOperation,
      createSubscriberField: createSubscriberField,
      deleteComponent: deleteComponent,
      getAllParentComponents: getAllParentComponents,
      getAutomationName: getAutomationName,
      getChildrenToTransfer: getChildrenToTransfer,
      getComponentByUid: getComponentByUid,
      getComponentIndex: getComponentIndex,
      getCountries: getCountries,
      getScores: getScores,
      getOrigins: getOrigins,
      getEmailComponentById: getEmailComponentById,
      getEmailComponentsToBind: getEmailComponentsToBind,
      getHtmlContent: getHtmlContent,
      getHtmlContentForPreview: getHtmlContentForPreview,
      getIsAutomationActive: getIsAutomationActive,
      getIsFlowComplete: getIsFlowComplete,
      getIsPanelCollapsed: getIsPanelCollapsed,
      getIsProcessing: getIsProcessing,
      getListsForTest: getListsForTest,
      getListsItems: getListsItems,
      getModel: getModel,
      getParentComponent: getParentComponent,
      getReadOnlyLabel: getReadOnlyLabel,
      getSiteBehaviorStatus: getSiteBehaviorStatus,
      hasNextComponent: hasNextComponent,
      hasDynamicElement: hasDynamicElement,
      hasSmsComponent: hasSmsComponent,
      isInitialConditionComponent: isInitialConditionComponent,
      load: load,
      onEmailNameChange: onEmailNameChange,
      pauseAutomationCampaign: pauseAutomationCampaign,
      resizeCanvas: resizeCanvas,
      saveCampaign: saveCampaign,
      saveChanges: saveChanges,
      saveTemplateContent: saveTemplateContent,
      sendTestToEmails: sendTestToEmails,
      sendTestToList: sendTestToList,
      saveTinyEditorContent: saveTinyEditorContent,
      setAutomationAsActive: setAutomationAsActive,
      setIsProcessing: setIsProcessing,
      startAutomationCampaign: startAutomationCampaign,
      stopAutomationCampaign: stopAutomationCampaign,
      setData: setData,
      toggleCollapsePanel: toggleCollapsePanel,
      transferChildren: transferChildren,
      updateAutomationFlowState: updateAutomationFlowState,
      updateEmailsId: updateEmailsId,
      validateAndAutoCompleteRSS: validateAndAutoCompleteRSS,
      isReadOnly: isReadOnly,
      isPaused: isPaused,
      confirmDomain: confirmDomain,
      checkActionsCompleted: checkActionsCompleted,
      getConditionType: getConditionType,
      getProductStoresList: getProductStoresList,
      domainHaveErrors: domainHaveErrors,
      applyDropDownChange: applyDropDownChange,
      hasBlockedList: hasBlockedList,
      getInitialConditionUid: getInitialConditionUid
    };

    return service;

    function load(idTaskType, idScheduledTask) {
      // hack to hide main scroll just for automation
      // TODO fix it #goto issues
      // Added rule isSelectingAutomationType at automation type selection for visual issue
      const isSelectingAutomationType = idTaskType === 0;
      if(!isSelectingAutomationType) {
        document.querySelector('html').style.overflow = 'hidden';
      }
      var defer = $q.defer();

      if (!promise) {
        if (idScheduledTask) {
          promise = automationDataservice.getAutomation(idScheduledTask);
        } else {
          var data = {
            data: {
              type: COMPONENT_TYPE.AUTOMATION,
              automationType: getAutomationType(parseInt(idTaskType)),
              id: 0
            }
          };
          //test fix
          promise = $q.when(data);
        }

        promise.then(function(response) {
          selectedTaskThirdPartySelected = response.data.initialCondition ?
            response.data.initialCondition.idThirdPartyApp : null;
          setData(response.data);
          isModelLoaded = true;
          checkCompleted();
          defer.resolve(response);
        });
        promise = defer.promise;
      }

      return promise;
    }

    function getAutomationType(idTaskType) {
      var automationType;

      switch (idTaskType) {
      case 1:
        automationType = AUTOMATION_TYPE.SUBSCRIPTION_LIST;
        break;
      case 3:
        automationType = AUTOMATION_TYPE.SCHEDULED_DATE;
        break;
      case 4:
        automationType = AUTOMATION_TYPE.RSS_TO_EMAIL;
        break;
      case 5:
        automationType = AUTOMATION_TYPE.CAMPAIGN_BEHAVIOR;
        break;
      case 6:
        automationType = AUTOMATION_TYPE.SITE_BEHAVIOR;
        break;
      case 7:
        automationType = AUTOMATION_TYPE.ABANDONED_CART;
        break;
      case 8:
        automationType = AUTOMATION_TYPE.VISITED_PRODUCTS;
        break;
      case 9:
        automationType = AUTOMATION_TYPE.PENDING_ORDER;
        break;
      case 10:
        automationType = AUTOMATION_TYPE.CONFIRMATION_ORDER;
          break;
      case 11:
        automationType = AUTOMATION_TYPE.PUSH_NOTIFICATION;
        break;
      case 12:
        automationType = AUTOMATION_TYPE.SMS;
        break;
      default:
        automationType = AUTOMATION_TYPE.NONE;
        break;
      }

      return automationType;
    }

    function getAutomationName() {
      if (!automationNamePromise) {
        automationNamePromise = $q.defer();
        automationDataservice.getAutomationDefaultName().then(function(response) {
          automationNamePromise.resolve(response);
        });
      }

      return automationNamePromise.promise;
    }

    function getModel() {
      return model;
    }

    function isReadOnly() {
      return model.state === AUTOMATION_STATE.ACTIVE || model.state === AUTOMATION_STATE.PAUSED;
    }

    function isPaused() {
      return model.state === AUTOMATION_STATE.PAUSED;
    }

    function getReadOnlyLabel() {
      return isPaused() ? $translate.instant('validation_messages.paused_input') : $translate.instant('validation_messages.read_only_input');
    }

    function buildAutomation(idTaskType) {
      var automationType = getAutomationType(parseInt(idTaskType));
      model.setData({
        automationType: automationType,
        initialCondition: {
          type: getConditionType(automationType),
          parentUid: model.uid,
          automationType: automationType
        }
      });
      checkCompleted();
    }

    function getConditionType(automationType) {
      var condition;
      switch (automationType) {
      case AUTOMATION_TYPE.SUBSCRIPTION_LIST:
        condition = CONDITION_TYPE.SUBSCRIPTION_LIST;
        break;
      case AUTOMATION_TYPE.SCHEDULED_DATE:
        condition = CONDITION_TYPE.SCHEDULED_DATE;
        break;
      case AUTOMATION_TYPE.RSS_TO_EMAIL:
        condition = CONDITION_TYPE.RSS_TO_EMAIL;
        break;
      case AUTOMATION_TYPE.SMS:
      case AUTOMATION_TYPE.CAMPAIGN_BEHAVIOR:
        condition = CONDITION_TYPE.CAMPAIGN_BEHAVIOR;
        break;
      case AUTOMATION_TYPE.SITE_BEHAVIOR:
        condition = CONDITION_TYPE.SITE_BEHAVIOR;
        break;
      case AUTOMATION_TYPE.ABANDONED_CART:
        condition = CONDITION_TYPE.DYNAMIC_CONTENT;
        break;
      case AUTOMATION_TYPE.VISITED_PRODUCTS:
        condition = CONDITION_TYPE.DYNAMIC_CONTENT;
        break;
      case AUTOMATION_TYPE.PENDING_ORDER:
        condition = CONDITION_TYPE.DYNAMIC_CONTENT;
        break;
      case AUTOMATION_TYPE.CONFIRMATION_ORDER:
        condition = CONDITION_TYPE.DYNAMIC_CONTENT;
          break;
      case AUTOMATION_TYPE.PUSH_NOTIFICATION:
        condition = CONDITION_TYPE.PUSH;
        break;
      case AUTOMATION_TYPE.NONE:
        condition = CONDITION_TYPE.NONE;
        break;
      default:
        throw new Error('Invalid automationType');
      }
      return condition;
    }

    function setData(data) {
      model = componentInterpreter.createComponent(data);
      addComponentAsParent(model);
      angular.forEach(data.children, function(child, index) {
        addComponent(child, index);
      });
    }

    function saveChanges() {
      var savePromise;
      //if the automation state is active we should not save anything
      if (model.state === AUTOMATION_STATE.ACTIVE) {
        return;
      }
      //we need truncate the automation name if it has more than 60 chars
      if (model.name.length > 60) {
        model.name = model.name.substr(0, 60);
      }
      savePromise = automationDataservice.saveChanges(model);
      savePromise.then(function(response) {
        if (response.data !== undefined) {
          model.setData({ id: response.data.id });
          if (response.data.delays) {
            updateDelaysId(response.data.delays);
          }
          if (response.data.campaigns) {
            updateEmailsId(response.data.campaigns);
          }
          $rootScope.$broadcast('AUTOMATION_SAVED');
        }
      });

      return savePromise;
    }

    function updateEmailsId(emailsToUpdate) {
      _.each(emailsToUpdate, function(emailData) {
        var emailComponent = getComponentByUid(emailData.uid);
        conditionsDataservice.updateConditionalData(emailComponent.uid, emailData);
        updateActionData(emailComponent.uid, emailData);
        if (emailData.hasOwnProperty('links')) {
          emailLinksDataservice.updateLinksId(emailComponent.uid, emailData.links);
          delete emailData.links;
        }
        emailComponent.setData(emailData);
      });
    }

    function updateDelaysId(delaysToUpdate) {
      _.each(delaysToUpdate, function(delayData) {
        var delayComponent = getComponentByUid(delayData.uid);
        delayComponent.setData(delayData);
      });
    }

    function saveCampaign(campaign, htmlContent) {
      var defer = $q.defer();
      automationDataservice.saveCampaign(model.id, campaign, htmlContent).then(function(response) {
        getEmailLinks(campaign.id, defer, {
          previewUrl: response.data.previewUrl,
          links: []
        });
      });

      return defer.promise;
    }

    function saveTinyEditorContent(idCampaign, html) {
      var defer = $q.defer();
      automationDataservice.saveTinyEditorContent(idCampaign, html).then(function(response) {
        getEmailLinks(idCampaign, defer, {
          thumbnailUrl: response.data.thumbnailUrl,
          links: []
        });
      });

      return defer.promise;
    }

    function saveTemplateContent(idCampaign, idTemplate) {
      var defer = $q.defer();
      automationDataservice.saveTemplateContent(idCampaign, idTemplate).then(function() {
        getEmailLinks(idCampaign, defer, { links: [] });
      });

      return defer.promise;
    }

    function getEmailLinks(idCampaign, defer, data) {
      automationDataservice.getEmailLinks(idCampaign).then(function(response) {
        var emailComponentUid = getEmailComponentById(idCampaign).uid;
        data.links = response.data;
        emailLinksDataservice.updateEmailComponentLinks(emailComponentUid, data.links);
        conditionsDataservice.validateConditionalsLinks(emailComponentUid);
        checkConditionsCompletedState();
        defer.resolve(data);
      }, function() {
        defer.resolve(data);
      });
    }

    function checkConditionsCompletedState() {
      var conditionComponents = _.filter(parentComponents, function(parentComponent) {
        return parentComponent.type === COMPONENT_TYPE.CONDITION;
      });
      if (!conditionComponents.length) {
        return;
      }
      _.each(conditionComponents, function(condition) {
        condition.checkCompleted();
        warningsStepsService.checkWarningStep(condition);
      });
      checkCompleted();
    }

    function checkActionsCompleted() {
      var actionsComponents = _.filter(model.children, function(component) {
        return component.type === COMPONENT_TYPE.ACTION;
      });

      _.each(actionsComponents, function(action) {
        action.checkCompleted();
      });
    }

    function hasSmsComponent(components, found) {
      components = components || model.children;
      found = found || false;
      _.each(components, function (component) {
        if (component.type == COMPONENT_TYPE.CONDITION) {
          found = found || hasSmsComponent(component.positiveSiblings, found);
          found = found || hasSmsComponent(component.negativeSiblings, found);
        }
        found = found || component.type === COMPONENT_TYPE.SMS;
      });
      return found;
    }

    function updateActionData(uidEmail, emailData) {
      var actionsComponents = _.filter(model.children, function(component) {
        return component.type === COMPONENT_TYPE.ACTION
          && component.operation
          && component.operation.email
          && component.operation.email.uidEmail === uidEmail
          && component.operation.email.uidEmail !== 0;
      });
      _.each(actionsComponents, function(action) {
        if (emailData.hasOwnProperty('id')) {
          action.operation.email.idEmail = emailData.id;
        }
        if (emailData.hasOwnProperty('name')) {
          action.operation.email.label = emailData.name;
        }
      });
    }

    function addComponent(componentData, index, branch) {
      var newComponent = componentInterpreter.createComponent(componentData);
      var parentComponent = getParentComponent(componentData.parentUid);
      parentComponent.addChildComponent(newComponent, index, branch);
      newComponent.checkCompleted();
      warningsStepsService.checkWarningStep(newComponent);
      if (isModelLoaded) {
        checkCompleted();
      }
      goToService.updateLinePosition();
      return newComponent;
    }

    function deleteComponent(component, branch) {
      goToService.removeGotoLineByTarget(component.uid);
      var parentComponent = getParentComponent(component.parentUid);
      var childComponent = parentComponent.getChildByUid(component.uid);
      parentComponent.removeChildComponent(childComponent, branch);
      //we need to do it to resize the canvas after ConditionComponent deletion
      if (childComponent.type === COMPONENT_TYPE.CONDITION) {
        delete parentComponents[childComponent.uid];
        $timeout(function() {
          resizeCanvas();
        });
      }
      warningsStepsService.removeWarningStep(childComponent);
      checkCompleted();
      selectedElementsService.unsetSelectedComponent();
    }

    function getComponentIndex(component, parentUid, branch) {
      var parentComponent = getParentComponent(parentUid);
      return parentComponent.getChildIndex(component, branch);
    }

    function getComponentByUid(uid) {
      var found;

      if (model.initialCondition.uid === uid) {
        return model.initialCondition;
      }

      _.each(parentComponents, function(parent) {
        found = parent.getChildByUid(uid);

        if (found) {
          return false;
        }
      });

      return found;
    }

    function getEmailComponentById(idEmail) {
      var found;

      _.each(parentComponents, function(parent) {
        found = parent.getEmailChildById(idEmail);

        if (found) {
          return false;
        }
      });

      return found;
    }

    function getEmailComponentsToBind(component) {
      var branch;
      var index;
      var parentComponent;
      var emailComponents = [];

      do {
        parentComponent = getParentComponent(component.parentUid);
        if (parentComponent.type === COMPONENT_TYPE.CONDITION) {
          branch = conditionsDataservice.getChildBranch(parentComponent.uid, component.uid);
        }
        index = parentComponent.getChildIndex(component, branch);
        emailComponents = emailComponents.concat(parentComponent.getEmailChildren(component.uid, index));
        component = parentComponent;
      } while (component.uid !== model.uid);

      return emailComponents;
    }

    function hasNextComponent(component, parentUid, branch) {
      var parentComponent = getParentComponent(parentUid);
      return parentComponent.hasNextComponent(component, branch);
    }

    function hasDynamicElement(idCampaign) {
      var defer = $q.defer();
      automationDataservice.hasDynamicContent(model.id, idCampaign).then(function(result) {
        defer.resolve((JSON.parse(result.data)));
      });
      return defer.promise;
    }

    function getChildrenToTransfer(componentData, index, branch) {
      var parentComponent = getParentComponent(componentData.parentUid);
      return parentComponent.getChildrenToTransfer(index, branch);
    }

    function transferChildren(parentUids, children, index, branch) {
      var newParentComponent = getParentComponent(parentUids.new);
      var oldParentComponent = getParentComponent(parentUids.old);

      _.each(children, function(child) {
        oldParentComponent.removeChildComponent(child, branch.origin);
        child.parentUid = parentUids.new;
        newParentComponent.addChildComponent(child, index, branch.destiny);
        index++;
      });
    }

    function addComponentAsParent(component) {
      parentComponents[component.uid] = component;
    }

    function getParentComponent(uid) {
      return parentComponents[uid];
    }

    function getAllParentComponents() {
      return parentComponents;
    }

    function getIsProcessing() {
      return isProcessing;
    }

    function setIsProcessing(value) {
      isProcessing = value;
    }

    function createCondition(conditionData) {
      return componentInterpreter.createCondition(conditionData);
    }

    function createConditional(conditionalData) {
      return componentInterpreter.createConditional(conditionalData);
    }

    function createFrequency(frequencyData) {
      return componentInterpreter.createFrequency(frequencyData);
    }

    function createOperation(operationData) {
      return componentInterpreter.createOperation(operationData);
    }

    function createSubscriberField(fieldData) {
      return componentInterpreter.createSubscriberField(fieldData);
    }

    function getCountries() {
      var defer = $q.defer();

      if (!countriesPromise) {
        automationDataservice.getCountries().then(function(response) {
          defer.resolve(response.data.countries);
        });
        countriesPromise = defer.promise;
      }

      return countriesPromise;
    }

    function getScores() {
      var defer = $q.defer();

      if (!scoresPromise) {
        automationDataservice.getScores().then(function(response) {
          defer.resolve(response.data.scores);
        });
        scoresPromise = defer.promise;
      }

      return scoresPromise;
    }

    function getOrigins() {
      var defer = $q.defer();

      if (!originsPromise) {
        automationDataservice.getOrigins().then(function(response) {
          defer.resolve(response.data.origins);
        });
        originsPromise = defer.promise;
      }

      return originsPromise;
    }

    function startAutomationCampaign(idScheduledTask) {
      return automationDataservice.startAutomationCampaign(idScheduledTask || model.id);
    }

    function stopAutomationCampaign(idScheduledTask) {
      return automationDataservice.stopAutomationCampaign(idScheduledTask || model.id);
    }

    function pauseAutomationCampaign(idScheduledTask) {
      return automationDataservice.pauseAutomationCampaign(idScheduledTask || model.id);
    }

    function setAutomationAsActive() {
      saveChanges().then(function() {
        var errCode = {
          fieldUpdateFails: 35,
          automationSubscribersListsBlocked: 192
        }
        startAutomationCampaign().then(function(response) {
          if (!response.data.success && response.data.ErrorCode) {
            switch (response.data.ErrorCode) {
              case errCode.fieldUpdateFails:
                updateAutomationFlowState();
                break;
              case errCode.automationSubscribersListsBlocked:
                showBlockedListModal();
                break;
              default:
                // TODO: this keeps previous behavior before this changes.
                // Instead this, we should let user know about the error. 
                model.state = AUTOMATION_STATE.ACTIVE;
                $window.location.href = '/Automation/Automation/AutomationApp/';
            }            
          } else {
            model.state = AUTOMATION_STATE.ACTIVE;
            $window.location.href = '/Automation/Automation/AutomationApp/';
          }
        });
      });
    }

    function showBlockedListModal() {
      ModalService.showModal({
        templateUrl: 'angularjs/partials/automation/automationWithBlockedListModal.html',
        controller: 'ModalYesOrNoCtrl',
        inputs: {
          data: {}
        }
      });
    }

    function checkCompleted(){
      model.isFlowComplete();
    }

    function getIsFlowComplete() {
      return model.completed;
    }

    function getIsAutomationActive() {
      return model.state === AUTOMATION_STATE.ACTIVE;
    }

    function validateDomain(domains, actualDomain) {
      var existDomain = _.find(domains, function(domain) {
        return actualDomain && actualDomain.idDomain === domain.IdDomain;
      });
      if (actualDomain.idDomain === 0 && actualDomain.url && !existDomain) {
        model.completed = AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN;
      } else if (actualDomain.idDomain && !existDomain) {
        model.completed = AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN;
      } else if (existDomain && existDomain.Status !== DOMAIN_STATUS.VERIFIED) {
        model.completed = AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN;
      }
    }

    function updateAutomationSiteBehaviorFlowState(domains, siteTracking) {
      if (!siteTracking) {
        model.completed = AUTOMATION_COMPLETED_STATE.WITH_SITE_TRACKING_DISABLED;
      } else {
        _.each(model.initialCondition.domains, function(actualDomain) {
          validateDomain(domains, actualDomain);
        });
      }
    }

    function updateAutomationDynamicContentFlowState(thirdPartyApps) {
      var completed = true;
      if (model.initialCondition.idThirdPartyApp) {
        var result;
        switch (model.automationType) {
          case AUTOMATION_TYPE.ABANDONED_CART:
          case AUTOMATION_TYPE.VISITED_PRODUCTS:
          case AUTOMATION_TYPE.PENDING_ORDER:
            result = thirdPartyApps.filter(function (val) {
              return val.IdThirdPartyApp === model.initialCondition.idThirdPartyApp;
            });
            break;
          default:
            result = [];
        }
        if (result.length === 0) {
          model.completed = AUTOMATION_COMPLETED_STATE.WITH_NON_INTEGRATION;
          completed = false;
        } else if (model.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS) {
          completed = domainHaveErrors(result, model.initialCondition.idThirdPartyApp) === 0;
        } else if (model.automationType === AUTOMATION_TYPE.ABANDONED_CART
          && model.initialCondition.idThirdPartyApp === 3) {
          completed = domainHaveErrors(result, model.initialCondition.idThirdPartyApp) === 0;
        }
      }
      return completed;
    }

    function updateAutomationFlowState() {
      var deletedUserFields;
      var domains;

      settingsService.getSettings().then(function(response) {
        domains = response.domains;
        siteTracking = response.siteTrackingActive;
        $rootScope.thirdPartyAppsConnected = response.thirdPartyAppsListConnected;
        thirdPartyAppsConnected = response.thirdPartyAppsListConnected;

        if (model.completed !== AUTOMATION_COMPLETED_STATE.COMPLETED &&
          model.completed !== AUTOMATION_COMPLETED_STATE.COMPLETE_WITH_WARNINGS) {
          model.completed = AUTOMATION_COMPLETED_STATE.INCOMPLETE;
        }
        if (model.automationType === AUTOMATION_TYPE.SCHEDULED_DATE
          || model.automationType === AUTOMATION_TYPE.RSS_TO_EMAIL) {
          if (model.initialCondition.frequency && model.initialCondition.frequency.type === FREQUENCY_TYPE.DAY_YEAR) {
            deletedUserFields = userFieldsDataservice.getDeletedFieldsByType(
              model.initialCondition.frequency.customFields, FIELD_TYPE.DATE);
            if (deletedUserFields.length) {
              model.completed = AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS;
              model.state = AUTOMATION_STATE.DRAFT;
            } else {
              model.completed = AUTOMATION_COMPLETED_STATE.INCOMPLETE;
              model.isFlowComplete();
            }
          } else if (model.completed === AUTOMATION_COMPLETED_STATE.WITH_DELETED_FIELDS) {
            model.completed = AUTOMATION_COMPLETED_STATE.INCOMPLETE;
            model.isFlowComplete();
          }
        } else if (model.automationType === AUTOMATION_TYPE.SITE_BEHAVIOR) {
          updateAutomationSiteBehaviorFlowState(domains, siteTracking);
        } else if (model.automationType === AUTOMATION_TYPE.ABANDONED_CART
          || model.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS
          || model.automationType === AUTOMATION_TYPE.PENDING_ORDER) {
          var completed = updateAutomationDynamicContentFlowState(thirdPartyAppsConnected);
          model.initialCondition.completed = completed;
          model.isFlowComplete();
        }
      });

    }

    function getHtmlContent(idCampaign) {
      return automationDataservice.getHtmlContent(idCampaign).then(function(response) {
        return response;
      });
    }

    function getListsItems(url, params) {
      return automationDataservice.getListsItems(url, params);
    }

    function getListsForTest() {
      return automationDataservice.getListsForSendTest();
    }

    function sendTestToList(idList, idCampaign) {
      return automationDataservice.sendTestToList(idList, idCampaign);
    }

    function sendTestToEmails(emailList, idCampaign) {
      return automationDataservice.sendTestToEmails(emailList, idCampaign);
    }

    function validateAndAutoCompleteRSS(url){
      return automationDataservice.validateAndAutoCompleteRSS(url);
    }
    /*TODO: This method should be removed when we start using the initial condition
    component type in the type prop and also an initialConditionType*/
    function isInitialConditionComponent(component) {
      return _.includes(initialConditionTypes, component.type);
    }

    function getHtmlContentForPreview(idCampaign) {
      return automationDataservice.getHtmlContentForPreview(idCampaign).then(function(response) {
        return response;
      });
    }

    function onEmailNameChange(uidEmail, newName) {
      // the Email name must be updated in the conditionals that are inside the condition components
      conditionsDataservice.updateEmailName(uidEmail, newName);
      // the Email name must be updated in the action operations
      $rootScope.$broadcast('CAMPAIGN.NAME_CHANGE', {
        name: newName,
        uidEmail: uidEmail
      });
    }

    function resizeCanvas(action) {
      var rootCondition = _.find(model.children, function(child){
        return child.type === COMPONENT_TYPE.CONDITION;
      });

      if (rootCondition) {
        var editorCondition = document.querySelector('#conditions-' + rootCondition.uid);
        if (!editorCondition) {
          return;
        }
        var conditionWidth = editorCondition.children[0].offsetWidth + editorCondition.children[1].offsetWidth;
        conditionWidth += action === 'remove' ? -250 : 250;
        var canvasContainer = document.querySelector('#canvas-elements--container');
        var canvas = document.querySelector('#editor-canvas');
        if (canvas.offsetWidth - 150 > conditionWidth) {
          canvasContainer.style.width = canvas.offsetWidth + 'px';
        } else {
          canvasContainer.style.width = conditionWidth + 200 + 'px';
        }
      }
      goToService.updateLinePosition();
    }

    function centerCanvas() {
      var canvasContainer = document.querySelector('#canvas-elements--container');
      var canvas = document.querySelector('#editor-canvas');
      var outer = canvas.offsetWidth;
      var inner = canvasContainer.offsetWidth;
      canvas.scrollLeft = (inner - outer) / 2;
      goToService.updateLinePosition();
    }

    function toggleCollapsePanel(value) {
      isPanelCollapsed = value;
      $timeout(function() {
        resizeCanvas();
      }, 800);
    }

    function getIsPanelCollapsed() {
      return isPanelCollapsed;
    }

    function getSiteBehaviorStatus() {
      return automationDataservice.getSiteBehaviorStatus().then(function(status) {
        return status;
      });
    }

    function confirmDomain(domain) {
      var validDomainRegEx = new RegExp('^[A-Za-z0-9._%+-]+@' + domain + '$');

      _.chain(parentComponents)
        .map(function(parent) {
          return parent.getEmailChildrenComponents();
        })
        .flatten()
        .filter(function(campaign) {
          return validDomainRegEx.test(campaign.fromEmail);
        })
        .each(function(campaign) {
          campaign.confirmedDomain = domain;
          campaign.checkCompleted();
          warningsStepsService.checkWarningStep(campaign);
        })
        .value();
    }

    function getProductStoresList(automationType) {
      // Filter result by Automation Type.
      var result = [];
      if ($rootScope.thirdPartyAppsConnected.length !== 0) {
        switch (automationType) {
        case AUTOMATION_TYPE.ABANDONED_CART:
          result = $rootScope.thirdPartyAppsConnected.filter(function(val) {
            return val.AbandonedCartEnabled === true && val.AbandonedCartCreated === false;
          });
          break;
        case AUTOMATION_TYPE.VISITED_PRODUCTS:
          result = $rootScope.thirdPartyAppsConnected.filter(function(val) {
            return val.VisitedProductsEnabled === true && val.VisitedProductsCreated === false;
          });
          break;
        case AUTOMATION_TYPE.PENDING_ORDER:
          result = $rootScope.thirdPartyAppsConnected.filter(function (val) {
            return val.PendingOrderEnabled === true && val.PendingOrderCreated === false;
          });
            break;
        case AUTOMATION_TYPE.CONFIRMATION_ORDER:
          result = $rootScope.thirdPartyAppsConnected.filter(function (val) {
            return val.ConfirmationOrderEnabled === true && val.ConfirmationOrderCreated === false;
          });
          break;
        default:
          return false;
        }
      }

      if (selectedTaskThirdPartySelected) {
        var selected = thirdPartyAppsConnected.find(function(obj) {
          return obj.IdThirdPartyApp === selectedTaskThirdPartySelected;
        });
        if (selected){
          result.push(selected);
        }
      }      

      // Parse result for dropdown.
      var resultParsedWidthThirdPartyConnectedFormated = [];
      for (var i = 0; i < result.length; i++) {
        resultParsedWidthThirdPartyConnectedFormated[i] = {
          label: result[i].Name,
          value: result[i].IdThirdPartyApp,
          DomainVerified: result[i].DomainVerified,
          IdThirdPartyApp: result[i].IdThirdPartyApp
        };
      }

      return resultParsedWidthThirdPartyConnectedFormated;
    }

    function domainHaveErrors(productsStoreOptions, selectedOption) {
      var domainError = 0;
      var domainVerified = productsStoreOptions.filter(function(val) {
        return val.DomainVerified === true && val.IdThirdPartyApp === selectedOption;
      }).length ? true : false;
      if (!siteTracking) {
        domainError = 3;
      } else if (!domainVerified) {
        domainError = 4;
      }
      if (domainError) {
        model.completed = AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN;
      } else if (model.completed === AUTOMATION_COMPLETED_STATE.WITH_DELETED_DOMAIN ||
        model.completed === AUTOMATION_COMPLETED_STATE.WITH_NON_VERIFIED_DOMAIN ||
        model.completed === AUTOMATION_COMPLETED_STATE.WITH_NON_REGISTERED_DOMAIN) {
        model.completed = AUTOMATION_COMPLETED_STATE.COMPLETED;
        domainError = 0;
      }
      return domainError;
    }

    function applyDropDownChange() {
      model.children[0].hasUnsavedChanges = true;
    }

    function hasBlockedList(){
      return model.initialCondition.suscriptionLists.some(
      function(e){
        return e.ListStatus == 14;
      })
    } 
    
    function getInitialConditionUid() {
      return model.initialCondition.uid;
    }
  }
})();
