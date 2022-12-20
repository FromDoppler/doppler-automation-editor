(function () {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorPanelDynamicContentCondition', dpEditorPanelDynamicContentCondition);

  dpEditorPanelDynamicContentCondition.$inject = [
    'optionsListDataservice',
    'changesManager',
    'CHANGE_TYPE',
    'DYNAMIC_CONTENT_HOURS',
    'INTEGRATION_CODES',
    '$translate',
    'AUTOMATION_TYPE',
    'automation'
  ];

  function dpEditorPanelDynamicContentCondition(optionsListDataservice, changesManager, CHANGE_TYPE,
    DYNAMIC_CONTENT_HOURS, INTEGRATION_CODES, $translate, AUTOMATION_TYPE, automation) {
    var directive = {
      restrict: 'AE',
      templateUrl: 'angularjs/partials/automation/editor/directives/panel/initialConditions/dp-editor-panel-dynamic-content-condition.html',
      link: link
    };

    return directive;

    function link(scope) {
      scope.timeUnitOptions = optionsListDataservice.getTimeUnitOptions();

      scope.productsStoreOptions = automation.getProductStoresList(scope.selectedComponent.automationType);
      scope.selectedComponent.idThirdPartyApp = scope.selectedComponent.idThirdPartyApp ||
        scope.productsStoreOptions[0].value;

      switch (scope.selectedComponent.automationType) {
        case AUTOMATION_TYPE.VISITED_PRODUCTS:
          scope.selectedComponent.eventIntervalMinutes = scope.selectedComponent.eventIntervalMinutes
            || DYNAMIC_CONTENT_HOURS.TWENTYFOUR_HOURS;
          scope.selectedComponent.eventWaitMinutes = scope.selectedComponent.eventWaitMinutes
            || DYNAMIC_CONTENT_HOURS.ONE_WEEK;
          scope.productsStoreTimeOptions = optionsListDataservice.getVisitedProductsTimeOptions();
          scope.productsStoreWaitOptions = optionsListDataservice.getVisitedProductsWaitOptions();
          scope.showDomainErrorMsg = automation.domainHaveErrors(scope.productsStoreOptions,
            scope.selectedComponent.idThirdPartyApp);
          break;
        case AUTOMATION_TYPE.ABANDONED_CART:
          scope.selectedComponent.eventIntervalMinutes = scope.selectedComponent.eventIntervalMinutes
            || DYNAMIC_CONTENT_HOURS.SIX_HOURS;
          scope.selectedComponent.eventWaitMinutes = scope.selectedComponent.eventWaitMinutes
            || DYNAMIC_CONTENT_HOURS.ZERO_HOURS;
          scope.productsStoreTimeOptions = optionsListDataservice.getAbandonedCartTimeOptions();
          scope.productsStoreWaitOptions = optionsListDataservice.getAbandonedCartWaitOptions();
          if (scope.selectedComponent.idThirdPartyApp === INTEGRATION_CODES.TIENDANUBE) {
            scope.showDomainErrorMsg = automation.domainHaveErrors(scope.productsStoreOptions,
              scope.selectedComponent.idThirdPartyApp);
          }
          break;
        case AUTOMATION_TYPE.PENDING_ORDER:          
          scope.selectedComponent.eventIntervalMinutes = scope.selectedComponent.eventIntervalMinutes
            || DYNAMIC_CONTENT_HOURS.SIX_HOURS;
          scope.selectedComponent.eventWaitMinutes = scope.selectedComponent.eventWaitMinutes
            || DYNAMIC_CONTENT_HOURS.ZERO_HOURS;
          scope.productsStoreTimeOptions = optionsListDataservice.getPendingPaymentTimeOptions();
          scope.productsStoreWaitOptions = optionsListDataservice.getAbandonedCartWaitOptions();
          break;
        case AUTOMATION_TYPE.CONFIRMATION_ORDER:
          scope.selectedComponent.eventIntervalMinutes = DYNAMIC_CONTENT_HOURS.ZERO_HOURS;
          scope.selectedComponent.eventWaitMinutes = DYNAMIC_CONTENT_HOURS.ZERO_HOURS;
          break;
        default:
          throw new Error('Invalid automationType');
      }

      scope.availableStock = scope.selectedComponent.availableStock || false;

      scope.selectedComponent.eventIntervalMinutesLabel = $translate.instant('automation_editor.sidebar.' + scope.selectedComponent.automationType + '.drop_down_time_options.option' + scope.selectedComponent.eventIntervalMinutes);

      scope.onProductStoreChange = function (option) {
        if (scope.selectedComponent.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS) {
          scope.showDomainErrorMsg = automation.domainHaveErrors(scope.productsStoreOptions, option.value);
        } else if (scope.selectedComponent.automationType === AUTOMATION_TYPE.ABANDONED_CART
          && option.value === INTEGRATION_CODES.TIENDANUBE) {
          scope.showDomainErrorMsg = automation.domainHaveErrors(scope.productsStoreOptions, option.value);
        }
        scope.selectedComponent.setData({
          idThirdPartyApp: option.value
        });
        automation.applyDropDownChange();

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'idThirdPartyApp',
          oldValue: scope.selectedComponent.idThirdPartyApp,
          newValue: option.value
        });

        automation.updateAutomationFlowState();
      };

      scope.onProductStoreTimePassedChange = function (option) {
        var newComponent = option.value;
        var newComponentLabel = option.label;

        scope.selectedComponent.setData({
          eventIntervalMinutes: option.value,
          eventIntervalMinutesLabel: $translate.instant('automation_editor.sidebar.abandoned_cart.drop_down_time_options.option' + option.value)
        });

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'eventIntervalMinutes',
          oldValue: scope.selectedComponent.eventIntervalMinutes,
          newValue: newComponent
        });

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'eventIntervalMinutesLabel',
          oldValue: scope.selectedComponent.eventIntervalMinutesLabel,
          newValue: newComponentLabel
        });
      };

      scope.onProductStoreWaitPassedChange = function (option) {
        var newComponent = option.value;

        scope.selectedComponent.setData({
          eventWaitMinutes: option.value
        });

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'eventWaitMinutes',
          oldValue: scope.selectedComponent.eventWaitMinutes,
          newValue: newComponent
        });
      };

      scope.onAvailableStockChange = function (value) {
        var newComponent = value;

        scope.selectedComponent.setData({
          availableStock: value
        });

        changesManager.add({
          type: CHANGE_TYPE.PROPERTY,
          uid: scope.selectedComponent.uid,
          key: 'availableStock',
          oldValue: scope.selectedComponent.availableStock,
          newValue: newComponent
        });
      };

      scope.showIntervalTimeControl = function () {
        return scope.selectedComponent && scope.selectedComponent.automationType != AUTOMATION_TYPE.CONFIRMATION_ORDER;
      };

      scope.showWaitControl = function () {
        return scope.selectedComponent ?
          scope.selectedComponent.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS : false;
      };

      scope.showVerificationTimeControl = function () {
        return (scope.selectedComponent.automationType === AUTOMATION_TYPE.PENDING_ORDER ||
          scope.selectedComponent.automationType === AUTOMATION_TYPE.ABANDONED_CART ||
          scope.selectedComponent.automationType === AUTOMATION_TYPE.VISITED_PRODUCTS ||
          scope.selectedComponent.automationType === AUTOMATION_TYPE.CONFIRMATION_ORDER)
          ? false
          : true;
      };

      scope.showExcludeOutsaleProductsControl = function () {
        return scope.selectedComponent &&
          scope.selectedComponent.automationType != AUTOMATION_TYPE.CONFIRMATION_ORDER && scope.selectedComponent.automationType != AUTOMATION_TYPE.PENDING_ORDER;
      };

      scope.onTimeUnitSelected = function (value) {
        scope.selectedComponent.timeUnit = value;
      };

      scope.canEdit = function () {
        return !automation.isReadOnly() || automation.isPaused();
      };
    }
  }
})();
