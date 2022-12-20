(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('warningsStepsService', warningsStepsService);

  warningsStepsService.$inject = [
    '$injector',
    'COMPONENT_TYPE',
    'conditionsDataservice'
  ];

  function warningsStepsService($injector, COMPONENT_TYPE, conditionsDataservice) {
    var warningsSteps = {};
    var service = {
      createWarningsSteps: createWarningsSteps,
      getAllWarningsSteps: getAllWarningsSteps,
      removeWarningStep: removeWarningStep,
      getWarningsStepsCount: getWarningsStepsCount,
      getHasWarningSteps: getHasWarningSteps,
      checkWarningStep: checkWarningStep
    };

    function checkWarningStep(component) {
      var automation = $injector.get('automation');
      if (automation.isInitialConditionComponent(component)) {
        return;
      }

      if (component.completed) {
        removeWarningStep(component);
      } else {
        createWarningsSteps(component.type);
      }
    }

    function createWarningsSteps(componentType) {
      var automation = $injector.get('automation');
      var parentComponents = automation.getAllParentComponents();

      warningsSteps[componentType] = [];
      _.each(parentComponents, function(parentComponent) {
        var tmpArray = [];
        var parentChildren = parentComponent.type !== COMPONENT_TYPE.CONDITION ?
          parentComponent.children :
          conditionsDataservice.getAllConditionChildren(parentComponent.uid);

        _.each(parentChildren, function(child) {
          if (child.type === componentType && !child.completed) {
            tmpArray.push(child.uid);
          }
        });
        if (tmpArray.length) {
          warningsSteps[componentType] = warningsSteps[componentType].concat(tmpArray);
        }
      });
    }

    function removeWarningStep(component) {
      if (warningsSteps[component.type]) {
        var index = warningsSteps[component.type].indexOf(component.uid);
        if (index > -1) {
          warningsSteps[component.type].splice(index, 1);
        }

        if (!warningsSteps[component.type].length) {
          delete warningsSteps[component.type];
        }
      }
    }

    function getAllWarningsSteps() {
      return warningsSteps;
    }

    function getWarningsStepsCount() {
      var count = 0;
      _.each(Object.keys(warningsSteps), function(objectType) {
        count += warningsSteps[objectType].length;
      });
      return count;
    }

    function getHasWarningSteps() {
      return !_.isEmpty(warningsSteps);
    }

    return service;
  }
})();
