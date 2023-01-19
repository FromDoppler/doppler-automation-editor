(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelCondition', dpEditorPanelCondition);

  dpEditorPanelCondition.$inject = [
    '$rootScope',
    '$timeout',
    '$translate',
    'automation',
    'CHANGE_TYPE',
    'changesManager',
    'COMPONENT_TYPE',
    'CONDITION_OPERATOR',
    'CONDITIONAL_EVENT',
    'CONDITIONAL_TYPE',
    'conditionsDataservice',
    'DUPLICATE_STATE',
    'emailLinksDataservice',
    'FIELD_TYPE',
    'FORMAT_TYPE',
    'LIST_SELECTION_STATE',
    'MAX_DAYS_VERIFICATION',
    'MAX_HOURS_VERIFICATION',
    'optionsListDataservice',
    'selectedElementsService',
    'settingsService',
    'TIME_UNIT',
    'userFieldsDataservice',
    'utils',
    'warningsStepsService',
    'DOMAIN_STATUS',
    'MAX_MINUTES_VERIFICATION',
    'MAX_WEEKS_VERIFICATION',
    'AUTOMATION_TYPE'
  ];

  function dpEditorPanelCondition($rootScope, $timeout, $translate, automation, CHANGE_TYPE, changesManager,
    COMPONENT_TYPE, CONDITION_OPERATOR, CONDITIONAL_EVENT, CONDITIONAL_TYPE, conditionsDataservice, DUPLICATE_STATE,
    emailLinksDataservice, FIELD_TYPE, FORMAT_TYPE, LIST_SELECTION_STATE, MAX_DAYS_VERIFICATION, MAX_HOURS_VERIFICATION,
    optionsListDataservice, selectedElementsService, settingsService, TIME_UNIT, userFieldsDataservice, utils,
    warningsStepsService, DOMAIN_STATUS, MAX_MINUTES_VERIFICATION, MAX_WEEKS_VERIFICATION, AUTOMATION_TYPE) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/dp-editor-panel-condition.html',
      link: link
    };

    return directive;

    function link(scope) {
      var watchesCollection = [];
      var automationType = automation.getModel().automationType;
      scope.CONDITION_OPERATOR = CONDITION_OPERATOR;
      scope.CONDITIONAL_EVENT = CONDITIONAL_EVENT;
      scope.CONDITIONAL_TYPE = CONDITIONAL_TYPE;
      scope.DUPLICATE_STATE = DUPLICATE_STATE;
      scope.FIELD_TYPE = FIELD_TYPE;
      scope.FORMAT_TYPE = FORMAT_TYPE;
      scope.REGEX_NUMBER = utils.REGEX_NUMBER;
      scope.TIME_UNIT = TIME_UNIT;
      scope.showAddConditionalDropdown = false;
      scope.conditionPlaceholder = $translate.instant('automation_editor.components.condition.conditionals.placeholder');
      scope.comparisonOperators = optionsListDataservice.getComparisonOperators();
      scope.conditionalOptions = optionsListDataservice.getConditionalOptions();

      if (automationType === AUTOMATION_TYPE.PUSH_NOTIFICATION) {
        scope.conditionalOptions = updateOptionsOnPushNotificationAutomationType();
      }
      scope.campaignBehaviorEvents = optionsListDataservice.getCampaignBehaviorEvents();
      scope.genderFieldOptions = optionsListDataservice.getGenderFieldOptions();
      scope.listMembershipEvents = optionsListDataservice.getListMembershipEvents();
      scope.textFieldCriteria = optionsListDataservice.getTextFieldCriteria();
      scope.booleanOptions = optionsListDataservice.getBooleanOptions();
      scope.consentOptions = optionsListDataservice.getConsentOptions();
      scope.permissionOptions = optionsListDataservice.getBooleanOptions();
      scope.timeUnitOptions = getTimeUnitOptions();
      selectedElementsService.unsetSelectedConditional();
      scope.visitedTimes = optionsListDataservice.getVisitedTimesOptions();
      scope.setSelectedConditional = selectedElementsService.setSelectedConditional;
      scope.isReadOnly = automation.isReadOnly;
      scope.getReadOnlyLabel = automation.getReadOnlyLabel;
      var isVisibleSiteBehaviorCondition = false;
      // get all basic and custom user fields
      scope.userFields = userFieldsDataservice.getAllFields();
      scope.abandonedCartInformationDefaultFields = optionsListDataservice.getAbandonedCartInformationDefaultFields();
      // get all countries list
      automation.getCountries().then(function(countries) {
        scope.countries = countries;
      });
      automation.getScores().then(function(scores) {
        scope.scoreOptions = scores;
      });
      automation.getOrigins().then(function(origins) {
        scope.originOptions = origins;
      });
      settingsService.getSettings().then(function(response) {
        scope.defaultISODate = response.defaultISODate;
        scope.domains = response.domains;
      });

      automation.getSiteBehaviorStatus().then(function(status) {
        if (status === 'active') {
          isVisibleSiteBehaviorCondition = true;
        } else {
          scope.siteBehaviorStatus = status;
        }
      });
      // date picker variables
      scope.datePickerPopup = {
        value: new Date(),
        visible: false
      };
      scope.format = $translate.instant('automation_editor.date_format');
      scope.datePickerOptions = {
        showWeeks: false,
        dateDisabled: false,
        formatYear: 'yyyy',
        maxDate: new Date(2037, 11, 31),
        minDate: new Date(1907, 0, 1),
        startingDay: 1
      };

      scope.$watch(selectedElementsService.getSelectedComponent, function(newSelectedComponent) {
        destroyWatches();
        if (newSelectedComponent && newSelectedComponent.type === COMPONENT_TYPE.CONDITION) {
          loadEmailsAndLinks();
        }
        scope.selectedConditional = null;
      });

      scope.$watch(selectedElementsService.getSelectedConditional, function(newConditional, oldConditional) {
        if (watchesCollection.length && newConditional !== oldConditional) {
          destroyWatches();
        }
        if (newConditional) {
          scope.selectedConditional = newConditional;
          scope.toggleAddConditionalDropdown(false);
          createConditionalWatches();
          resetLinksForSelectedEmail();
          filterCampaignBehaviorEvents();
        } else {
          scope.selectedConditional = null;
        }
      });

      scope.$watch('datePickerPopup.visible', function(newValue, oldValue) {
        if (newValue !== oldValue && !newValue) {
          if (scope.datePickerPopup.value) {
            scope.selectedConditional.field.date = scope.datePickerPopup.value.toISOString().substring(0, 10);
          }
          scope.datePickerPopup.value = moment(scope.selectedConditional.field.date).toDate();
        }
      });

      scope.$watch('selectedConditional.field.date', function(newValue) {
        if (newValue) {
          scope.datePickerPopup.value = moment(scope.selectedConditional.field.date).toDate();
        }
      });

      function updateOptionsOnPushNotificationAutomationType() {
        return [
          {
              label: $translate.instant('automation_editor.components.condition.conditionals.site_behavior.label'),
              value: "site_behavior"
          }
        ];
      }
      function loadEmailsAndLinks() {
        if (!changesManager.getUnsavedChanges()) {
          scope.emailComponentsToBind = automation.getEmailComponentsToBind(scope.selectedComponent);
          scope.linksByEmail = emailLinksDataservice.getLinksByEmail();
          return;
        }
        //we need to save changes to update the id for new Email components
        automation.saveChanges().then(function() {
          $rootScope.$broadcast('UPDATE_SAVING_STATE');
          scope.emailComponentsToBind = automation.getEmailComponentsToBind(scope.selectedComponent);
          scope.linksByEmail = emailLinksDataservice.getLinksByEmail();
        });
      }

      function getTimeUnitOptions() {
        // Verification time we are going to show every option.
        return optionsListDataservice.getTimeUnitOptions();
      }

      function createConditionalWatches() {
        var propertiesToWatch = scope.selectedConditional.getPropertiesToWatch();
        _.each(propertiesToWatch, function(property) {
          var watch = scope.$watch(function() {
            return _.get(scope.selectedConditional, property);
          }, function(newValue, oldValue) {
            if (newValue === oldValue || changesManager.isChanging() || !changesManager.isEnabled()) {
              return;
            }

            changesManager.add({
              type: CHANGE_TYPE.CONDITIONAL_PROPERTY,
              conditionUid: scope.selectedComponent.uid,
              conditionalIndex: scope.selectedComponent.getConditionalIndex(scope.selectedConditional),
              key: property,
              oldValue: angular.copy(oldValue),
              newValue: angular.copy(newValue)
            });
            //update the duplicates of the selected conditional
            conditionsDataservice.updateDuplicatesOfConditional(scope.selectedConditional.uid);
            checkFlowStatus();
            //check if the selected conditional is a duplicate of another conditional
            conditionsDataservice.checkDuplicateConditionals(scope.selectedConditional.uid);
          }, true);
          watchesCollection.push(watch);
        });
      }

      scope.onConditionalSelected = function(rawConditionalData, oldConditional, index) {
        var newIndex;
        var newConditional;

        if (oldConditional && oldConditional.type === rawConditionalData.value) {
          return;
        }
        scope.toggleAddConditionalDropdown(false);
        newConditional = automation.createConditional(getDefaultConditionalData(rawConditionalData));
        scope.selectedComponent.addConditional(newConditional, oldConditional, index);

        changesManager.add({
          type: CHANGE_TYPE.ADD_CONDITIONAL,
          conditionUid: scope.selectedComponent.uid,
          newConditional: newConditional,
          oldConditional: oldConditional,
          index: index
        });

        newIndex = index >= 0 ? index : scope.selectedComponent.conditionals.length - 1;
        selectedElementsService.setSelectedConditional(scope.selectedComponent.conditionals[newIndex]);
        checkFlowStatus();
      };

      scope.removeConditional = function(conditional) {
        var index = scope.selectedComponent.getConditionalIndex(conditional);
        //update the duplicates of the selected conditional
        conditionsDataservice.updateDuplicatesOfConditional(conditional.uid);
        scope.selectedComponent.removeConditional(conditional);

        changesManager.add({
          type: CHANGE_TYPE.DELETE_CONDITIONAL,
          conditionUid: scope.selectedComponent.uid,
          conditional: conditional,
          index: index
        });

        $timeout(function() {
          selectedElementsService.unsetSelectedConditional();
          checkFlowStatus();
        });
      };

      scope.onConditionAttributeSelected = function(key, value) {
        utils.assign(scope.selectedComponent, key, value);
      };

      scope.onConditionalAttributeSelected = function(key, value) {
        utils.assign(scope.selectedConditional, key, value);
      };

      scope.onEmailSelected = function(newEmailData, oldEmail) {
        if (oldEmail.idEmail !== newEmailData.idEmail) {
          scope.selectedConditional.setData({
            email: newEmailData,
            link: {
              idLink: 0,
              url: ''
            }
          });
          resetLinksForSelectedEmail();
          filterCampaignBehaviorEvents();
        }
      };

      scope.onCampaignBehaviorEventSelected = function(eventValue) {
        if (scope.selectedConditional.event !== eventValue) {
          scope.selectedConditional.setData({
            event: eventValue,
            link: {
              idLink: 0,
              url: ''
            }
          });
        }
      };

      scope.onSubscriberFieldSelected = function(rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        if (rawFieldData.type === FIELD_TYPE.DATE) {
          rawFieldData.date = scope.defaultISODate.substring(0, 10);
        }
        scope.selectedConditional.setData({
          field: rawFieldData
        });
      };

      scope.onAbandonedCartFieldSelected = function (rawFieldData, oldField) {
        if (oldField && oldField.name === rawFieldData.name) {
          return;
        }
        if (rawFieldData.type === FIELD_TYPE.DATE) {
          rawFieldData.date = scope.defaultISODate.substring(0, 10);
        }
        scope.selectedConditional.setData({
          field: rawFieldData
        });
      };
      

      scope.onConditionalCountrySelected = function(country) {
        var data = {
          country: {
            id: country.id,
            name: country.name
          }
        };
        scope.selectedConditional.field.setData(data);
      };

      scope.onConditionalScoreSelected = function(score) {
        var data = {
          score: {
            id: score.id,
            name: score.name
          }
        };
        scope.selectedConditional.field.setData(data);
      };

      scope.onConditionalOriginSelected = function(origin) {
        var data = {
          origin: {
            id: origin.id,
            name: origin.name
          }
        };
        scope.selectedConditional.field.setData(data);
      };

      scope.onTimeUnitSelected = function(value) {
        var time = parseInt(scope.selectedComponent.time);

        scope.onConditionAttributeSelected('timeUnit', value);
        if ((scope.selectedComponent.timeUnit === TIME_UNIT.HOURS && (time < 1 || time > MAX_HOURS_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.DAYS && (time < 1 || time > MAX_DAYS_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.MINUTES && (time < 5 || time > MAX_MINUTES_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.WEEKS && (time < 1 || time > MAX_WEEKS_VERIFICATION))) {
          scope.verificationTimeForm.time.$setValidity('pattern', false);
        } else {
          scope.verificationTimeForm.time.$setValidity('pattern', true);
        }
      };

      scope.formatDate = function(date) {
        return '&quot;' + moment(date).format(scope.format.toUpperCase()) + '&quot;';
      };

      scope.toggleAddConditionalDropdown = function(value) {
        scope.showAddConditionalDropdown = value;
      };

      scope.toggleOperator = function() {
        var operator = scope.selectedComponent.operator === CONDITION_OPERATOR.AND ?
          CONDITION_OPERATOR.OR :
          CONDITION_OPERATOR.AND;
        utils.assign(scope.selectedComponent, 'operator', operator);
      };

      scope.showListSelectionSimple = function() {
        var title = $translate.instant('automation_editor.components.condition.conditionals.list_membership.list_selection.title');
        var subtitle = $translate.instant('automation_editor.components.condition.conditionals.list_membership.list_selection.subtitle');
        scope.toggleListSelection(LIST_SELECTION_STATE.SIMPLE, title, subtitle);
      };

      scope.showVerificationTimeForm = function() {

        return !!(scope.selectedComponent && _.find(scope.selectedComponent.conditionals, function(conditional) {

          return conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR
          || conditional.type === CONDITIONAL_TYPE.SITE_BEHAVIOR;

        }));

      };

      scope.verificationTimePattern = (function() {
        return {
          test: function(time) {
            var formattedTime = parseFloat(time);
            var isValid = Number.isInteger(formattedTime);

            if (isValid) {
              if (scope.selectedComponent.timeUnit === TIME_UNIT.HOURS
                && (formattedTime < 1 || formattedTime > MAX_HOURS_VERIFICATION)) {
                isValid = false;
              }
              if (scope.selectedComponent.timeUnit === TIME_UNIT.DAYS
                && (formattedTime < 1 || formattedTime > MAX_DAYS_VERIFICATION)) {
                isValid = false;
              }
              if (scope.selectedComponent.timeUnit === TIME_UNIT.MINUTES
                && (formattedTime < 5 || formattedTime > MAX_MINUTES_VERIFICATION)) {
                isValid = false;
              }
              if (scope.selectedComponent.timeUnit === TIME_UNIT.WEEKS
                && (formattedTime < 1 || formattedTime > MAX_WEEKS_VERIFICATION)) {
                isValid = false;
              }
            }

            return isValid;
          }
        };
      })();

      scope.showErrorFor = function(propertyElement) {
        var showError = false;

        switch (propertyElement) {
        case 'campaign_behavior_emails':
          if (scope.selectedConditional.email.uidEmail === 0) {
            showError = true;
          }
          break;

        case 'campaign_behavior_events':
          if ((scope.selectedConditional.event === CONDITIONAL_EVENT.ANY_LINK_CLICKED
            || scope.selectedConditional.event === CONDITIONAL_EVENT.NO_LINK_CLICKED)
            && (!scope.linksByEmail[scope.selectedConditional.email.uidEmail]
            || !scope.linksByEmail[scope.selectedConditional.email.uidEmail].length)) {
            showError = true;
          } else if ((scope.selectedConditional.event !== CONDITIONAL_EVENT.LINK_CLICKED
              || scope.selectedConditional.event !== CONDITIONAL_EVENT.LINK_NOT_CLICKED)
              && scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
              && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          } else if (!scope.selectedConditional.event.length) {
            showError = true;
          }
          break;

        case 'campaign_behavior_links':
          if ((scope.selectedConditional.event === CONDITIONAL_EVENT.LINK_CLICKED
            || scope.selectedConditional.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED)
            && scope.selectedConditional.link.idLink === -1) {
            showError = true;
          } else if (scope.selectedConditional.link.idLink === 0) {
            showError = true;
          }
          break;

        case 'subscriber_information_fields':
          if (!scope.selectedConditional.field || scope.selectedConditional.field.deleted) {
            showError = true;
          }
          break;

        case 'subscriber_information_criteria':
          if (!scope.selectedConditional.field.criteria.length) {
            showError = true;
          }
          break;

        case 'subscriber_information_gender':
          if (!scope.selectedConditional.field.gender.length) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_score':
          if (scope.selectedConditional.field.score.id === null) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_origin':
          if (scope.selectedConditional.field.origin.id === null) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_country':
          if (scope.selectedConditional.field.country.id === 0) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_boolean':
          if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_value':
          if (scope.selectedConditional.field.value && !scope.selectedConditional.field.value.length) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'subscriber_information_date_value':
          if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
          break;

        case 'abandoned_cart_information_fields':
          if (!scope.selectedConditional.field || scope.selectedConditional.field.deleted) {
            showError = true;
          }
          break;

        case 'abandoned_cart_information_fields_boolean':
        if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
          && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
          showError = true;
        }
        break;

        case 'abandoned_cart_information_date':
          if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
        break;

        case 'abandoned_cart_information_value':
          if (scope.selectedConditional.field.value && !scope.selectedConditional.field.value.length) {
            showError = true;
          } else if (scope.selectedConditional.duplicate !== DUPLICATE_STATE.ORIGIN
            && scope.selectedConditional.duplicate !== DUPLICATE_STATE.FALSE) {
            showError = true;
          }
        break;

        case 'abandoned_cart_information_criteria':
          if (!scope.selectedConditional.field.criteria.length) {
            showError = true;
          }
          break;

        default:
          throw new Error('Property with unknown key cannot be parsed.');
        }

        return showError;
      };

      function resetLinksForSelectedEmail() {
        var linksInUse = [];
        var conditionalsWithLinks;
        scope.selectedEmailLinks = [];

        if (!scope.selectedConditional.email || scope.selectedConditional.email.uidEmail === 0
          || scope.selectedConditional.type !== CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR) {
          return;
        }
        conditionalsWithLinks = _.filter(scope.selectedComponent.conditionals, function(conditional) {
          return conditional.type === CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR
            && (conditional.event === CONDITIONAL_EVENT.LINK_CLICKED
              || conditional.event === CONDITIONAL_EVENT.LINK_NOT_CLICKED)
            && conditional.link.idLink !== 0 && conditional.uid !== scope.selectedConditional.uid;
        });
        _.each(conditionalsWithLinks, function(conditional) {
          linksInUse.push(conditional.link);
        });

        scope.selectedEmailLinks = scope.linksByEmail[scope.selectedConditional.email.uidEmail];

        if (linksInUse.length) {
          _.each(linksInUse, function(linkInUse) {
            scope.selectedEmailLinks = _.without(scope.selectedEmailLinks,
              _.find(scope.selectedEmailLinks, function(link) {
                return link.idLink === linkInUse.idLink;
              }));
          });
        }
      }

      function filterCampaignBehaviorEvents() {
        scope.campaignBehaviorEvents = optionsListDataservice.getCampaignBehaviorEvents();
        var automationType = automation.getModel().automationType;
        if (automationType === AUTOMATION_TYPE.ABANDONED_CART
          || automationType === AUTOMATION_TYPE.VISITED_PRODUCTS
          || automationType === AUTOMATION_TYPE.PENDING_ORDER) {
          if (scope.selectedConditional.email) {
            automation.hasDynamicElement(scope.selectedConditional.email.idEmail).then(function(result) {
              if (!result) {
                scope.campaignBehaviorEvents = _.filter(scope.campaignBehaviorEvents, function(event) {
                  return event.value !== CONDITIONAL_EVENT.ANY_DYNAMIC_LINK_CLICKED
                    && event.value !== CONDITIONAL_EVENT.NO_DYNAMIC_LINK_CLICKED;
                });
              }
            });
          }
        } else {
          scope.campaignBehaviorEvents = _.filter(scope.campaignBehaviorEvents, function(event) {
            return event.value !== CONDITIONAL_EVENT.ANY_DYNAMIC_LINK_CLICKED
              && event.value !== CONDITIONAL_EVENT.NO_DYNAMIC_LINK_CLICKED;
          });
        }
      }

      function getDefaultConditionalData(rawConditionalData) {
        var defaultData = {};

        switch (rawConditionalData.value) {
        case CONDITIONAL_TYPE.CAMPAIGN_BEHAVIOR:
          defaultData.type = rawConditionalData.value;
          if (scope.emailComponentsToBind[0]) {
            defaultData.email = scope.emailComponentsToBind[0];
          }
          break;
        case CONDITIONAL_TYPE.LIST_MEMBERSHIP:
          defaultData.type = rawConditionalData.value;
          defaultData.event = scope.listMembershipEvents[0].value;
          break;
        case CONDITIONAL_TYPE.SUBSCRIBER_INFORMATION:
          defaultData.type = rawConditionalData.value;
          break;
        case CONDITIONAL_TYPE.SITE_BEHAVIOR:
          defaultData.type = rawConditionalData.value;
          defaultData.event = CONDITIONAL_EVENT.VISITED;
            break;
        case CONDITIONAL_TYPE.ABANDONED_CART_INFORMATION:
          defaultData.type = rawConditionalData.value;
          break;
        default:
          throw new Error('Conditional with unknown type cannot be parsed.');
        }

        return defaultData;
      }

      function checkFlowStatus() {
        scope.selectedComponent.checkCompleted();
        automation.checkCompleted();
        warningsStepsService.checkWarningStep(scope.selectedComponent);
      }

      function destroyWatches() {
        _.each(watchesCollection, function(deregisterWatch) {
          deregisterWatch();
        });
        watchesCollection = [];
      }

      scope.validateUrlDomain = function(conditional, index) {
        scope.domainRegistrationError = false;
        scope.domainVerifiedError = false;
        scope.urlHasParameters = false;

        var newDomain = domainValidator(conditional);
        if (!newDomain) {
          scope.domainRegistrationError = true;
        } else if (newDomain.Status !== DOMAIN_STATUS.VERIFIED) {
          scope.domainVerifiedError = true;
        }
        if (!!conditional.url && conditional.url.indexOf('?') > -1) {
          scope.urlHasParameters = true;
        }

        if (scope.domainRegistrationError || scope.domainVerifiedError || scope.urlHasParameters) {
          scope.selectedConditional.siteBehaviorForm['url' + index].$setValidity('domain', false);
          return false;
        }

        if (!scope.selectedConditional.siteBehaviorForm['url' + index].$valid) {
          scope.selectedConditional.siteBehaviorForm['url' + index].$setValidity('domain', true);
        }

      };

      function domainValidator(conditional) {
        var existDomain;

        if (conditional.url && conditional.url.length) {
          existDomain = _.find(scope.domains, function(domain) {
            var cleanUrl = conditional.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
            var cleanDomain = domain.Domain.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
            return cleanUrl === cleanDomain;
          });

          if (!existDomain) {
            conditional.idDomain = 0;
          } else if (conditional.idDomain !== existDomain.IdDomain) {
            conditional.idDomain = existDomain.IdDomain;
            conditional.status = existDomain.Status;
          }
        }

        return conditional.idDomain ? existDomain : false;
      }

      scope.onDomainBlur = function(event, domain) {
        // Remove http/https
        if (domain.url) {
          var cleanUrl = domain.url.replace(/^(?:https?:\/\/)?/i, '');
          domain.url = cleanUrl;
        }
      };

      scope.onVisitedPageSelected = function(value, domain, field) {
        domain[field] = value;
        if (field === 'visitedPage') {
          scope.selectedConditional.event = value ? CONDITIONAL_EVENT.VISITED : CONDITIONAL_EVENT.NO_VISITED;
        }
      };

      scope.canUseSiteBehaviorCondition = function() {
        return isVisibleSiteBehaviorCondition;
      };
    }
  }
})();
