(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorCondition', dpEditorCondition);

  dpEditorCondition.$inject = [
    '$translate',
    'automation',
    'changesManager',
    'CHANGE_TYPE',
    'CONDITION_BRANCH',
    'CONDITIONAL_EVENT',
    'CONDITIONAL_TYPE',
    'conditionsDataservice',
    'FIELD_TYPE',
    'MAX_ITEMS_TO_SHOW',
    'selectedElementsService',
    'optionsListDataservice',
    'CONDITION_OPERATOR',
    'goToService',
    'COMPONENT_TYPE',
  ];

  function dpEditorCondition($translate, automation, changesManager, CHANGE_TYPE, CONDITION_BRANCH, CONDITIONAL_EVENT,
    CONDITIONAL_TYPE, conditionsDataservice, FIELD_TYPE, MAX_ITEMS_TO_SHOW, selectedElementsService,
    optionsListDataservice, CONDITION_OPERATOR, goToService, COMPONENT_TYPE) {
    var directive = {
      restrict: 'E',
      scope: {
        branch: '=',
        component: '='
      },
      templateUrl: 'angularjs/partials/automation/editor/directives/components/dp-editor-condition.html',
      link: link
    };

    return directive;

    function link(scope, element) {
      var negativeConditonalEvents = optionsListDataservice.getNegativeConditionalEvents();
      scope.CONDITION_BRANCH = CONDITION_BRANCH;

      element.ready(function() {
        automation.resizeCanvas();
        automation.centerCanvas();
      });

      scope.$watch(selectedElementsService.getSelectedComponent, function(newComponent) {
        if (newComponent) {
          scope.selectedComponent = newComponent;
          scope.selectedComponentUid = scope.selectedComponent ? scope.selectedComponent.uid : -1;
        } else {
          scope.selectedComponent = null;
        }
      });

      scope.canBeRemoved = function() {
        scope.showDeleteWarning = scope.component.positiveSiblings.length > 0
          && scope.component.negativeSiblings.length > 0;
        return !scope.showDeleteWarning;
      };

      scope.isVerificationTimeNeeded = function() {
        return !!(scope.component && _.find(scope.component.conditionals, function(conditional) {
          return conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR
          || conditional.type === CONDITIONAL_TYPE.SITE_BEHAVIOR;
        }));
      };

      scope.hasNegativeConditionalEvents = function() {
        var hasNegativeEvent = false;

        if (scope.component && scope.component.operator === CONDITION_OPERATOR.AND) {
          _.each(scope.component.conditionals, function(conditional) {
            hasNegativeEvent = _.includes(negativeConditonalEvents, conditional.event);
            if (hasNegativeEvent) {
              return false;
            }
          });
        }

        return hasNegativeEvent;
      };

      scope.getConditionSummary = function() {
        var conditional;
        var innerHtml = '';
        var index;
        var verificationTime;
        var truncated;

        if (scope.component.name && scope.component.name.length) {
          innerHtml += scope.component.name;
        } else if (!scope.component.name
          && (!scope.component.conditionals.length || !scope.component.conditionals[0].completed)) {
          innerHtml += $translate.instant('automation_editor.canvas.condition_placeholder');
        } else {
          index = 0;
          truncated = false;
          // intro
          verificationTime = scope.isVerificationTimeNeeded();
          if (verificationTime) {
            innerHtml += '<strong class="selected">' + $translate.instant('automation_editor.components.condition.canvas_description.check_for') + '</strong>';
            if (scope.component.time) {
              innerHtml += '<strong class="selected">' + scope.component.time;
              if (parseInt(scope.component.time) === 1) {
                innerHtml += $translate.instant('automation_editor.components.condition.canvas_description.singular_' + scope.component.timeUnit);
              } else {
                innerHtml += $translate.instant('automation_editor.components.condition.canvas_description.plural_' + scope.component.timeUnit);
              }
              innerHtml += '</strong>';
            } else {
              innerHtml += '<span class="brackets">&#91;&#91;&#91;&hellip;&#93;&#93;&#93;</span>';
              innerHtml += '<strong class="selected">' + $translate.instant('automation_editor.components.condition.canvas_description.of_time') + '</strong>';
            }
            innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.canvas_description.if_subscriber') + '</span>';
          }
          // conditionals resume
          while (index < scope.component.conditionals.length && !truncated) {
            conditional = scope.component.conditionals[index];
            // campaign behavior
            if (conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR && conditional.completed) {
              if (isFirstConditional(conditional.type, conditional.uid)) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.canvas_description.intro_lower') + '</span>';
              }
              innerHtml += '<strong class="selected">&nbsp;' + $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.canvas_description.' + conditional.event) + '</strong> ';
              if (conditional.event === CONDITIONAL_EVENT.LINK_CLICKED
                || conditional.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED) {
                innerHtml += '<span class="h-break-word link--default">' + conditional.link.url + '&nbsp;</span>';
              }
              if (conditional.event !== CONDITIONAL_EVENT.OPEN_EMAIL
                && conditional.event !== CONDITIONAL_EVENT.EMAIL_NOT_OPEN) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.campaign_behavior.canvas_description.nexus_of') + '</span>';
              }
              innerHtml += '<span>&quot;' + conditional.email.label + '&quot;</span>';
            // list membership
            } else if (conditional.type === CONDITIONAL_TYPE.LIST_MEMBERSHIP && conditional.completed) {
              if (isFirstConditional(conditional.type, conditional.uid)) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.list_membership.canvas_description.intro_' + (index === 0 && !verificationTime ? 'upper' : 'lower')) + '</span>';
              }
              innerHtml += '<strong class="selected">&nbsp;' + $translate.instant('automation_editor.components.condition.conditionals.list_membership.canvas_description.' + conditional.event) + '</strong>';
              innerHtml += '<span>&nbsp;&quot;' + conditional.subscriptionList.ListName + '&quot;</span>';
            // subscriber information
            } else if (conditional.type === CONDITIONAL_TYPE.SUBSCRIBER_INFORMATION && conditional.completed) {
              innerHtml += '<span class="text-too-long">';
              if (isFirstConditional(conditional.type, conditional.uid)) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_' + (index === 0 && !verificationTime ? 'upper' : 'lower'));
                innerHtml += '<strong class="selected">&nbsp;' + conditional.field.label + '</strong>';
                innerHtml += $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_subject') + '</span>';
              } else {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_possessive') + '</span>';
                innerHtml += '<strong class="selected">&nbsp;' + conditional.field.label + '</strong>';
              }
              if (conditional.field.type === FIELD_TYPE.DATE || conditional.field.type === FIELD_TYPE.REAL
                || conditional.field.type === FIELD_TYPE.STRING || conditional.field.type === FIELD_TYPE.EMAIL
                || conditional.field.type === FIELD_TYPE.PHONE) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.criteria.' + conditional.field.criteria) + '</span>';
              }
              if (conditional.field.type === FIELD_TYPE.REAL || conditional.field.type === FIELD_TYPE.STRING
                || conditional.field.type === FIELD_TYPE.EMAIL
                || conditional.field.type === FIELD_TYPE.PHONE) {
                innerHtml += '<span>&quot;' + conditional.field.value + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.DATE) {
                innerHtml += formatDate(conditional.field.date);
              }
              if (conditional.field.type === FIELD_TYPE.BOOLEAN || conditional.field.type === FIELD_TYPE.COUNTRY
                || conditional.field.type === FIELD_TYPE.GENDER || conditional.field.type === FIELD_TYPE.CONSENT
                || conditional.field.type === FIELD_TYPE.SCORE || conditional.field.type === FIELD_TYPE.ORIGIN
                || conditional.field.type === FIELD_TYPE.PERMISSION) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_is') + '</span>';
              }
              if (conditional.field.type === FIELD_TYPE.BOOLEAN || conditional.field.type === FIELD_TYPE.PERMISSION) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + (conditional.field.value ? 'positive' : 'negative')) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.COUNTRY) {
                innerHtml += '<span>&quot;' + conditional.field.country.name + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.GENDER) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + conditional.field.gender) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.CONSENT) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + (conditional.field.value ? 'positive' : 'negative')) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.SCORE) {
                innerHtml += '<span>&quot;' + conditional.field.score.name + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.ORIGIN) {
                innerHtml += '<span>&quot;' + conditional.field.origin.name + '&quot;</span>';
              }
              innerHtml += '</span>';
              } else if (conditional.type === CONDITIONAL_TYPE.ABANDONED_CART_INFORMATION && conditional.completed) {
              innerHtml += '<span class="text-too-long">';
              if (isFirstConditional(conditional.type, conditional.uid)) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_' + (index === 0 && !verificationTime ? 'upper' : 'lower'));
                innerHtml += '<strong class="selected">&nbsp;' + conditional.field.label + '</strong>';
                innerHtml += $translate.instant('automation_editor.components.condition.conditionals.abandoned_cart_information.the_cart') + '</span>';
              } else {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_possessive') + '</span>';
                innerHtml += '<strong class="selected">&nbsp;' + conditional.field.label + '</strong>';
              }
              if (conditional.field.type === FIELD_TYPE.DATE || conditional.field.type === FIELD_TYPE.REAL
                || conditional.field.type === FIELD_TYPE.STRING || conditional.field.type === FIELD_TYPE.EMAIL
                || conditional.field.type === FIELD_TYPE.PHONE) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.criteria.' + conditional.field.criteria) + '</span>';
              }
              if (conditional.field.type === FIELD_TYPE.REAL || conditional.field.type === FIELD_TYPE.STRING
                || conditional.field.type === FIELD_TYPE.EMAIL
                || conditional.field.type === FIELD_TYPE.PHONE) {
                innerHtml += '<span>&quot;' + conditional.field.value + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.DATE) {
                innerHtml += formatDate(conditional.field.date);
              }
              if (conditional.field.type === FIELD_TYPE.BOOLEAN || conditional.field.type === FIELD_TYPE.COUNTRY
                || conditional.field.type === FIELD_TYPE.GENDER || conditional.field.type === FIELD_TYPE.CONSENT
                || conditional.field.type === FIELD_TYPE.SCORE || conditional.field.type === FIELD_TYPE.ORIGIN
                || conditional.field.type === FIELD_TYPE.PERMISSION) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.intro_is') + '</span>';
              }
              if (conditional.field.type === FIELD_TYPE.BOOLEAN || conditional.field.type === FIELD_TYPE.PERMISSION) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + (conditional.field.value ? 'positive' : 'negative')) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.COUNTRY) {
                innerHtml += '<span>&quot;' + conditional.field.country.name + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.GENDER) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + conditional.field.gender) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.CONSENT) {
                innerHtml += '<span>&quot;' + $translate.instant('automation_editor.components.condition.conditionals.subscriber_information.canvas_description.' + (conditional.field.value ? 'positive' : 'negative')) + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.SCORE) {
                innerHtml += '<span>&quot;' + conditional.field.score.name + '&quot;</span>';
              }
              if (conditional.field.type === FIELD_TYPE.ORIGIN) {
                innerHtml += '<span>&quot;' + conditional.field.origin.name + '&quot;</span>';
              }
              innerHtml += '</span>';
            // site behavior
            } else if (conditional.type === CONDITIONAL_TYPE.SITE_BEHAVIOR && conditional.completed) {
              if (isFirstConditional(conditional.type, conditional.uid)) {
                innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.conditionals.site_behavior.the_subscriber');
              }
              innerHtml += '<strong class="selected">' + $translate.instant(conditional.domain.visitedPage ? 'automation_editor.components.condition.conditionals.site_behavior.visited' : 'automation_editor.components.condition.conditionals.site_behavior.no_visited') + '</strong>' + $translate.instant('automation_editor.components.condition.conditionals.site_behavior.separator');
              innerHtml += '<span class="h-break-word link--default">' + conditional.domain.url + '</span>';
              if(conditional.domain.urlParam && conditional.domain.urlParam.length > 0) {
                innerHtml += '&nbsp;' + $translate.instant('automation_editor.components.initial_condition.site_behavior.canvas.with_param');
                innerHtml +='&nbsp;<strong>'+ conditional.domain.urlParam +'</strong>';
              }
              innerHtml += conditional.domain.visitedTimes > 1 && conditional.domain.visitedPage ? $translate.instant('automation_editor.components.condition.conditionals.site_behavior.at_least') + ' ' + conditional.domain.visitedTimes : '';
              innerHtml += ' ' + $translate.instant(conditional.domain.visitedTimes > 1 && conditional.domain.visitedPage ? 'automation_editor.components.condition.conditionals.site_behavior.more_times' : '');
              innerHtml += '</span>';
            }

            index++;
            // if the next item isn't the last one then the operator must be added
            if (index <= scope.component.conditionals.length - 1) {
              innerHtml += '<span class="operator">' + $translate.instant('automation_editor.components.condition.canvas_description.operator_' + scope.component.operator) + '</span>';
            }
            // If there are more items but the MAX_ITEMS_TO_SHOW has already been reached then the ellipsis must be added
            if (index < scope.component.conditionals.length && index === MAX_ITEMS_TO_SHOW) {
              innerHtml += '<span>&nbsp;&hellip;</span>';
              truncated = true;
            }
          }
        }

        return innerHtml;
      };

      scope.getDelaySummary = function() {
        var innerHtml = '<span class="icon-sandclock"></span>';

        innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.canvas_description.verification_after') + '</span>';
        if (scope.component.time) {
          innerHtml += '<span>' + scope.component.time;
          if (parseInt(scope.component.time) === 1) {
            innerHtml += $translate.instant('automation_editor.components.condition.canvas_description.singular_' + scope.component.timeUnit);
          } else {
            innerHtml += $translate.instant('automation_editor.components.condition.canvas_description.plural_' + scope.component.timeUnit);
          }
          innerHtml += '</span>';
        } else {
          innerHtml += '<span class="delay-brackets">&#91;&#91;&#91;&hellip;&#93;&#93;&#93;</span>';
          innerHtml += '<span>' + $translate.instant('automation_editor.components.condition.canvas_description.verification_time') + '</span>';
        }

        return innerHtml;
      };

      scope.removeAndTransferChildren = function() {
        if (scope.component.positiveSiblings.length > 0 && scope.component.negativeSiblings.length > 0) {
          return;
        }
        if (scope.component.positiveSiblings.length === 0 && scope.component.negativeSiblings.length === 0) {
          removeConditionalReferences();
          scope.$parent.removeComponent(scope.component);
          return;
        }

        var childrenToTransfer;
        var conditionIndex = automation.getComponentIndex(scope.component, scope.component.parentUid, scope.branch);
        var parentUids = {
          new: scope.component.parentUid,
          old: scope.component.uid
        };
        var branch = {
          origin: null,
          destiny: scope.branch
        };

        if (scope.component.positiveSiblings.length) {
          branch.origin = CONDITION_BRANCH.POSITIVE;
          childrenToTransfer = scope.component.getChildrenToTransfer(0, CONDITION_BRANCH.POSITIVE);
        } else {
          branch.origin = CONDITION_BRANCH.NEGATIVE;
          childrenToTransfer = scope.component.getChildrenToTransfer(0, CONDITION_BRANCH.NEGATIVE);
        }

        // remove all lines and, after to transfer all the condition children, regenerate them.
        goToService.removeAllGotoLinesButSavingComponentsRegistration();

        automation.transferChildren(parentUids, childrenToTransfer, conditionIndex, branch);
        removeConditionalReferences();
        automation.deleteComponent(scope.component, scope.branch);

        changesManager.add({
          type: CHANGE_TYPE.DELETE_CONDITION_AND_TRANSFER,
          branch: branch,
          children: childrenToTransfer,
          component: scope.component,
          index: conditionIndex,
          parentUids: parentUids
        });

        // this is in charge to regenerate the lines previously removed.
        scope.$emit('ALTERING_CONDITION_FINISHED');
      };

      function removeConditionalReferences() {
        _.each(scope.component.conditionals, function(conditional) {
          conditionsDataservice.removeConditionalReference(conditional);
        });
      }

      function isFirstConditional(type, uid) {
        var conditionalsByType = _.filter(scope.component.conditionals, function(conditional) {
          return conditional.type === type;
        });
        return conditionalsByType[0].uid === uid;
      }

      function formatDate(date) {
        return '<span>&quot;' + moment(date).format($translate.instant('automation_editor.date_format').toUpperCase()) + '&quot;</span>';
      }

      function isOnGotoSelection() {
        if (automation.isReadOnly()) {
          return false;
        }

        var previousSelectedComponent = selectedElementsService.getSelectedComponent();

        // the previous one was a "goto"
        return previousSelectedComponent && previousSelectedComponent.type === COMPONENT_TYPE.GOTO_STEP;
      }

      function processGotoSelection() {
        var previousSelectedComponent = selectedElementsService.getSelectedComponent();

        if (isOnGotoSelection() && previousSelectedComponent && scope.component) {
          // create line and the assign
          var newLine = goToService.drawGoToLineBetweenComponents({
            sourceComponentUid: previousSelectedComponent.uid,
            targetComponentUid: scope.component.uid,
            applyGotoSelectionStyle: true,
          });

          goToService.removeGotoLine(previousSelectedComponent.uid);

          previousSelectedComponent.line = newLine;
          previousSelectedComponent.goto = scope.component.uid;
          goToService.addGotoLine(previousSelectedComponent.uid, previousSelectedComponent);
        }
      }

      function isComponentAvailableToBeConnected(currentComponentUi) {
        var gotoComponent = selectedElementsService.getSelectedComponent();
        if (!gotoComponent || !gotoComponent.gotoComponentsAvailables) {
          return false;
        }

        for (var i = 0; i < gotoComponent.gotoComponentsAvailables.length; i++) {
          var component = gotoComponent.gotoComponentsAvailables[i].component;
          if (component && component.uid == currentComponentUi) {
            return true;
          }
        }

        return false;
      }

      scope.onMouseEnterOverComponent = function () {
        if (isOnGotoSelection() && isComponentAvailableToBeConnected(scope.component && scope.component.uid)) {
          goToService.markComponentInGotoSelection(scope.component && scope.component.uid, true, ['goto-possible-connection']);
        }
      }

      scope.onMouseLeaveOverComponent = function () {
        if (isOnGotoSelection() && isComponentAvailableToBeConnected(scope.component && scope.component.uid)) {
          goToService.markComponentInGotoSelection(scope.component && scope.component.uid, false, ['goto-possible-connection']);
        }
      }

      scope.onClickComponent = function ($event) {
        if (isOnGotoSelection()) {
          if (isComponentAvailableToBeConnected(scope.component && scope.component.uid)) {
            goToService.unmarkAllComponentsInGotoSelection(['goto-connected']);

            processGotoSelection();

            // identify components ids to mark like connected
            var idsToMarkInSelection = [];
            idsToMarkInSelection.push(scope.component && scope.component.uid);
            var previousSelectedComponent = selectedElementsService.getSelectedComponent();
            idsToMarkInSelection.push(previousSelectedComponent && previousSelectedComponent.uid);

            goToService.markComponentsInGotoSelection(idsToMarkInSelection, true, ['goto-connected']);
          }
          $event.stopPropagation();
        }
      }
    }
  }
})();
