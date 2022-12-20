(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('changesManager', changesManager);

  changesManager.$inject = [
    '$rootScope',
    '$timeout',
    '$window',
    'automation',
    'CHANGE_TYPE',
    'COMPONENT_TYPE',
    'conditionsDataservice',
    'selectedElementsService',
    'utils',
    'warningsStepsService',
    'goToService'
  ];

  function changesManager($rootScope, $timeout, $window, automation, CHANGE_TYPE, COMPONENT_TYPE, conditionsDataservice,
    selectedElementsService, utils, warningsStepsService, goToService) {
    var history = [];
    var index = -1;
    var isChanging = false;
    //The automation's first state is saved
    var areUnsavedChanges = false;
    var isEnabled = true;

    var service = {
      add: add,
      undo: undo,
      redo: redo,
      isChanging: getIsChanging,
      canUndo: canUndo,
      canRedo: canRedo,
      setUnsavedChanges: setUnsavedChanges,
      getUnsavedChanges: getUnsavedChanges,
      enable: enable,
      disable: disable,
      isEnabled: getIsEnabled
    };

    return service;

    function add(details) {
      updateOnunload();
      var change = createChangeObject(details);
      history.splice(++index, history.length - index, change);
      areUnsavedChanges = true;
    }

    function undo() {
      var change = history[index];
      if (change) {
        isChanging = true;
        change.undo(change.parameters);
        index--;
        $timeout(function() {
          isChanging = false;
        }, 0, false);
        areUnsavedChanges = true;
      }
    }

    function redo() {
      var change = history[index + 1];
      if (change) {
        isChanging = true;
        change.redo(change.parameters);
        index++;
        $timeout(function() {
          isChanging = false;
        }, 0, false);
        areUnsavedChanges = true;
      }
    }

    function createChangeObject(changeDetails) {
      var undo;
      var redo;
      var parameters;
      switch (changeDetails.type) {
      case CHANGE_TYPE.ADD_COMPONENT:
        parameters = {
          component: angular.copy(changeDetails.component),
          index: changeDetails.index,
          branch: changeDetails.branch
        };
        undo = function(parameters) {
          automation.deleteComponent(parameters.component, parameters.branch);
        };
        redo = function(parameters) {
          var newComponent = automation.addComponent(parameters.component, parameters.index, parameters.branch);
          setSelectedComponent(newComponent);
        };
        break;

      case CHANGE_TYPE.ADD_CONDITION_AND_TRANSFER:
        parameters = changeDetails;

        undo = function(parameters) {
          automation.transferChildren({
            new: parameters.parentUids.old,
            old: parameters.parentUids.new
          }, parameters.children, parameters.index, {
            origin: parameters.branch.destiny,
            destiny: parameters.branch.origin
          });
          automation.deleteComponent(parameters.component, parameters.branch.origin);
        };
        redo = function(parameters) {
          var newComponent = automation.addComponent(parameters.component, parameters.index, parameters.branch.origin);
          automation.transferChildren({
            new: parameters.parentUids.new,
            old: parameters.parentUids.old
          }, parameters.children, 0, {
            origin: parameters.branch.origin,
            destiny: parameters.branch.destiny
          });
          setSelectedComponent(newComponent);
        };
        break;

      case CHANGE_TYPE.ADD_CONDITIONAL:
        parameters = {
          conditionUid: changeDetails.conditionUid,
          newConditional: angular.copy(changeDetails.newConditional),
          oldConditional: angular.copy(changeDetails.oldConditional),
          index: changeDetails.index
        };

        undo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          conditionComponent.removeConditional(parameters.newConditional);
          conditionComponent.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(conditionComponent);
        };
        redo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          var newConditional = automation.createConditional(parameters.newConditional);
          conditionComponent.addConditional(newConditional, parameters.oldConditional, parameters.index);
          selectedElementsService.setSelectedConditional(newConditional);
        };
        break;

      case CHANGE_TYPE.DELETE_COMPONENT:
        parameters = {
          component: angular.copy(changeDetails.component),
          index: changeDetails.index,
          branch: changeDetails.branch
        };
        undo = function(parameters) {
          automation.addComponent(parameters.component, parameters.index, parameters.branch);
          setSelectedComponent(parameters.component);
        };
        redo = function(parameters) {
          automation.deleteComponent(parameters.component, parameters.branch);
        };
        break;

      case CHANGE_TYPE.DELETE_CONDITION_AND_TRANSFER:
        parameters = changeDetails;

        undo = function(parameters) {
          var newComponent = automation.addComponent(parameters.component, parameters.index, parameters.branch.destiny);
          automation.transferChildren({
            new: parameters.parentUids.old,
            old: parameters.parentUids.new
          }, parameters.children, 0, {
            origin: parameters.branch.destiny,
            destiny: parameters.branch.origin
          });
          setSelectedComponent(newComponent);
        };
        redo = function(parameters) {
          automation.transferChildren({
            new: parameters.parentUids.new,
            old: parameters.parentUids.old
          }, parameters.children, parameters.index, {
            origin: parameters.branch.origin,
            destiny: parameters.branch.destiny
          });
          automation.deleteComponent(parameters.component, parameters.branch.destiny);
        };
        break;

      case CHANGE_TYPE.DELETE_CONDITIONAL:
        parameters = {
          conditionUid: changeDetails.conditionUid,
          conditional: angular.copy(changeDetails.conditional),
          index: changeDetails.index
        };

        undo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          var newConditional = automation.createConditional(parameters.conditional);
          conditionComponent.addConditional(newConditional, null, parameters.index);
          conditionComponent.conditionals[parameters.index].checkCompleted();
          /* check if the new conditional is a duplicate of another conditional
            and send the 'regenerate' flag in true to regenerate the origin and duplicates */
          conditionsDataservice.checkDuplicateConditionals(newConditional.uid, true);
          selectedElementsService.setSelectedConditional(newConditional);
        };
        redo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          //update the duplicates of the conditional that will be removed
          conditionsDataservice.updateDuplicatesOfConditional(parameters.conditional.uid);
          conditionComponent.removeConditional(parameters.conditional);
          conditionComponent.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(conditionComponent);
        };
        break;

      case CHANGE_TYPE.PROPERTY:
        parameters = changeDetails;

        undo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          //we need to put the flag in true to update the campaign in the next saving process
          if (component.type === COMPONENT_TYPE.CAMPAIGN || component.type === COMPONENT_TYPE.DELAY || component.type === COMPONENT_TYPE.GOTO_STEP) {
            utils.assign(component, 'hasUnsavedChanges', true);
          }
          if (component.type === COMPONENT_TYPE.GOTO_STEP) {
            updateGotoLine(component, parameters.oldValue, parameters.newValue);
          }
          utils.assign(component, parameters.key, parameters.oldValue);
          if (parameters.callback) {
            parameters.callback(parameters.uid, parameters.oldValue);
          }
          setSelectedComponent(component);
          scrollIntoProperty(parameters.key);
          component.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(component);
        };
        redo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          //we need to put the flag in true to update the campaign in the next saving process
          if (component.type === COMPONENT_TYPE.CAMPAIGN || component.type === COMPONENT_TYPE.DELAY || component.type === COMPONENT_TYPE.GOTO_STEP) {
            utils.assign(component, 'hasUnsavedChanges', true);
          }
          if (component.type === COMPONENT_TYPE.GOTO_STEP) {
            updateGotoLine(component, parameters.newValue, parameters.oldValue);
          }
          utils.assign(component, parameters.key, parameters.newValue);
          if (parameters.callback) {
            parameters.callback(parameters.uid, parameters.newValue);
          }
          setSelectedComponent(component);
          scrollIntoProperty(parameters.key);
          component.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(component);
        };
        break;

      case CHANGE_TYPE.CONDITIONAL_PROPERTY:
        parameters = changeDetails;

        undo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          var conditionalComponent = conditionComponent.conditionals[parameters.conditionalIndex];

          utils.assign(conditionalComponent, parameters.key, parameters.oldValue);
          //update the duplicates of the conditional component
          conditionsDataservice.updateDuplicatesOfConditional(conditionalComponent.uid);
          conditionComponent.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(conditionComponent);
          /* check if the conditional component is a duplicate of another conditional
            and send the 'regenerate' flag in true to regenerate the origin and duplicates */
          conditionsDataservice.checkDuplicateConditionals(conditionalComponent.uid, true);
        };
        redo = function(parameters) {
          var conditionComponent = automation.getComponentByUid(parameters.conditionUid);
          var conditionalComponent = conditionComponent.conditionals[parameters.conditionalIndex];

          utils.assign(conditionalComponent, parameters.key, parameters.newValue);
          //update the duplicates of the conditional component
          conditionsDataservice.updateDuplicatesOfConditional(conditionalComponent.uid);
          conditionComponent.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(conditionComponent);
          /* check if the conditional component is a duplicate of another conditional
            and send the 'regenerate' flag in true to regenerate the origin and duplicates */
          conditionsDataservice.checkDuplicateConditionals(conditionalComponent.uid, true);
        };
        break;

      case CHANGE_TYPE.IMPORT_HTML:
        parameters = changeDetails;

        undo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          disable();
          component.setData(parameters.oldValue);
          setSelectedComponent(component);
          component.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(component);
          if (parameters.oldValue.innerHTML !== '') {
            automation.saveCampaign(component, parameters.oldValue.innerHTML);
          }
          automation.saveChanges().then(function() {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            enable();
          });
        };
        redo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          disable();
          component.setData(parameters.newValue);
          setSelectedComponent(component);
          component.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(component);
          if (parameters.newValue.innerHTML !== '') {
            automation.saveCampaign(component, parameters.newValue.innerHTML);
          }
          automation.saveChanges().then(function() {
            $rootScope.$broadcast('UPDATE_SAVING_STATE');
            enable();
          });
        };
        break;

      case CHANGE_TYPE.TINY_HTML:
        parameters = changeDetails;

        undo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          disable();
          if (parameters.oldValue.innerHTML.length !== 0 ){
            automation.saveTinyEditorContent(component.id, parameters.oldValue.innerHTML).then(function() {
              component.setData(parameters.oldValue);
              setSelectedComponent(component);
              component.checkCompleted();
              automation.checkCompleted();
              warningsStepsService.checkWarningStep(component);
              enable();
            });
          } else {
            component.setData(parameters.oldValue);
            setSelectedComponent(component);
            component.checkCompleted();
            automation.checkCompleted();
            warningsStepsService.checkWarningStep(component);
            enable();
          }
        };
        redo = function(parameters) {
          var component = automation.getComponentByUid(parameters.uid);
          disable();
          if (parameters.newValue.innerHTML.length !== 0){
            automation.saveTinyEditorContent(component.id, parameters.newValue.innerHTML).then(function() {
              component.setData(parameters.newValue);
              setSelectedComponent(component);
              component.checkCompleted();
              automation.checkCompleted();
              warningsStepsService.checkWarningStep(component);
              enable();
            });
          } else {
            component.setData(parameters.newValue);
            setSelectedComponent(component);
            component.checkCompleted();
            automation.checkCompleted();
            warningsStepsService.checkWarningStep(component);
            enable();
          }
        };
        break;

      case CHANGE_TYPE.AUTOMATION_NAME:
        parameters = changeDetails;
        undo = function(parameters) {
          var component = automation.getModel();
          if (component.name !== parameters.oldValue) {
            automation.getAutomationName().then(function(defaultName) {
              if (parameters.oldValue === '') {
                parameters.oldValue = defaultName;
              }
              utils.assign(component, parameters.key, parameters.oldValue);
              setSelectedComponent(component);
              $rootScope.$broadcast('AUTOMATION_NAME_FOCUS');
            });
          }
        };
        redo = function(parameters) {
          var component = automation.getModel();
          if (component.name !== parameters.newValue) {
            utils.assign(component, parameters.key, parameters.newValue);
            setSelectedComponent(component);
            $rootScope.$broadcast('AUTOMATION_NAME_FOCUS');
          }
        };
        break;

      default:
        throw new Error('Unhandled change type:' + parameters.type);
      }

      return {
        parameters: parameters,
        undo: undo,
        redo: redo
      };
    }

    function updateGotoLine(component, idGoto, lastId) {
      goToService.markComponentInGotoSelection(lastId, false, ['goto-connected']);
      goToService.removeGotoLine(component.uid);
      component.line = goToService.drawGoToLineBetweenComponents({
        sourceComponentUid: component.uid,
        targetComponentUid: idGoto,
        applyGotoSelectionStyle: true,
      });
      goToService.addGotoLine(component.uid, component);
      goToService.markComponentInGotoSelection(component.uid, true, ['goto-connected']);
      goToService.markComponentInGotoSelection(idGoto, true, ['goto-connected']);
    }

    function updateOnunload() {
      if (areUnsavedChanges && !$window.onbeforeunload) {
        $window.onbeforeunload = function() {
          if (areUnsavedChanges) {
            automation.saveChanges(automation.getModel());
          }
          return undefined;
        };
      }
    }

    function setSelectedComponent(component) {
      if (selectedElementsService.getSelectedComponent() !== component
        && component.type !== COMPONENT_TYPE.AUTOMATION) {
        selectedElementsService.setSelectedComponent(component);
      }
    }

    function scrollIntoProperty(id) {
      selectedElementsService.scrollIntoProperty(id);
    }

    function getIsChanging() {
      return isChanging;
    }

    function canUndo() {
      return !!history[index];
    }

    function canRedo() {
      return !!history[index + 1];
    }

    function setUnsavedChanges(value) {
      areUnsavedChanges = value;
    }

    function getUnsavedChanges() {
      return areUnsavedChanges;
    }

    function enable() {
      $timeout(function() {
        isEnabled = true;
      });
    }

    function disable() {
      isEnabled = false;
    }

    function getIsEnabled() {
      return isEnabled;
    }
  }
})();
