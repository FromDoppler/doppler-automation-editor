(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive(
      'dpEditorPanelSiteBehaviorCondition',
      dpEditorPanelSiteBehaviorCondition
    );

  dpEditorPanelSiteBehaviorCondition.$inject = [
    'selectedElementsService',
    'settingsService',
    '$translate',
    'optionsListDataservice',
    'DOMAIN_STATUS',
    'automation',
    'MAX_DAYS_VERIFICATION',
    'MAX_HOURS_VERIFICATION',
    'MAX_MINUTES_VERIFICATION',
    'MAX_WEEKS_VERIFICATION',
    'utils',
    'TIME_UNIT',
    'CONDITION_OPERATOR',
  ];

  function dpEditorPanelSiteBehaviorCondition(
    selectedElementsService,
    settingsService,
    $translate,
    optionsListDataservice,
    DOMAIN_STATUS,
    automation,
    MAX_DAYS_VERIFICATION,
    MAX_HOURS_VERIFICATION,
    MAX_MINUTES_VERIFICATION,
    MAX_WEEKS_VERIFICATION,
    utils,
    TIME_UNIT,
    CONDITION_OPERATOR
  ) {
    var directive = {
      restrict: 'AE',
      templateUrl:
        'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-site-behavior-condition.html',
      link: link,
    };

    return directive;

    function link(scope, element) {
      scope.isReadOnly = automation.isReadOnly;
      scope.selectedComponent = selectedElementsService.getSelectedComponent();
      scope.DOMAIN_STATUS = DOMAIN_STATUS;
      scope.timeUnitOptions = getTimeUnitOptions();
      scope.timesBackAutomation =
        optionsListDataservice.getTimesBackAutomationOptions();
      scope.booleanOptions = optionsListDataservice.getBooleanOptions();
      scope.visitedTimes = optionsListDataservice.getVisitedTimesOptions();
      scope.CONDITION_OPERATOR = CONDITION_OPERATOR;
      scope.TIME_UNIT = TIME_UNIT;
      scope.selectedIndex;

      if (scope.selectedComponent.domains.length === 0) {
        createDomain();
      }

      scope.verifyIfDuplicated = function (domain, index) {
        var lengthSameDomainWithRecent = scope.selectedComponent.domains.filter(
          function (ele) {
            return ele.url === domain.url;
          }
        ).length;
        if (lengthSameDomainWithRecent > 1) {
          scope.siteBehaviorForm['url' + index].$setValidity(
            'duplicated',
            false
          );
        } else {
          scope.siteBehaviorForm['url' + index].$setValidity(
            'duplicated',
            true
          );
        }
      };

      scope.checkDuplicates = function () {
        var testObject = {},
          index = 0;

        scope.selectedComponent.domains.map(function (item) {
          var itemPropertyName = item['url'];
          if (itemPropertyName in testObject) {
            scope.siteBehaviorForm['url' + index].$setValidity(
              'duplicated',
              false
            );
          } else {
            testObject[itemPropertyName] = item;
          }
          index += 1;
        });
      };

      element.ready(function () {
        scope.checkDuplicates();
      });

      settingsService.getSettings().then(function (response) {
        scope.domains = response.domains;

        scope.validateUrlDomain = function (domain, index) {
          scope.domainRegistrationError = false;
          scope.domainVerifiedError = false;
          scope.urlHasParameters = false;

          var newDomain = domainValidator(
            scope.siteBehaviorForm['url' + index].$viewValue,
            index
          );
          if (!newDomain) {
            scope.domainRegistrationError = true;
          } else if (newDomain.Status !== DOMAIN_STATUS.VERIFIED) {
            scope.domainVerifiedError = true;
          }
          if (!!domain.url && domain.url.indexOf('?') > -1) {
            scope.urlHasParameters = true;
          }

          if (
            scope.domainRegistrationError ||
            scope.domainVerifiedError ||
            scope.urlHasParameters
          ) {
            scope.siteBehaviorForm['url' + index].$setValidity('domain', false);
            return false;
          }

          if (!scope.siteBehaviorForm['url' + index].$valid) {
            scope.siteBehaviorForm['url' + index].$setValidity('domain', true);
          }
        };
      });

      if (
        scope.selectedComponent.domains.length &&
        scope.selectedComponent.domains[0].url
      ) {
        scope.showErrors = true;
      }

      scope.onDomainBlur = function (event, domain) {
        // Remove http/https
        scope.showErrors = true;
        if (domain.url) {
          var cleanUrl = domain.url.replace(/^(?:https?:\/\/)?/i, '');
          domain.url = cleanUrl;
        }
      };

      scope.verificationTimePattern = (function () {
        return {
          test: function (time) {
            var formattedTime = parseFloat(time);
            var isValid = Number.isInteger(formattedTime);

            if (isValid) {
              if (
                scope.selectedComponent.timeUnit === TIME_UNIT.HOURS &&
                (formattedTime < 1 || formattedTime > MAX_HOURS_VERIFICATION)
              ) {
                isValid = false;
              }
              if (
                scope.selectedComponent.timeUnit === TIME_UNIT.DAYS &&
                (formattedTime < 1 || formattedTime > MAX_DAYS_VERIFICATION)
              ) {
                isValid = false;
              }
              if (
                scope.selectedComponent.timeUnit === TIME_UNIT.MINUTES &&
                (formattedTime < 5 || formattedTime > MAX_MINUTES_VERIFICATION)
              ) {
                isValid = false;
              }
              if (
                scope.selectedComponent.timeUnit === TIME_UNIT.WEEKS &&
                (formattedTime < 1 || formattedTime > MAX_WEEKS_VERIFICATION)
              ) {
                isValid = false;
              }
            }

            return isValid;
          },
        };
      })();

      function domainValidator(url, index) {
        var existDomain;

        if (url && url.length) {
          existDomain = _.find(scope.domains, function (domain) {
            var cleanUrl = url
              .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
              .split('/')[0];
            var cleanDomain = domain.Domain.replace(
              /^(?:https?:\/\/)?(?:www\.)?/i,
              ''
            ).split('/')[0];
            return cleanUrl === cleanDomain;
          });

          if (!existDomain) {
            scope.selectedComponent.domains[index].idDomain = 0;
          } else if (
            scope.selectedComponent.domains[index].idDomain !==
            existDomain.IdDomain
          ) {
            scope.selectedComponent.domains[index].idDomain =
              existDomain.IdDomain;
            scope.selectedComponent.domains[index].status = existDomain.Status;
          }
        }

        return scope.selectedComponent.domains[index].idDomain
          ? existDomain
          : false;
      }

      scope.onTimesBackChange = function (option) {
        scope.selectedComponent.setData({
          timesBackAutomation: option.value,
        });
      };

      function getTimeUnitOptions() {
        // for verification time now all the options are available
        return optionsListDataservice.getTimeUnitOptions();
      }

      function createDomain() {
        scope.selectedComponent.domains.push({
          idDomain: 0,
          url: '',
          status: DOMAIN_STATUS.PENDING,
          visitedPage: true,
          visitedTimes: 1,
        });
      }
      scope.onTimeUnitSelected = function (value) {
        var time = parseInt(scope.selectedComponent.verificationTime);

        scope.selectedComponent.timeUnit = value;
        if (
          time < 0 ||
          Number.isNaN(time) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.HOURS &&
            (time < 1 || time > MAX_HOURS_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.DAYS &&
            (time < 1 || time > MAX_DAYS_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.MINUTES &&
            (time < 5 || time > MAX_MINUTES_VERIFICATION)) ||
          (scope.selectedComponent.timeUnit === TIME_UNIT.WEEKS &&
            (time < 1 || time > MAX_WEEKS_VERIFICATION))
        ) {
          scope.siteBehaviorForm.verificationTime.$setValidity(
            'pattern',
            false
          );
        } else {
          scope.siteBehaviorForm.verificationTime.$setValidity('pattern', true);
        }
      };

      scope.toggleOperator = function () {
        var operator =
          scope.selectedComponent.operator === CONDITION_OPERATOR.AND
            ? CONDITION_OPERATOR.OR
            : CONDITION_OPERATOR.AND;
        scope.selectedComponent.operator = operator;
        setORSpecialCondition(operator);
      };

      function setORSpecialCondition(operator) {
        // Condition to only accept Yes value in OR condition
        if (CONDITION_OPERATOR.OR === operator) {
          for (var i = 0; i < scope.selectedComponent.domains.length; i++) {
            scope.selectedComponent.domains[i].visitedPage = true;
          }
        }
      }

      scope.addNewDomain = function () {
        createDomain();
      };

      scope.onVisitedPageSelected = function (value, domain, field) {
        domain[field] = value;
      };

      scope.isEnableVisitedPage = function (index) {
        return (
          index &&
          scope.selectedComponent.operator === CONDITION_OPERATOR.AND &&
          scope.selectedComponent.domains[0].visitedPage
        );
      };

      scope.isEnabledVerificationTime = function () {
        return (
          scope.selectedComponent.domains.length > 1 ||
          scope.selectedComponent.domains[0].visitedTimes > 1
        );
      };

      scope.toggleConfirmation = function (value) {
        scope.showConfirmation = value;
      };

      scope.getShowConfirmation = function () {
        return scope.showConfirmation;
      };

      scope.onDeleteComponent = function (index) {
        scope.selectedComponent.domains.splice(index, 1);
        scope.checkDuplicates();
      };

      scope.selectedItem = function (index) {
        scope.selectedIndex = index;
      };

      scope.showInitConditionMessage = function () {
        var isReplica = automation.getModel().isReplica;
        return scope.selectedComponent.completed === false && isReplica;
      };
    }
  }
})();
