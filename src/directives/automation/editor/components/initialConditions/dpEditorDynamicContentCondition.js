(function() {
  'use strict';

  angular
    .module('dopplerApp.automation.editor')
    .directive('dpEditorDynamicContentCondition', [
      'automation',
      'COMPONENT_TYPE',
      'selectedElementsService',
      'changesManager',
      dpEditorDynamicContentCondition
    ]);

  function dpEditorDynamicContentCondition(
    automation,
    COMPONENT_TYPE,
    selectedElementsService,
    changesManager
  ) {
    var directive = {
      restrict: 'E',
      scope: {
        component: '='
      },
      link: link,
      templateUrl: 'angularjs/partials/automation/editor/directives/components/initialConditions/dp-editor-dynamic-content-condition.html'
    };


    function link(scope) {
      scope.$watch('component.idThirdPartyApp', function() {
        if (scope.component.idThirdPartyApp) {
          scope.idThirdPartyApp = scope.component.idThirdPartyApp;
        }
      });
      scope.$watch('component.eventIntervalMinutes', function() {
        if (scope.component.eventIntervalMinutes) {
          scope.eventIntervalMinutes = scope.component.eventIntervalMinutes;
        }
      });
      scope.$watch('component.eventIntervalMinutesLabel', function() {
        if (scope.component.eventIntervalMinutesLabel) {
          scope.eventIntervalMinutesLabel = scope.component.eventIntervalMinutesLabel;
        }
      });
      scope.$watch('component.eventWaitMinutes', function() {
        if (scope.component.eventWaitMinutes) {
          scope.eventWaitMinutes = scope.component.eventWaitMinutes;
        }
      });
      scope.$watch('component.availableStock', function() {
        if (scope.component.availableStock) {
          scope.availableStock = scope.component.availableStock;
        }
      });
      /// This Code add a component of type Campaign, as a children of Dynamic Content automation type,
      /// only once inside the initial condition.
      var parent = automation.getAllParentComponents();
      if (parent && parent[1].children.length < 1) {
        var campaign = {
          campaignType: scope.component.automationType,
          parentUid: scope.$parent.component.parentUid,
          type: COMPONENT_TYPE.CAMPAIGN
        };
        automation.addComponent(campaign, scope.$parent.component.parentUid);
        changesManager.setUnsavedChanges(true);

        selectedElementsService.setSelectedComponent(scope.component);
      }
    }

    return directive;
  }
})();
