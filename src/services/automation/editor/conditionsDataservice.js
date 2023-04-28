(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .service('conditionsDataservice', conditionsDataservice);

  conditionsDataservice.$inject = [
    '$injector',
    'COMPONENT_TYPE',
    'CONDITIONAL_EVENT',
    'CONDITIONAL_TYPE',
    'DUPLICATE_STATE',
  ];

  function conditionsDataservice(
    $injector,
    COMPONENT_TYPE,
    CONDITIONAL_EVENT,
    CONDITIONAL_TYPE,
    DUPLICATE_STATE
  ) {
    var conditionComponents = {};
    var conditionalComponents = [];

    var service = {
      addConditionReference: addConditionReference,
      addConditionalReference: addConditionalReference,
      addChildReference: addChildReference,
      checkDuplicateConditionals: checkDuplicateConditionals,
      getAllConditionChildren: getAllConditionChildren,
      getChildBranch: getChildBranch,
      getChildReference: getChildReference,
      getEmailChildReference: getEmailChildReference,
      isEmailLinkedToConditional: isEmailLinkedToConditional,
      removeChildReference: removeChildReference,
      removeConditionalReference: removeConditionalReference,
      updateConditionalData: updateConditionalData,
      updateDuplicatesOfConditional: updateDuplicatesOfConditional,
      updateEmailName: updateEmailName,
      validateConditionalsLinks: validateConditionalsLinks,
      getAllEmailChildReference: getAllEmailChildReference,
    };

    return service;

    function addConditionReference(conditionUid) {
      if (!conditionComponents[conditionUid]) {
        conditionComponents[conditionUid] = {};
      }
    }

    function addConditionalReference(conditional) {
      conditionalComponents.push(conditional);
    }

    function addChildReference(conditionUid, child, branch) {
      conditionComponents[conditionUid][child.uid] = {
        branch: branch,
        type: child.type,
        instance: child,
      };
    }

    function getAllConditionChildren(conditionUid) {
      return _.map(conditionComponents[conditionUid], function (child) {
        return child.instance;
      });
    }

    function getChildBranch(conditionUid, childUid) {
      return conditionComponents[conditionUid][childUid].branch;
    }

    function getChildReference(conditionUid, childUid) {
      return conditionComponents[conditionUid][childUid]
        ? conditionComponents[conditionUid][childUid].instance
        : false;
    }

    function getEmailChildReference(conditionUid, idEmail) {
      var emailChild = _.find(
        conditionComponents[conditionUid],
        function (child) {
          return (
            child.type === COMPONENT_TYPE.CAMPAIGN &&
            child.instance.id === idEmail
          );
        }
      );
      return emailChild ? emailChild.instance : false;
    }

    function getAllEmailChildReference(conditionUid) {
      var emailChildren = _.filter(
        conditionComponents[conditionUid],
        function (child) {
          return child.type === COMPONENT_TYPE.CAMPAIGN;
        }
      );
      return _.map(emailChildren, function (child) {
        return child.instance;
      });
    }

    function isEmailLinkedToConditional(uidEmail) {
      return !!_.find(conditionalComponents, function (conditional) {
        return (
          conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR &&
          conditional.email.uidEmail === uidEmail
        );
      });
    }

    function removeChildReference(conditionUid, childUid) {
      delete conditionComponents[conditionUid][childUid];
    }

    function removeConditionalReference(conditionalToRemove) {
      conditionalComponents = _.filter(
        conditionalComponents,
        function (conditional) {
          return conditional.uid !== conditionalToRemove.uid;
        }
      );
    }

    function updateEmailName(uidEmail, newName) {
      var emailData = {
        name: newName,
      };
      updateConditionalData(uidEmail, emailData);
    }

    function updateConditionalData(uidEmail, emailData) {
      var conditionalsToUpdate = _.filter(
        conditionalComponents,
        function (conditional) {
          return (
            conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR &&
            conditional.email.uidEmail === uidEmail &&
            conditional.email.uidEmail !== 0
          );
        }
      );
      _.each(conditionalsToUpdate, function (conditional) {
        if (emailData.hasOwnProperty('id')) {
          conditional.email.idEmail = emailData.id;
        }
        if (emailData.hasOwnProperty('name')) {
          conditional.email.label = emailData.name;
        }
        if (emailData.hasOwnProperty('links')) {
          var link = _.find(emailData.links, function (link) {
            return conditional.link.idLink === link.oldIdLink;
          });
          if (link) {
            conditional.link.idLink = link.idLink;
          }
        }
      });
    }

    function validateConditionalsLinks(uidEmail) {
      var conditionalsToValidate = _.filter(
        conditionalComponents,
        function (conditional) {
          return (
            conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR &&
            (conditional.event === CONDITIONAL_EVENT.LINK_CLICKED ||
              conditional.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED) &&
            conditional.email.uidEmail === uidEmail &&
            conditional.email.uidEmail !== 0
          );
        }
      );
      _.each(conditionalsToValidate, function (conditional) {
        conditional.validateLink();
      });
    }

    function updateDuplicatesOfConditional(conditionalUid) {
      var conditionalsToUpdate;
      var selectedConditional = _.find(
        conditionalComponents,
        function (conditional) {
          return conditional.uid === conditionalUid;
        }
      );

      if (selectedConditional.duplicate === DUPLICATE_STATE.ORIGIN) {
        conditionalsToUpdate = _.filter(
          conditionalComponents,
          function (conditional) {
            return (
              conditional.type === selectedConditional.type &&
              conditional.duplicate === selectedConditional.uid
            );
          }
        );
        if (!conditionalsToUpdate.length) {
          selectedConditional.duplicate = DUPLICATE_STATE.FALSE;
          return;
        }
        if (conditionalsToUpdate.length === 1) {
          conditionalsToUpdate[0].duplicate = DUPLICATE_STATE.FALSE;
        } else {
          conditionalsToUpdate[0].duplicate = DUPLICATE_STATE.ORIGIN;
          for (var index = 1; index < conditionalsToUpdate.length; index++) {
            conditionalsToUpdate[index].duplicate = conditionalsToUpdate[0].uid;
          }
        }
      }
      selectedConditional.duplicate = DUPLICATE_STATE.FALSE;
    }

    function checkDuplicateConditionals(conditionalUid, regenerate) {
      var allConditionConditionals;
      var automation = $injector.get('automation');
      var warningsStepsService = $injector.get('warningsStepsService');
      var selectedCondition;
      var selectedConditional = _.find(
        conditionalComponents,
        function (conditional) {
          return conditional.uid === conditionalUid;
        }
      );

      if (!selectedConditional || !selectedConditional.completed) {
        return;
      }
      selectedCondition = automation.getComponentByUid(
        selectedConditional.conditionUid
      );
      allConditionConditionals = _.filter(
        selectedCondition.conditionals,
        function (conditional) {
          return (
            conditional.type === selectedConditional.type &&
            conditional.uid !== selectedConditional.uid
          );
        }
      );
      _.each(allConditionConditionals, function (conditional) {
        if (selectedConditional.isEqual(conditional)) {
          if (
            conditional.duplicate !== DUPLICATE_STATE.FALSE &&
            conditional.duplicate !== DUPLICATE_STATE.ORIGIN
          ) {
            selectedConditional.duplicate = conditional.duplicate;
          } else {
            conditional.duplicate = DUPLICATE_STATE.ORIGIN;
            selectedConditional.duplicate = conditional.uid;
          }
          if (regenerate) {
            regenerateOriginAndDuplicates(
              selectedCondition,
              selectedConditional.type
            );
          }
          selectedCondition.checkCompleted();
          automation.checkCompleted();
          warningsStepsService.checkWarningStep(selectedCondition);
          return false;
        }
      });
    }

    function regenerateOriginAndDuplicates(condition, conditionalType) {
      var duplicates;
      var originals = _.filter(condition.conditionals, function (conditional) {
        return (
          conditional.type === conditionalType &&
          conditional.duplicate === DUPLICATE_STATE.ORIGIN
        );
      });

      _.each(originals, function (origin) {
        duplicates = _.filter(condition.conditionals, function (conditional) {
          return conditional.duplicate === origin.uid;
        });
        if (!duplicates.length) {
          origin.duplicate = DUPLICATE_STATE.FALSE;
        } else {
          duplicates.push(origin);
          _.each(duplicates, function (conditional) {
            conditional.index = condition.getConditionalIndex(conditional);
          });
          duplicates = _.sortBy(duplicates, 'index');
          duplicates[0].duplicate = DUPLICATE_STATE.ORIGIN;
          delete duplicates[0].index;
          for (var index = 1; index < duplicates.length; index++) {
            duplicates[index].duplicate = duplicates[0].uid;
            delete duplicates[index].index;
          }
        }
      });
    }
  }
})();
